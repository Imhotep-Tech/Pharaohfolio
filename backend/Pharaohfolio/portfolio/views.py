from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.models import User
from .models import Portfolio
from Pharaohfolio.settings import frontend_url

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

        # Check if portfolio already exists for this user then create it
        if not Portfolio.objects.filter(user=user).exists():
            try:
                portfolio = Portfolio.objects.create(
                    user=user,
                    user_code=user_code,
                )
                portfolio.save()
            except Exception as e:
                return Response(
                    {'error': f'Failed to save user code: {str(e)}'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            #TODO: add in here an email sending with the new info and the URL and all of the info
        
        else:
            existing_portfolio = Portfolio.objects.get(user=user)
            print(existing_portfolio.user_code)
            # Update the user code
            try:
                existing_portfolio.user_code = user_code
                existing_portfolio.save()
            except Exception:   
                return Response(
                    {'error': f'Failed to save user code'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            #TODO: add in here an email sending with the new info and the URL and all of the info


        return Response(
            {'message': f'User Portfolio Saved Successfully you can access it at {frontend_url}/{user.username}'}, 
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {'error': f'An error occurred during saving user code: {str(e)}'}, 
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
            {'error': f'An error occurred during getting user code: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

