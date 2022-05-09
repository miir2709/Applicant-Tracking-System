from django.shortcuts import render
from rest_framework import generics, viewsets
from core.recruiter.models import RecruiterDetails
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .serializers import RecruiterSerializer


class RecruiterViewSet(viewsets.ModelViewSet):
    queryset = RecruiterDetails.recruiter_objects.all()
    serializer_class = RecruiterSerializer
    http_method_names = ["get", "post", "put", "delete", "patch"]


class RecruiterByUserViewSet(viewsets.ModelViewSet):
    queryset = RecruiterDetails.recruiter_objects.all()
    serializer_class = RecruiterSerializer
    http_method_names = ["get",'patch']

    def retrieve(self, request, *args, **kwargs):
        params = kwargs
        item = get_object_or_404(RecruiterDetails, user_id=params["pk"])
        serializer = self.serializer_class(item)
        return Response(serializer.data)
