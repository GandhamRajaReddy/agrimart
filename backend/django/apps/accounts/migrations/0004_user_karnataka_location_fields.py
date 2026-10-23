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
        migrations.AlterField(
            model_name="user",
            name="mandi",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
        migrations.RunPython(
            code=lambda apps, schema_editor: apps.get_model("accounts", "User").objects.filter(location="Indore, Madhya Pradesh").update(location="Karnataka"),
            reverse_code=migrations.RunPython.noop,
        ),
        migrations.RunPython(
            code=lambda apps, schema_editor: apps.get_model("accounts", "User").objects.filter(mandi="Indore Grain Mandi").update(mandi=""),
            reverse_code=migrations.RunPython.noop,
        ),
    ]
