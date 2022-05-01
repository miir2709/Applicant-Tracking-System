# Generated by Django 3.1.1 on 2022-05-01 11:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job_posts', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='jobposts',
            name='job_description',
        ),
        migrations.AddField(
            model_name='jobposts',
            name='job_description_file',
            field=models.FileField(default='settings.MEDIA_ROOT/resumes/Resume.pdf', upload_to='job_description/'),
        ),
    ]
