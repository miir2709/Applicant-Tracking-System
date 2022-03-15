from rest_framework.routers import SimpleRouter
from core.user.viewsets import UserViewSet
from core.auth.viewsets import LoginViewSet, RegistrationViewSet, RefreshViewSet
from .edu_api.views import EducationViewSet
from .employment_details_api.views import EmploymentDetailsViewSet


routes = SimpleRouter()

# AUTHENTICATION
routes.register(r"auth/login", LoginViewSet, basename="auth-login")
routes.register(r"auth/register", RegistrationViewSet, basename="auth-register")
routes.register(r"auth/refresh", RefreshViewSet, basename="auth-refresh")

# USER
routes.register(r"user", UserViewSet, basename="user")

routes.register(r"edu", EducationViewSet, basename="edu")
routes.register(r"employment_details", EmploymentDetailsViewSet, basename="employment_details")

urlpatterns = [*routes.urls]
