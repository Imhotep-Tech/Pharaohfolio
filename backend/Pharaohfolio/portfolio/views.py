from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from accounts.models import User
from .models import Portfolio
import bleach
import hashlib
import re
import json
import logging
from Pharaohfolio.settings import SITE_DOMAIN, frontend_url
from django.template.loader import render_to_string
from django.core.mail import send_mail

logger = logging.getLogger(__name__)

# Define allowed HTML tags and attributes for portfolios
ALLOWED_TAGS = [
    'html', 'head', 'body', 'title', 'meta', 'link', 'style',
    'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'a', 'img', 'ul', 'ol', 'li', 'br', 'hr', 'strong', 'em',
    'b', 'i', 'u', 'section', 'article', 'header', 'footer',
    'nav', 'main', 'aside', 'canvas', 'svg', 'table', 'tr', 'td', 'th',
    'thead', 'tbody', 'tfoot', 'form', 'input', 'button', 'textarea',
    'select', 'option'
]

ALLOWED_ATTRIBUTES = {
    '*': ['class', 'id', 'style'],
    'a': ['href', 'target', 'rel'],
    'img': ['src', 'alt', 'width', 'height'],
    'link': ['rel', 'href', 'type'],
    'meta': ['charset', 'name', 'content', 'viewport'],
    'input': ['type', 'name', 'value', 'placeholder', 'required'],
    'button': ['type', 'onclick'],
    'form': ['action', 'method'],
    'canvas': ['width', 'height'],
    'svg': ['width', 'height', 'viewBox', 'xmlns'],
}

# Enhanced sanitization for XSS prevention
DANGEROUS_ATTRIBUTES = [
    'onload', 'onclick', 'onmouseover', 'onerror', 'onsubmit',
    'onfocus', 'onblur', 'onchange', 'onselect', 'onreset',
    'onabort', 'onunload', 'onresize', 'onscroll', 'ondblclick'
]

