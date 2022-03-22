from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.response import Response
from core.applications.models import ApplicationsDetails
from .serializers import ApplicationsSerializer
from django.shortcuts import get_list_or_404, get_object_or_404
from core.applicant.models import ApplicantDetails
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def get_similarity_score(parsed_job_description, all_parsed_resumes, ids):
    result = pd.DataFrame({'ids': ids, 'tfidf_all': [0]*len(ids), 'tfidf_ind': [0]*len(ids)})
    corpus = [parsed_job_description] + all_parsed_resumes
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(corpus)
    feature_names = vectorizer.get_feature_names()
    dense = vectors.todense()
    denselist = dense.tolist()
    temp = pd.DataFrame(denselist, columns=feature_names)
    jd = temp.iloc[0, :].values.reshape(1, -1)
    res = temp.iloc[1:, :].values
    result['tfidf_all'] = list(cosine_similarity(jd, res)[0])
    
    sim_ind = []
    for skills in all_parsed_resumes:
        corpus = [parsed_job_description, skills]
        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform(corpus)
        dense = vectors.todense()
        denselist = dense.tolist()    
        sim_ind.append(cosine_similarity([denselist[0]], [denselist[1]])[0][0])
    result['tfidf_ind'] = sim_ind
    result['tfidf_all'] = (result['tfidf_all'] - result['tfidf_all'].min())/(result['tfidf_all'].max()-result['tfidf_all'].min())
    result['tfidf_ind'] = (result['tfidf_ind'] - result['tfidf_ind'].min())/(result['tfidf_ind'].max()-result['tfidf_ind'].min())
    result['similarity_score'] = 0.5*result['tfidf_all'] + 0.5*result['tfidf_ind']
    return result[['ids', 'similarity_score']]

class ApplicationsViewSet(viewsets.ModelViewSet):
    queryset = ApplicationsDetails.application_objects.all()
    serializer_class = ApplicationsSerializer
    http_method_names = ["get", "post", "put", "delete"]


class ApplicationsByApplicantViewSet(viewsets.ModelViewSet):
    queryset = ApplicationsDetails.application_objects.all()
    serializer_class = ApplicationsSerializer
    http_method_names = ["get"]

    def retrieve(self, request, *args, **kwargs):
        params = kwargs
        applicant = get_object_or_404(ApplicantDetails, user_id=params["pk"])
        items = ApplicationsDetails.application_objects.filter(
            applicant_id=applicant.id
        )
        serializer = self.serializer_class(items, many=True)
        return Response(serializer.data)


class ApplicationsByJobViewSet(viewsets.ModelViewSet):
    queryset = ApplicationsDetails.application_objects.all()
    serializer_class = ApplicationsSerializer
    http_method_names = ["get"]

    def retrieve(self, request, *args, **kwargs):
        params = kwargs
        items = ApplicationsDetails.application_objects.filter(job_id=params["pk"])
#        print(items)
        serializer = self.serializer_class(items, many=True)
        all_parsed_resumes = []
        parsed_job_description = serializer.data[0]['job_id']['parsed_job_description']
        ids = []
        for data in serializer.data:
            all_parsed_resumes.append(data['parsed_resume'])
            ids.append(data['id'])
        similarity_scores = get_similarity_score(parsed_job_description, all_parsed_resumes, ids)
        for data in serializer.data:
            curr_id = data['id']
            score = similarity_scores[similarity_scores['ids'] == curr_id]['similarity_score'].values[0]
            data['similarity_score'] = int(score*100)

        return Response(serializer.data)
