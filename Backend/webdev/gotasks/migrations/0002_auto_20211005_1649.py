# Generated by Django 3.2.6 on 2021-10-05 16:49

import ckeditor.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gotasks', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cards',
            name='description',
            field=models.CharField(max_length=250),
        ),
        migrations.AlterField(
            model_name='projects',
            name='project_wiki',
            field=ckeditor.fields.RichTextField(),
        ),
    ]