def sanitize_portfolio_code(code, portfolio_instance=None):
    """
    Enhanced sanitization for XSS prevention with detailed logging and code preservation.
    Returns tuple: (sanitized_code, sanitization_log)
    """
    sanitization_log = []
    original_code = code
    
    # Step 1: Remove dangerous event handlers (but log what we remove)
    removed_attributes = []
    for attr in DANGEROUS_ATTRIBUTES:
        pattern = re.compile(rf'{attr}\s*=\s*["\'][^"\']*["\']', re.IGNORECASE)
        matches = pattern.findall(code)
        if matches:
            removed_attributes.extend(matches)
            code = pattern.sub('', code)
    
    if removed_attributes:
        sanitization_log.append({
            'action': 'removed_dangerous_attributes',
            'details': removed_attributes,
            'count': len(removed_attributes)
        })

    # Step 2: Remove javascript: protocols
    js_protocol_matches = re.findall(r'javascript\s*:[^"\'>\s]+', code, re.IGNORECASE)
    if js_protocol_matches:
        sanitization_log.append({
            'action': 'removed_javascript_protocols',
            'details': js_protocol_matches,
            'count': len(js_protocol_matches)
        })
        js_protocol_pattern = re.compile(r'javascript\s*:', re.IGNORECASE)
        code = js_protocol_pattern.sub('', code)

    # Step 3: Remove data: URLs for scripts (but allow for images)
    data_script_matches = re.findall(r'src\s*=\s*["\']data:[^"\']*?script[^"\']*?["\']', code, re.IGNORECASE)
    if data_script_matches:
        sanitization_log.append({
            'action': 'removed_data_scripts',
            'details': data_script_matches,
            'count': len(data_script_matches)
        })
        # Optimize the regex to avoid inefficiency
        data_script_pattern = re.compile(r'src\s*=\s*["\']data:[^"\']*?script[^"\']*?["\']', re.IGNORECASE)
        code = data_script_pattern.sub('', code)

    # Step 4: Enhanced Bleach sanitization with more permissive settings
    # Allow more CSS properties and attributes for better styling preservation
    enhanced_allowed_attributes = ALLOWED_ATTRIBUTES.copy()
    enhanced_allowed_attributes['*'].extend([
        'data-*', 'aria-*', 'role', 'tabindex', 'contenteditable',
        'draggable', 'spellcheck', 'translate', 'dir', 'lang'
    ])
    
    # Enhanced Bleach sanitization with more permissive settings
    # Remove style attributes to avoid CSS sanitizer warning
    enhanced_allowed_attributes_no_style = {}
    for tag, attrs in enhanced_allowed_attributes.items():
        enhanced_allowed_attributes_no_style[tag] = [attr for attr in attrs if attr != 'style']
    
    sanitized = bleach.clean(
        code,
        tags=ALLOWED_TAGS + ['script', 'iframe', 'embed', 'object', 'param'],
        attributes=enhanced_allowed_attributes_no_style,
        protocols=['http', 'https', 'mailto', 'tel', 'data'],
        strip=True,
        strip_comments=False
    )

    # Step 5: Handle images more intelligently
    # Find all img tags and check their sources
    img_pattern = re.compile(r'<img\b([^>]*?)src=["\']([^"\']*)["\']([^>]*?)>', re.IGNORECASE)
    img_matches = img_pattern.findall(sanitized)
    removed_images = []
    
    def is_allowed_img_src(src):
        allowed_domains = [
            'https://i.imgur.com/',
            'https://live.staticflickr.com/',
            'https://images.unsplash.com/',  # Add Unsplash as allowed
            'https://picsum.photos/',        # Add Lorem Picsum as allowed
        ]
        return any(src.startswith(domain) for domain in allowed_domains)
    
    def replace_img_tag(match):
        full_match = match.group(0)
        before_src = match.group(1)
        src = match.group(2)
        after_src = match.group(3)
        if not is_allowed_img_src(src):
            removed_images.append(src)
            # Replace with a placeholder div instead of removing completely
            return f'<div class="removed-image-placeholder" style="background: #f0f0f0; border: 2px dashed #ccc; padding: 20px; text-align: center; color: #666;">Image removed for security<br><small>Use images from imgur.com, flickr.com, unsplash.com, or picsum.photos</small></div>'
        return full_match
    
    sanitized = img_pattern.sub(replace_img_tag, sanitized)
    
    if removed_images:
        sanitization_log.append({
            'action': 'removed_images',
            'details': removed_images,
            'count': len(removed_images)
        })

    # Step 6: Remove navigation elements (nav, ul with nav classes, etc.)
    nav_elements_removed = []
    
    # Remove nav tags
    nav_matches = re.findall(r'<nav\b[^>]*>.*?</nav>', sanitized, re.IGNORECASE | re.DOTALL)
    if nav_matches:
        nav_elements_removed.extend(nav_matches)
        sanitized = re.sub(r'<nav\b[^>]*>.*?</nav>', '', sanitized, flags=re.IGNORECASE | re.DOTALL)
    
    # Remove ul/ol with navigation classes
    nav_list_matches = re.findall(r'<(ul|ol)\b[^>]*class=["\'][^"\']*nav[^"\']*["\'][^>]*>.*?</\1>', sanitized, re.IGNORECASE | re.DOTALL)
    if nav_list_matches:
        nav_elements_removed.extend(nav_list_matches)
        sanitized = re.sub(r'<(ul|ol)\b[^>]*class=["\'][^"\']*nav[^"\']*["\'][^>]*>.*?</\1>', '', sanitized, flags=re.IGNORECASE | re.DOTALL)
    
    if nav_elements_removed:
        sanitization_log.append({
            'action': 'removed_navigation',
            'details': nav_elements_removed,
            'count': len(nav_elements_removed)
        })

    # Step 7: Log to portfolio instance if provided
    if portfolio_instance and sanitization_log:
        for log_entry in sanitization_log:
            portfolio_instance.add_sanitization_log(log_entry['action'], log_entry['details'])

    return sanitized, sanitization_log

# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def code_operation(request):
    try:
        user_code = request.data.get('user_code')
        user = request.user
        
        if not user_code:
            return Response(
                {'error': 'User code is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Basic validation
        if len(user_code.strip()) < 10:
            return Response(
                {'error': 'Code is too short. Please provide a complete HTML document.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if portfolio already exists for this user
        portfolio, created = Portfolio.objects.get_or_create(user=user)
        
        # Sanitize the user code with detailed logging
        sanitized_code, sanitization_log = sanitize_portfolio_code(user_code, portfolio)
        
        # Update portfolio with sanitized code
        try:
            portfolio.user_code = sanitized_code
            portfolio.save()
        except Exception as e:
            logger.error(f"Failed to save portfolio for user {user.username}: {str(e)}")
            return Response(
                {'error': 'Failed to save user code. Please try again.'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Send email notification only for new portfolios
        if created:
            try:
                mail_subject = 'Your Pharaohfolio Portfolio is Published!'
                message = render_to_string('portfolio_published_email.html', {
                    'user': user,
                    'frontend_url': frontend_url,
                    'portfolio_url': f"{frontend_url}/u/{user.username}",
                })
                send_mail(mail_subject, '', 'imhoteptech1@gmail.com', [user.email], html_message=message)
            except Exception as email_error:
                logger.warning(f"Failed to send portfolio published email: {str(email_error)}")

        # Prepare response with sanitization details
        response_data = {
            'message': f'Portfolio saved successfully! You can access it at {frontend_url}/u/{user.username}',
            'portfolio_url': f"{frontend_url}/u/{user.username}",
            'created': created,
            'sanitization_summary': portfolio.get_sanitization_summary(),
            'changes_made': len(sanitization_log) > 0
        }
        
        # Include detailed sanitization info if changes were made
        if sanitization_log:
            response_data['sanitization_details'] = sanitization_log
            response_data['warning'] = 'Some elements were modified for security. Check the details below.'

        return Response(response_data, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error in code_operation for user {request.user.username if request.user.is_authenticated else 'anonymous'}: {str(e)}")
        return Response(
            {'error': 'An unexpected error occurred. Please try again.'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_code(request):
    try:
        user = request.user
        portfolio = Portfolio.objects.filter(user=user).first()

        if portfolio:
            return Response({
                'user_code': portfolio.user_code,
                'user_code_status': True,
                'sanitization_log': portfolio.sanitization_log,
                'sanitization_summary': portfolio.get_sanitization_summary(),
                'created_at': portfolio.created_at,
                'updated_at': portfolio.updated_at
            })
        else:
            return Response({
                'user_code': '',
                'user_code_status': False,
                'sanitization_log': [],
                'sanitization_summary': 'No portfolio found',
                'created_at': None,
                'updated_at': None
            })
    except Exception as e:
        logger.error(f"Error getting code for user {user.username}: {str(e)}")
        return Response(
            {'error': 'An error occurred while retrieving your code'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def csp_report(request):
    """Handle CSP violation reports"""
    try:
        if request.content_type == 'application/csp-report':
            report = json.loads(request.body.decode('utf-8'))
            logger.warning(f"CSP Violation: {report}")
            return Response({'status': 'received'}, status=200)
        return Response({'error': 'Invalid content type'}, status=400)
    except Exception as e:
        logger.error(f"CSP report error: {e}")
        return Response({'error': 'Failed to process report'}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def public_portfolio(request, username):
    try:
        user = User.objects.filter(username=username).first()
        if not user:
            return Response({'error': 'User not found'}, status=404)
        portfolio = Portfolio.objects.filter(user=user).first()
        if not portfolio or not portfolio.user_code:
            return Response({'error': 'Portfolio not found'}, status=404)
        return Response({'user_code': portfolio.user_code})
    except Exception as e:
        return Response({'error': f'An error occurred'}, status=500)
