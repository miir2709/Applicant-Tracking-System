from django.db import models
from django.core.validators import RegexValidator

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


class UserManager(BaseUserManager):
    def create_user(
        self,
        phone,
        first_name,
        last_name,
        user_type,
        username,
        email,
        password=None,
        **kwargs,
    ):
        """Create and return a `User` with an email, phone number, username and password."""
        if username is None:
            raise TypeError("Users must have a username.")
        if email is None:
            raise TypeError("Users must have an email.")

        user = self.model(
            username=username,
            phone=phone,
            user_type=user_type,
            first_name=first_name,
            last_name=last_name,
            email=self.normalize_email(email),
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(
        self, phone, first_name, last_name, user_type, username, email, password
    ):
        """
        Create and return a `User` with superuser (admin) permissions.
        """
        if password is None:
            raise TypeError("Superusers must have a password.")
        if email is None:
            raise TypeError("Superusers must have an email.")
        if username is None:
            raise TypeError("Superusers must have an username.")

        user = self.create_user(
            username=username,
            phone=phone,
            user_type=user_type,
            first_name=first_name,
            last_name=last_name,
            email=self.normalize_email(email),
            password=password,
        )
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(db_index=True, max_length=255, unique=True)
    email = models.EmailField(db_index=True, unique=True, null=True, blank=True)
    first_name = models.CharField(max_length=255, default="")
    last_name = models.CharField(max_length=255, default="")
    RECRUITER = "Recruiter"
    APPLICANT = "Applicant"
    TYPES = [(RECRUITER, "Recruiter"), (APPLICANT, "Applicant")]
    user_type = models.CharField(max_length=10, default=APPLICANT, choices=TYPES)
    phone = models.CharField(
        validators=[
            RegexValidator(
                regex="^.{10}$", message="Length has to be 10", code="nomatch"
            )
        ],
        max_length=10,
        default="",
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now=True)
    updated = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name", "phone", "user_type"]

    objects = UserManager()

    def __str__(self):
        return f"{self.email}"
