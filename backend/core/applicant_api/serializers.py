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
            "job_categories"
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