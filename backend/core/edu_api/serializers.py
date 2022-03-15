from rest_framework import serializers
from core.edu.models import EducationDetails
from django.core.exceptions import ObjectDoesNotExist


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationDetails
        fields = (
            "id",
            "applicant_id",
            "highest_degree",
            "cgpa",
            "graduation_year",
            "university",
            "field_of_study",
        )

    def create(self, validated_data):
        try:
            edu_details = EducationDetails.objects.get(
                applicant_id=validated_data["applicant_id"]
            )
        except ObjectDoesNotExist:
            edu_details = EducationDetails.education_objects.create_edu_details(
                **validated_data
            )
        return edu_details
