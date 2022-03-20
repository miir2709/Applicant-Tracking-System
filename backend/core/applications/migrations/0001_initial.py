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
            name='ApplicationsDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('similarity_score', models.DecimalField(decimal_places=8, max_digits=10)),
                ('application_date_time', models.DateTimeField(auto_now=True)),
                ('application_status', models.CharField(choices=[('AP', 'Applied'), ('RE', 'Under Review'), ('SC', 'Scheduled for Interview'), ('AC', 'Accepted'), ('RJ', 'Rejected'), ('PE', 'Pending')], default='AP', max_length=2)),
                ('applicant_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core_applicant.applicantdetails')),
            ],
        ),
    ]
