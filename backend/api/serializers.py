from rest_framework import serializers
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
    RecruiterProfile,
    Follow,
    CompanyFollow,
    CommunityMembership,
    ProjectWatch,
    UserBlock,
    UserMute,
    Notification
)

class DeveloperSerializer(serializers.ModelSerializer):
    is_online = serializers.ReadOnlyField()
    activity_status = serializers.ReadOnlyField()

    class Meta:
        model = Developer
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class CommunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = '__all__'


class OpportunitySerializer(serializers.ModelSerializer):
    applications_count = serializers.IntegerField(source='applications.count', read_only=True)

    class Meta:
        model = Opportunity
        fields = '__all__'


class ModerationReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModerationReport
        fields = '__all__'


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = '__all__'


class OpportunityApplicationDetailSerializer(serializers.ModelSerializer):
    opportunity_title = serializers.CharField(source='opportunity.title', read_only=True)
    company_name = serializers.CharField(source='opportunity.company', read_only=True)
    opp_type = serializers.CharField(source='opportunity.opp_type', read_only=True)

    class Meta:
        model = OpportunityApplication
        fields = [
            'id', 'reference', 'opportunity', 'opportunity_title', 'company_name', 'opp_type',
            'full_name', 'email', 'phone', 'country', 'github', 'linkedin',
            'motivation', 'details', 'cv', 'stage', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'reference', 'created_at', 'updated_at']


class OpportunityApplicationCreateSerializer(serializers.ModelSerializer):
    terms_accepted = serializers.BooleanField(write_only=True, required=True)
    edit_token = serializers.CharField(read_only=True)

    class Meta:
        model = OpportunityApplication
        fields = [
            'id', 'reference', 'opportunity', 'full_name', 'email', 'phone',
            'country', 'github', 'linkedin', 'motivation', 'details', 'cv',
            'stage', 'terms_accepted', 'edit_token', 'created_at'
        ]
        read_only_fields = ['id', 'reference', 'stage', 'created_at', 'edit_token']

    def validate_terms_accepted(self, value):
        if not value:
            raise serializers.ValidationError("Vous devez accepter les conditions pour soumettre votre candidature.")
        return value

    def create(self, validated_data):
        validated_data.pop('terms_accepted', None)
        from django.utils import timezone
        application = OpportunityApplication(**validated_data)
        application.terms_accepted_at = timezone.now()
        edit_token = application.issue_token()
        application.save()
        application.edit_token = edit_token
        return application


class CompanySerializer(serializers.ModelSerializer):
    applications = JobApplicationSerializer(many=True, read_only=True)
    opportunity_applications_count = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = '__all__'

    def get_opportunity_applications_count(self, obj):
        return OpportunityApplication.objects.filter(opportunity__owner_company=obj).count()


class FollowSerializer(serializers.ModelSerializer):
    follower_name = serializers.CharField(source='follower.name', read_only=True)
    follower_avatar = serializers.CharField(source='follower.avatar', read_only=True)
    follower_country = serializers.CharField(source='follower.country', read_only=True)
    following_name = serializers.CharField(source='following.name', read_only=True)
    following_avatar = serializers.CharField(source='following.avatar', read_only=True)
    following_country = serializers.CharField(source='following.country', read_only=True)

    class Meta:
        model = Follow
        fields = [
            'id', 'follower', 'follower_name', 'follower_avatar', 'follower_country',
            'following', 'following_name', 'following_avatar', 'following_country',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class CompanyFollowSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    company_logo = serializers.CharField(source='company.logo', read_only=True)

    class Meta:
        model = CompanyFollow
        fields = ['id', 'follower', 'company', 'company_name', 'company_logo', 'created_at']
        read_only_fields = ['id', 'created_at']


class CommunityMembershipSerializer(serializers.ModelSerializer):
    community_name = serializers.CharField(source='community.name', read_only=True)
    community_flag = serializers.CharField(source='community.flag', read_only=True)

    class Meta:
        model = CommunityMembership
        fields = ['id', 'developer', 'community', 'community_name', 'community_flag', 'role', 'joined_at']
        read_only_fields = ['id', 'joined_at']


class ProjectWatchSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model = ProjectWatch
        fields = ['id', 'developer', 'project', 'project_title', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserBlockSerializer(serializers.ModelSerializer):
    blocked_name = serializers.CharField(source='blocked.name', read_only=True)

    class Meta:
        model = UserBlock
        fields = ['id', 'blocker', 'blocked', 'blocked_name', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserMuteSerializer(serializers.ModelSerializer):
    muted_name = serializers.CharField(source='muted.name', read_only=True)

    class Meta:
        model = UserMute
        fields = ['id', 'muter', 'muted', 'muted_name', 'created_at']
        read_only_fields = ['id', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


