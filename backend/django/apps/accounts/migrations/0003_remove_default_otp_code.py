from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0002_otpverification_user_company_name_user_gstin_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="otpverification",
            name="otp_code",
            field=models.CharField(max_length=10),
        ),
    ]
