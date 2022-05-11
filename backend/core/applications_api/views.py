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
from django.http.multipartparser import MultiPartParser
import smtplib


def get_similarity_score(parsed_job_description, all_parsed_resumes, ids, weight, exps):
    data = pd.DataFrame({"ids": ids, "Skills": all_parsed_resumes})

    forest = get_forest(data)
    if len(ids) == 1:
        num_reco = 1
    else:
        num_reco = len(ids)//2
    recommendations = predict(parsed_job_description, data, 128, num_reco, forest)
    result = pd.DataFrame({"ids": ids, "Exp": exps, "tfidf_all": [0] * len(ids), "tfidf_ind": [0] * len(ids), "is_recommended": [""]*len(ids)})
    if len(ids) > 1 and result['Exp'].max() > result['Exp'].min():
        result['normal_exp'] = ((result['Exp'] - result['Exp'].min())/(result['Exp'].max() - result['Exp'].min()))
    else:
        result['normal_exp'] = 0
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
    result['final_score'] = weight*result['normal_exp'] + (1-weight)*result['similarity_score']
    print(result)
    return result[["ids", "final_score", "is_recommended"]]

def send_emails(job_post):
    applicants = ApplicantDetails.applicant_objects.all()
    email_ids = []
    for app in applicants:
        if app.user_id.email in ['kaushikmetha7@gmail.com', 'metkaushik10@gmail.com']:
            email_ids.append(app.user_id.email)
    print(email_ids)
    print(job_post.job_title)
    msg = f"Job Title: {job_post.job_title}\n\nJob Category:  {job_post.job_category} \nLocation:  {job_post.location} \n    Vacancy: {job_post.no_of_openings} \n    Deadline: {job_post.application_deadline}"
    EMAIL_ADDRESS = "c10lyp.ats@gmail.com"
    EMAIL_PASSWORD = "lyproject@10ats"

    with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
        smtp.ehlo()
        smtp.starttls()
        smtp.ehlo()
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.sendmail(EMAIL_ADDRESS, email_ids, msg)

def send_email(application):
    APPLIED = "AP", "Applied"
    REVIEW = "RE", "Under Review"
    SCHEDULED = "SC", "Scheduled for Interview"
    ACCEPTED = "AC", "Accepted"
    REJECTED = "RJ", "Rejected"
    PENDING = "PE", "Pending"
    mapping = {"AP": "Applied", "RE": "Under Review", "SC": "Scheduled for Interview", "AC": "Accepted", "RJ": "Rejected", "PE": "Pending"}
    receiver = [application.applicant_id.user_id.email]
    application_status = mapping[application.application_status]
    print(application_status)
    msg = f"Hello {application.applicant_id.user_id.first_name} \n There has been an update of your application status for the job of {application.job_id.job_title} at {application.job_id.recruiter_id.company_name}. \n Your application status currently is {application_status}"
    EMAIL_ADDRESS = "c10lyp.ats@gmail.com"
    EMAIL_PASSWORD = "lyproject@10ats"

    with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
        smtp.ehlo()
        smtp.starttls()
        smtp.ehlo()
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.sendmail(EMAIL_ADDRESS, receiver, msg)

class ApplicationsViewSet(viewsets.ModelViewSet):
    queryset = ApplicationsDetails.application_objects.all()
    serializer_class = ApplicationsSerializer
    http_method_names = ["get", "post", "put", "delete", "patch"]

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        obj =  super().update(request, *args, **kwargs)
        application = get_object_or_404(ApplicationsDetails, id=kwargs["pk"])
        send_email(application)
        return obj

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
        exps = []
        if len(serializer.data) > 0:
            parsed_job_description = serializer.data[0]["job_id"][
                "parsed_job_description"
            ]
            weight = serializer.data[0]['job_id']['weightage']
            for data in serializer.data:
                all_parsed_resumes.append(data["parsed_resume"])
                ids.append(data["id"])
                exps.append(data['years_of_experience'])
            # print(parsed_job_description, all_parsed_resumes, ids)
            similarity_scores = get_similarity_score(
                parsed_job_description, all_parsed_resumes, ids, weight/100, exps
            )
            for data in serializer.data:
                curr_id = data["id"]
                score = similarity_scores[similarity_scores["ids"] == curr_id][
                    "final_score"
                ].values[0]
                data["similarity_score"] = int(score * 100)
                try:
                    data['is_recommended'] = similarity_scores[similarity_scores["ids"] == curr_id]['is_recommended'].values[0]
                except:
                    pass
        return Response(serializer.data)
