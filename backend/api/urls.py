from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DeveloperViewSet,
    ProjectViewSet,
    PostViewSet,
    QuestionViewSet,
    CommunityViewSet,
    OpportunityViewSet,
    ModerationReportViewSet,
    CompanyViewSet,
    JobApplicationViewSet,
    OpportunityApplicationViewSet,
    SocialViewSet,
    NotificationViewSet,
    platform_stats
)
from .oauth_views import (
    google_auth_url,
    google_exchange_code,
    google_callback_redirect,
    github_auth_url,
    github_exchange_code,
    github_callback_redirect,
    auth_me,
)

router = DefaultRouter()
router.register(r'developers', DeveloperViewSet, basename='developer')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'communities', CommunityViewSet, basename='community')
router.register(r'opportunities', OpportunityViewSet, basename='opportunity')
router.register(r'reports', ModerationReportViewSet, basename='report')
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'applications', JobApplicationViewSet, basename='application')
router.register(r'opportunity-applications', OpportunityApplicationViewSet, basename='opportunity-application')
router.register(r'social', SocialViewSet, basename='social')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', platform_stats, name='platform-stats'),

    # OAuth 2.0 / OpenID Connect Endpoints
    path('auth/google/url/', google_auth_url, name='google-auth-url'),
    path('auth/google/', google_exchange_code, name='google-exchange-code'),
    path('auth/google/callback/', google_callback_redirect, name='google-callback-redirect'),

    path('auth/github/url/', github_auth_url, name='github-auth-url'),
    path('auth/github/', github_exchange_code, name='github-exchange-code'),
    path('auth/github/callback/', github_callback_redirect, name='github-callback-redirect'),

    path('auth/me/', auth_me, name='auth-me'),
]
