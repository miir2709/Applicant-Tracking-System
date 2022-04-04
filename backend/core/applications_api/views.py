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
import numpy as np
from core.Resume_Parser.lsh import get_forest, predict

def get_similarity_score(parsed_job_description, all_parsed_resumes, ids):
    data = pd.DataFrame({"ids": ids, "Skills": all_parsed_resumes})
    forest = get_forest(data)
    if len(ids) == 1:
        num_reco = 1
    else:
        num_reco = len(ids)//2
    recommendations = predict(parsed_job_description, data, 128, num_reco, forest)
    result = pd.DataFrame({"ids": ids, "tfidf_all": [0] * len(ids), "tfidf_ind": [0] * len(ids), "is_recommended": [""]*len(ids)})
    try:
        for i in list(recommendations['ids'].values):
            result.loc[result['ids'] == i, 'is_recommended'] = "Recommended"
    except:
        pass
    corpus = [parsed_job_description] + all_parsed_resumes
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(corpus)
    feature_names = vectorizer.get_feature_names()
    dense = vectors.todense()
    denselist = dense.tolist()
    temp = pd.DataFrame(denselist, columns=feature_names)
    jd = temp.iloc[0, :].values.reshape(1, -1)
    res = temp.iloc[1:, :].values
    result["tfidf_all"] = list(cosine_similarity(jd, res)[0])
    sim_ind = []
    for skills in all_parsed_resumes:
        corpus = [parsed_job_description, skills]
        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform(corpus)
        dense = vectors.todense()
        denselist = dense.tolist()
        sim_ind.append(cosine_similarity([denselist[0]], [denselist[1]])[0][0])
    result["tfidf_ind"] = sim_ind
    result["similarity_score"] = 1 - (0.5 * result["tfidf_all"] + 0.5 * result["tfidf_ind"])
    result['similarity_score'] = 1/np.exp(result["similarity_score"])
    return result[["ids", "similarity_score", "is_recommended"]]


class ApplicationsViewSet(viewsets.ModelViewSet):
    queryset = ApplicationsDetails.application_objects.all()
    serializer_class = ApplicationsSerializer
    http_method_names = ["get", "post", "put", "delete", "patch"]
    
    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


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
        ids = []
        if len(serializer.data) > 0:
            parsed_job_description = serializer.data[0]["job_id"][
                "parsed_job_description"
            ]
            for data in serializer.data:
                all_parsed_resumes.append(data["parsed_resume"])
                ids.append(data["id"])
            # print(parsed_job_description, all_parsed_resumes, ids)
            similarity_scores = get_similarity_score(
                parsed_job_description, all_parsed_resumes, ids
            )
            for data in serializer.data:
                curr_id = data["id"]
                score = similarity_scores[similarity_scores["ids"] == curr_id][
                    "similarity_score"
                ].values[0]
                data["similarity_score"] = int(score * 100)
                try:
                    data['is_recommended'] = similarity_scores[similarity_scores["ids"] == curr_id]['is_recommended'].values[0]
                except:
                    pass
        return Response(serializer.data)
