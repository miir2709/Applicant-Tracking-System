# Generated by Django 3.2.4 on 2022-03-20 19:43

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='JobPosts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('job_title', models.CharField(max_length=100)),
                ('job_description', models.TextField(max_length=5000)),
                ('job_category', models.CharField(choices=[('EN', 'Engineering'), ('SA', 'Sales'), ('BU', 'Business'), ('ET', 'Entertainment'), ('F', 'Food'), ('O', 'Other')], default='EN', max_length=50)),
                ('location', models.CharField(max_length=200)),
                ('no_of_openings', models.IntegerField()),
                ('application_deadline', models.DateField()),
                ('skills_required', models.TextField(max_length=1000)),
            ],
        ),
    ]
