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

def sanitize_script_content(script_content):
    """Sanitize JavaScript content to remove dangerous patterns while preserving functionality"""
    if not script_content:
        return script_content
    
    # Dangerous JavaScript patterns to remove/neutralize
    dangerous_patterns = [
        # Direct alert/confirm/prompt calls
        (r'\balert\s*\(', 'console.log('),
        (r'\bconfirm\s*\(', 'console.log('),
        (r'\bprompt\s*\(', 'console.log('),
        
        # eval and similar dangerous functions
        (r'\beval\s*\(', '// blocked eval('),
        (r'\bFunction\s*\(', '// blocked Function('),
        (r'\bsetTimeout\s*\(\s*["\'][^"\']*["\']', '// blocked setTimeout with string'),
        (r'\bsetInterval\s*\(\s*["\'][^"\']*["\']', '// blocked setInterval with string'),
        
        # Document methods that can be dangerous
        (r'\bdocument\.write\s*\(', 'console.log('),
        (r'\bdocument\.writeln\s*\(', 'console.log('),
        
        # Location/navigation changes (more comprehensive)
        (r'\bwindow\.parent\.location\s*=', '// blocked window.parent.location ='),
        (r'\bwindow\.location\s*=', '// blocked window.location ='),
        (r'\blocation\.href\s*=', '// blocked location.href ='),
        (r'\blocation\.replace\s*\(', '// blocked location.replace('),
        (r'\blocation\.assign\s*\(', '// blocked location.assign('),
        (r'\btop\.location\s*=', '// blocked top.location ='),
        (r'\bparent\.location\s*=', '// blocked parent.location ='),
        
        # Cookie access (order matters - more specific first)
        (r'\bdocument\.cookie\s*=', '// blocked document.cookie ='),
        (r'\bdocument\.cookie\b(?!\s*=)', 'null /* blocked document.cookie */'),
        
        # External script injection
        (r'document\.createElement\s*\(\s*["\']script["\']', 'null /* blocked script creation */'),
        
        # innerHTML with script content (basic detection)
        (r'\.innerHTML\s*=\s*["\'][^"\']*<script[^"\']*["\']', '// blocked innerHTML with script'),
        
        # Frame busting and sandboxing escape attempts
        (r'\btop\s*!=\s*self', '// blocked frame busting'),
        (r'\bself\s*!=\s*top', '// blocked frame busting'),
        (r'\bwindow\.top\s*!=\s*window', '// blocked frame busting'),
    ]
    
    sanitized = script_content
    for pattern, replacement in dangerous_patterns:
        sanitized = re.sub(pattern, replacement, sanitized, flags=re.IGNORECASE | re.MULTILINE)
    
    return sanitized

