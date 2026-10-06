from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from api.oauth_views import google_callback_redirect, github_callback_redirect

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # OpenAPI 3 Schema & Interactive API Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # Direct OAuth Callback URIs (registered in Google Cloud & GitHub Developer consoles)
    path('accounts/google/login/callback/', google_callback_redirect, name='google-login-callback'),
    path('accounts/github/login/callback/', github_callback_redirect, name='github-login-callback'),

    # AfrikDev API Endpoints (v1 & direct)
    path('api/v1/', include('api.urls')),
    path('api/', include('api.urls')),
]
