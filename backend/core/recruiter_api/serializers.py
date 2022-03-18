from rest_framework import serializers
from core.recruiter.models import RecruiterDetails
from django.core.exceptions import ObjectDoesNotExist


class RecruiterSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruiterDetails
        fields = (
            "id",
            "recruiter_id",
            "company_name",
            "company_website",
            "company_description",
            "corporate_address",
        )

    def create(self, validated_data):
        try:
            recruiter_details = RecruiterDetails.objects.get(
                recruiter_id=validated_data["recruiter_id"]
            )
        except ObjectDoesNotExist:
            recruiter_details = (
                RecruiterDetails.recruiter_objects.create_recruiter_details(
                    **validated_data
                )
            )
        return recruiter_details