def sanitize_portfolio_code(code):
    """Enhanced sanitization for XSS prevention with CSP compliance and imgur/flickr-only images"""
    # Remove dangerous event handlers
    for attr in DANGEROUS_ATTRIBUTES:
        pattern = re.compile(rf'{attr}\s*=\s*["\'][^"\']*["\']', re.IGNORECASE)
        code = pattern.sub('', code)

    # Remove javascript: protocols
    js_protocol_pattern = re.compile(r'javascript\s*:', re.IGNORECASE)
    code = js_protocol_pattern.sub('', code)

    # Remove data: URLs for scripts (but allow for images)
    data_script_pattern = re.compile(r'src\s*=\s*["\']data:[^"\']*script[^"\']*["\']', re.IGNORECASE)
    code = data_script_pattern.sub('', code)

    # Extract and sanitize script contents before bleach processing
    # Use a more careful approach to handle script tags in strings
    script_parts = []
    current_pos = 0
    
    while True:
        # Find next script opening tag
        script_start = code.find('<script', current_pos)
        if script_start == -1:
            # Add remaining content
            script_parts.append(code[current_pos:])
            break
        
        # Add content before script tag
        script_parts.append(code[current_pos:script_start])
        
        # Find end of opening tag
        tag_end = code.find('>', script_start)
        if tag_end == -1:
            # Malformed tag, add as-is and continue
            script_parts.append(code[script_start:])
            break
        
        opening_tag = code[script_start:tag_end + 1]
        
        # Find matching closing tag, being careful about quoted strings
        content_start = tag_end + 1
        pos = content_start
        while pos < len(code):
            # Look for </script> not in quotes
            close_pos = code.find('</script>', pos)
            if close_pos == -1:
                # No closing tag found, treat rest as content
                script_content = code[content_start:]
                closing_tag = ''
                current_pos = len(code)
                break
            
            # Check if this </script> is in quotes by counting quotes before it
            text_before = code[content_start:close_pos]
            # Simple heuristic: if we have an even number of unescaped quotes before this point,
            # it's probably not in a string
            quote_count = text_before.count('"') - text_before.count('\\"')
            quote_count += text_before.count("'") - text_before.count("\\'")
            
            if quote_count % 2 == 0:
                # Likely not in quotes, this is our closing tag
                script_content = code[content_start:close_pos]
                closing_tag = '</script>'
                current_pos = close_pos + 9
                break
            else:
                # Likely in quotes, keep looking
                pos = close_pos + 9
                continue
        
        # Sanitize the script content
        safe_content = sanitize_script_content(script_content)
        
        # Add the sanitized script
        script_parts.append(opening_tag + safe_content + closing_tag)
    
    # Reconstruct the code
    code = ''.join(script_parts)

    # Bleach sanitization (allow script tags)
    sanitized = bleach.clean(
        code,
        tags=ALLOWED_TAGS + ['script'],
        attributes=ALLOWED_ATTRIBUTES,
        protocols=['http', 'https', 'mailto', 'tel'],
        strip=True,
        strip_comments=False
    )

    # Allow only <img> tags with src from imgur or flickr direct CDN
    def is_allowed_img_src(src):
        return (
            src.startswith('https://i.imgur.com/')
            or src.startswith('https://live.staticflickr.com/')
        )

    # Remove all <img> tags not from allowed sources
    sanitized = re.sub(
        r'<img\b([^>]*?)src=["\'](?!https://i\.imgur\.com/|https://live\.staticflickr\.com/)[^"\']*["\']([^>]*?)>',
        '', sanitized, flags=re.IGNORECASE
    )

    return sanitized

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

        # Sanitize the user code before saving
        sanitized_code = sanitize_portfolio_code(user_code)

        # Check if portfolio already exists for this user then create it
        if not Portfolio.objects.filter(user=user).exists():
            try:
                portfolio = Portfolio.objects.create(
                    user=user,
                    user_code=sanitized_code,
                )
                portfolio.save()
            except Exception as e:
                return Response(
                    {'error': f'Failed to save user code'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Send email: Portfolio Published
            try:
                mail_subject = 'Your Pharaohfolio Portfolio is Published!'
                message = render_to_string('portfolio_published_email.html', {
                    'user': user,
                    'frontend_url': frontend_url,
                    'portfolio_url': f"{frontend_url}/u/{user.username}",
                })
                send_mail(mail_subject, '', 'imhoteptech1@gmail.com', [user.email], html_message=message)
            except Exception as email_error:
                print(f"Failed to send portfolio published email: {str(email_error)}")
        else:
            existing_portfolio = Portfolio.objects.get(user=user)
            # Update the user code
            try:
                existing_portfolio.user_code = sanitized_code
                existing_portfolio.save()
            except Exception:   
                return Response(
                    {'error': f'Failed to save user code'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # Send email: Portfolio Updated
            #! Removed for now because it's sending a lot of emails if a user updates it multiple times in row and it slows down
            # try:
            #     mail_subject = 'Your Pharaohfolio Portfolio Has Been Updated'
            #     message = render_to_string('portfolio_updated_email.html', {
            #         'user': user,
            #         'frontend_url': frontend_url,
            #         'portfolio_url': f"{frontend_url}/u/{user.username}",
            #     })
            #     send_mail(mail_subject, '', 'imhoteptech1@gmail.com', [user.email], html_message=message)
            # except Exception as email_error:
            #     print(f"Failed to send portfolio updated email: {str(email_error)}")

        return Response(
            {'message': f'User Portfolio Saved Successfully you can access it at {frontend_url}/{user.username}'}, 
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {'error': f'An error occurred during saving user code'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_code(request):
    try:
        user = request.user
        user_code_status = Portfolio.objects.filter(user=user).exists()

        if user_code_status:
            portfolio_user_code = Portfolio.objects.get(user=user).user_code
        else:
            portfolio_user_code = ''

        return Response({
            'user_code': portfolio_user_code,
            'user_code_status': user_code_status
        })
    except Exception as e:
        return Response(
            {'error': f'An error occurred during getting user code'}, 
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
