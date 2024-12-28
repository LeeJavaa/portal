# accounts/migrations/0002_create_role_permissions.py
from django.db import migrations


def create_default_role_permissions(apps, schema_editor):
    RolePermission = apps.get_model('accounts', 'RolePermission')

    # Define default permissions for each role
    default_permissions = [
        {
            'role': 'FREE',
            'can_create_public_analyses': False,
            'max_custom_analyses_per_month': 5,
            'max_private_analyses_per_month': 3,
        },
        {
            'role': 'CHALLENGER',
            'can_create_public_analyses': False,
            'max_custom_analyses_per_month': 20,
            'max_private_analyses_per_month': 15,
        },
        {
            'role': 'PRO',
            'can_create_public_analyses': False,
            'max_custom_analyses_per_month': 200,
            'max_private_analyses_per_month': 100,
        },
        {
            'role': 'ADMIN',
            'can_create_public_analyses': True,
            'max_custom_analyses_per_month': 200,
            'max_private_analyses_per_month': 100,
        },
    ]

    for perm in default_permissions:
        RolePermission.objects.create(**perm)


def delete_role_permissions(apps, schema_editor):
    RolePermission = apps.get_model('accounts', 'RolePermission')
    RolePermission.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_role_permissions,
                             delete_role_permissions),
    ]