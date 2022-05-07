from rest_framework.routers import SimpleRouter
from core.user.viewsets import UserViewSet
from core.auth.viewsets import LoginViewSet, RegistrationViewSet, RefreshViewSet
from .edu_api.views import EducationViewSet, EducationByApplicantViewSet
from .employment_details_api.views import EmploymentDetailsViewSet, EmploymentDetailsByApplicantViewSet
from .applicant_api.views import ApplicantViewSet, ApplicantByUserViewSet
from .recruiter_api.views import RecruiterViewSet, RecruiterByUserViewSet
from .job_posts_api.views import (
    JobPostsViewSet,
    JobPostsByLocationViewSet,
    JobPostsByRecruiterViewSet,
    JobPostsByRViewSet,
    JobPostsByCompViewSet,
)
from .applications_api.views import (
    ApplicationsViewSet,
    ApplicationsByJobViewSet,
    ApplicationsByApplicantViewSet,
)


routes = SimpleRouter()

# AUTHENTICATION
routes.register(r"auth/login", LoginViewSet, basename="auth-login")
routes.register(r"auth/register", RegistrationViewSet, basename="auth-register")
routes.register(r"auth/refresh", RefreshViewSet, basename="auth-refresh")

# USER
routes.register(r"user", UserViewSet, basename="user")

routes.register(r"edu", EducationViewSet, basename="edu")
routes.register(r"edu/applicant", EducationByApplicantViewSet, basename="edu-applicant")
routes.register(r"recruiter", RecruiterViewSet, basename="recruiter")
routes.register(r"recruiter/user", RecruiterByUserViewSet, basename="recruiter")
routes.register(
    r"job_posts/user",
    JobPostsByRecruiterViewSet,
    basename="job_posts_by_recruiter",
)
routes.register(
    r"job_posts/rec",
    JobPostsByRViewSet,
    basename="job_posts_by_rec",
)
routes.register(
    r"job_posts/location",
    JobPostsByLocationViewSet,
    basename="job_posts_by_location",
)
routes.register(
    r"job_posts/company",
    JobPostsByCompViewSet,
    basename="job_posts_by_company_name",
)
routes.register(r"job_posts", JobPostsViewSet, basename="job_posts")
routes.register(
    r"employment_details", EmploymentDetailsViewSet, basename="employment_details"
)
routes.register(
    r"employment_details/applicant", EmploymentDetailsByApplicantViewSet, basename="employment_details_applicant"
)
routes.register(r"applicant", ApplicantViewSet, basename="applicant")
routes.register(r"applicant/user", ApplicantByUserViewSet, basename="applicant_by_user")
routes.register(
    r"application/job_id", ApplicationsByJobViewSet, basename="application_by_job"
)
routes.register(
    r"application/user_id",
    ApplicationsByApplicantViewSet,
    basename="application_by_user",
)
routes.register(r"application", ApplicationsViewSet, basename="application")


urlpatterns = [*routes.urls]
