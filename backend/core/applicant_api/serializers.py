from rest_framework import serializers
from core.applicant.models import ApplicantDetails
from django.core.exceptions import ObjectDoesNotExist



class ApplicantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicantDetails
        fields = (
            "id",
            "applicant_id",
            "resume",
            "preferred_location",
            "job_categories",
            "parsed_resume",
        )
    
    def create(self, validated_data):
        try:
            applicant_details = ApplicantDetails.objects.get(
                applicant_id=validated_data["applicant_id"]
            )
        except ObjectDoesNotExist:
            applicant_details = ApplicantDetails.applicant_objects.create_applicant_details(
                **validated_data
            )
        return applicant_details

    def update(self, instance, validated_data):
        try:
            instance = ApplicantDetails.objects.get(
                applicant_id=validated_data["applicant_id"]
            )
            instance.applicant_id = validated_data.get('applicant_id', instance.applicant_id)
            instance.resume = validated_data.get('resume', instance.resume)
            instance.preferred_location = validated_data.get('preferred_location', instance.preferred_location)
            instance.job_categories = validated_data.get('job_categories', instance.job_categories)
            instance.save()
        except:
            print("wrong update")
        return instance
        
        