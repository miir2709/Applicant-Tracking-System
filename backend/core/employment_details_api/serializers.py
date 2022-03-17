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
    
    def update(self, instance, validated_data):
        try:
            instance = EmploymentDetails.objects.get(
                applicant_id=validated_data["applicant_id"]
            )
            instance.applicant_id = validated_data.get('applicant_id', instance.applicant_id)
            instance.employer_name = validated_data.get('employer_name', instance.employer_name)
            instance.employment_period = validated_data.get('employment_period', instance.employment_period)
            instance.job_title = validated_data.get('job_title', instance.job_title)
            instance.save()
        except:
            print("wrong update")
        return instance