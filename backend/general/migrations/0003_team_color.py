# Generated by Django 5.1.1 on 2024-12-07 04:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('general', '0002_alter_gamemode_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='team',
            name='color',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]
