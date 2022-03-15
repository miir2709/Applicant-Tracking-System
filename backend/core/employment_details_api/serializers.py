from rest_framework import serializers
from core.employment_details.models import EmploymentDetails
from django.core.exceptions import ObjectDoesNotExist

class EmploymentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploymentDetails
        fields = (
            "id",
            "applicant_id",
            "employer_name",
            "employment_period",
            "job_title"
        )

    def create(self, validated_data):
        try:
            employment_details = EmploymentDetails.objects.get(
                applicant_id=validated_data["applicant_id"]
            )
        except ObjectDoesNotExist:
            employment_details = EmploymentDetails.employment_details_objects.create_employment_details(
                **validated_data
            )
        return employment_details