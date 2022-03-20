from rest_framework import serializers
from core.applicant.models import ApplicantDetails
from django.core.exceptions import ObjectDoesNotExist



class ApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicantDetails
        fields = (
            "id",
            "user_id",
            "resume",
            "job_categories",
            "parsed_resume",
        )
    
    def create(self, validated_data):
        try:
            applicant_details = ApplicantDetails.objects.get(
                user_id=validated_data["user_id"]
            )
        except ObjectDoesNotExist:
            applicant_details = ApplicantDetails.applicant_objects.create_applicant_details(
                **validated_data
            )
        return applicant_details

    def update(self, instance, validated_data):
        try:
            instance = ApplicantDetails.objects.get(
                user_id=validated_data["user_id"]
            )
            instance.user_id = validated_data.get('user_id', instance.user_id)
            instance.resume = validated_data.get('resume', instance.resume)
            instance.job_categories = validated_data.get('job_categories', instance.job_categories)
            instance.save()
        except:
            print("wrong update")
        return instance
        
        