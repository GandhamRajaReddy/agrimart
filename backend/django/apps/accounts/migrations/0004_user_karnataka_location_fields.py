from django.db import migrations, models


def normalize_legacy_locations(apps, schema_editor):
    User = apps.get_model("accounts", "User")
    User.objects.filter(location="Indore, Madhya Pradesh").update(location="Karnataka")
    User.objects.filter(mandi="Indore Grain Mandi").update(mandi="")


def reverse_legacy_locations(apps, schema_editor):
    # Location values are user profile data; don't restore an inaccurate placeholder.
    pass


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
        migrations.AlterField(
            model_name="user",
            name="mandi",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
        migrations.RunPython(normalize_legacy_locations, reverse_legacy_locations),
    ]
