from rest_framework import serializers
from core.applications.models import ApplicationsDetails
from django.core.exceptions import ObjectDoesNotExist


class ApplicationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationsDetails
        fields = (
            "id",
            "applicant_id",
            "job_id",
            "similarity_score",
            "application_date_time",
            "application_status"
        )

    def create(self, validated_data):
        try:
            application_details = ApplicationsDetails.objects.get(
                applicant_id=validated_data["applicant_id"]
            )
        except ObjectDoesNotExist:
            application_details = ApplicationsDetails.application_objects.create_application_details(
                **validated_data
            )
        return application_details
