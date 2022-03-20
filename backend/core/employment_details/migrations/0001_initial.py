# Generated by Django 3.2.4 on 2022-03-20 19:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core_applicant', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmploymentDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('employer_name', models.CharField(max_length=250)),
                ('employment_period', models.IntegerField()),
                ('job_title', models.CharField(max_length=250)),
                ('applicant_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core_applicant.applicantdetails')),
            ],
        ),
    ]
