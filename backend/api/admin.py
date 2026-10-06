from django.contrib import admin
from .models import (
    Developer,
    Project,
    Post,
    Question,
    Community,
    Opportunity,
    ModerationReport,
    Company,
    JobApplication,
    OpportunityApplication,
    RecruiterProfile
)

@admin.register(Developer)
class DeveloperAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'country', 'available', 'reputation', 'projects_count')
    list_filter = ('country', 'available')
    search_fields = ('name', 'title', 'city', 'bio')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'country', 'status', 'stars', 'upvotes')
    list_filter = ('category', 'country', 'status')
    search_fields = ('title', 'tagline', 'description')

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'author_country', 'likes', 'comments_count', 'created_at')
    search_fields = ('author_name', 'content')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('title', 'author_name', 'country', 'votes', 'resolved')
    list_filter = ('resolved', 'country')
    search_fields = ('title', 'excerpt')

@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'members_count', 'posts_this_week')
    search_fields = ('name', 'description')

@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'location', 'opp_type', 'deadline', 'is_featured')
    list_filter = ('opp_type', 'is_featured')

@admin.register(ModerationReport)
class ModerationReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'target_type', 'reason', 'reported_by', 'status', 'risk_level')
    list_filter = ('status', 'risk_level', 'target_type')

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'headquarters', 'verified', 'open_jobs', 'total_applicants')

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('candidate_name', 'company', 'role_applied', 'stage', 'rating')
    list_filter = ('stage', 'company')

@admin.register(OpportunityApplication)
class OpportunityApplicationAdmin(admin.ModelAdmin):
    list_display = ('reference', 'full_name', 'email', 'opportunity', 'stage', 'created_at')
    list_filter = ('stage', 'opportunity__opp_type')
    search_fields = ('reference', 'full_name', 'email')

@admin.register(RecruiterProfile)
class RecruiterProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'company')
