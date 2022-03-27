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
        )
        depth = 2

    def __init__(self, *args, **kwargs):
        super(ApplicationsSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request != None and (
            request.method == "POST"
            or request.method == "PUT"
            or request.method == "DELETE"
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

    def update(self, instance, validated_data):
        try:
            instance = ApplicationsDetails.objects.get(
                applicant_id=validated_data["applicant_id"]
            )
            instance.applicant_id = validated_data.get(
                "applicant_id", instance.applicant_id
            )
            instance.job_id = validated_data.get("job_id", instance.job_id)
            instance.similarity_score = validated_data.get(
                "similarity_score", instance.similarity_score
            )
            instance.application_status = validated_data.get(
                "application_status", instance.application_status
            )
            instance.resume = validated_data.get("resume", instance.resume)
            instance.parsed_resume = validated_data.get(
                "parsed_resume", instance.parsed_resume
            )
            instance.save()
        except:
            print("wrong update")
        return instance
