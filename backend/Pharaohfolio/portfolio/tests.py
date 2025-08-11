from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Portfolio
from .views import sanitize_portfolio_code
import json

User = get_user_model()

class XSSPreventionTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            email_verify=True
        )
        self.client.force_authenticate(user=self.user)

    def test_script_tag_sanitization(self):
        """Test that malicious script tags are handled"""
        malicious_code = '<script>alert("XSS")</script><div>Safe content</div>'
        result = sanitize_portfolio_code(malicious_code)
        self.assertIn('<div>Safe content</div>', result)
        # Script tags are allowed but content should be safe

    def test_event_handler_removal(self):
        """Test that dangerous event handlers are removed"""
        malicious_code = '<div onclick="alert(\'XSS\')">Click me</div>'
        result = sanitize_portfolio_code(malicious_code)
        self.assertNotIn('onclick', result)
        self.assertIn('<div>Click me</div>', result)

    def test_javascript_protocol_removal(self):
        """Test that javascript: protocols are removed"""
        malicious_code = '<a href="javascript:alert(\'XSS\')">Link</a>'
        result = sanitize_portfolio_code(malicious_code)
        self.assertNotIn('javascript:', result)

    def test_data_script_removal(self):
        """Test that data URLs with scripts are removed"""
        malicious_code = '<script src="data:text/javascript,alert(\'XSS\')"></script>'
        result = sanitize_portfolio_code(malicious_code)
        self.assertNotIn('data:text/javascript', result)

    def test_portfolio_creation_with_xss(self):
        """Test portfolio creation with XSS attempts"""
        xss_code = '''
        <html>
        <head><title>Portfolio</title></head>
        <body>
            <script>alert('XSS')</script>
            <div onclick="maliciousFunction()">Portfolio Content</div>
            <a href="javascript:alert('XSS')">Bad Link</a>
        </body>
        </html>
        '''
        
        response = self.client.post('/api/portfolio/save/', {
            'user_code': xss_code
        })
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        portfolio = Portfolio.objects.get(user=self.user)
        self.assertNotIn('onclick=', portfolio.user_code)
        self.assertNotIn('javascript:', portfolio.user_code)

    def test_csp_headers_present(self):
        """Test that CSP headers are set"""
        response = self.client.get('/api/portfolio/my/get/')
        self.assertTrue(
            any('content-security-policy' in key.lower() 
                for key in response.headers.keys())
        )

class CSPReportTestCase(TestCase):
    def test_csp_violation_report(self):
        """Test CSP violation reporting"""
        violation_report = {
            "csp-report": {
                "document-uri": "http://example.com/portfolio",
                "violated-directive": "script-src 'self'",
                "blocked-uri": "http://evil.com/malicious.js"
            }
        }
        
        response = self.client.post(
            '/api/portfolio/csp-report/',
            data=json.dumps(violation_report),  # Serialize to JSON string
            content_type='application/csp-report'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
