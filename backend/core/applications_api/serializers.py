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
            "application_status",
            "resume",
            "parsed_resume",
            "annotated_resume_filename",
            "years_of_experience",
        )
        depth = 2

    def __init__(self, *args, **kwargs):
        super(ApplicationsSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request != None and (
            request.method == "POST"
            or request.method == "PUT"
            or request.method == "DELETE"
            or request.method == "PATCH"
        ):
            self.Meta.depth = 0
        else:
            self.Meta.depth = 2

    def create(self, validated_data):
        application_details = (
            ApplicationsDetails.application_objects.create_application_details(
                **validated_data
            )
        )
        return application_details

    
