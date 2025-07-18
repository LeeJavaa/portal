# Generated by Django 5.1.1 on 2024-11-03 05:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analysis', '0003_alter_mapanalysis_series_analysis'),
        ('general', '0002_alter_gamemode_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mapanalysis',
            name='series_analysis',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='analysis.seriesanalysis', unique=True),
        ),
        migrations.AddConstraint(
            model_name='mapanalysis',
            constraint=models.UniqueConstraint(condition=models.Q(('series_analysis__isnull', False)), fields=('series_analysis',), name='unique_map_series'),
        ),
    ]
