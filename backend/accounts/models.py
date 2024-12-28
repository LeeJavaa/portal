from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', UserRole.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class UserRole(models.TextChoices):
    FREE = 'FREE', 'Free'
    CHALLENGER = 'CHALLENGER', 'Challenger'
    PRO = 'PRO', 'Pro'
    ADMIN = 'ADMIN', 'Admin'

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.FREE
    )

    # Override the groups field from PermissionsMixin
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='custom_user_set',
        related_query_name='custom_user'
    )

    # Override the user_permissions field from PermissionsMixin
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='custom_user_set',
        related_query_name='custom_user'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if self.last_login is None:
            self.last_login = timezone.now()
        super().save(*args, **kwargs)

class RolePermission(models.Model):
    """Define permissions for each role."""
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        unique=True
    )
    # Add your permission flags here
    can_create_public_analyses = models.BooleanField(default=True)
    max_custom_analyses_per_month = models.PositiveIntegerField(default=5)
    max_private_analyses_per_month = models.PositiveIntegerField(default=3)

    class Meta:
        db_table = 'role_permissions'

    def __str__(self):
        return f"{self.role} Permissions"
