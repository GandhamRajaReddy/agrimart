from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0003_remove_default_otp_code"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="district",
            field=models.CharField(blank=True, default="", max_length=100),
        ),
        migrations.AddField(
            model_name="user",
            name="taluk",
            field=models.CharField(blank=True, default="", max_length=100),
        ),
        migrations.AddField(
            model_name="user",
            name="village",
            field=models.CharField(blank=True, default="", max_length=150),
        ),
        migrations.AlterField(
            model_name="user",
            name="location",
            field=models.CharField(blank=True, default="Karnataka", max_length=255),
        ),
    ]
