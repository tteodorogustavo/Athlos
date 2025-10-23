from django.apps import AppConfig


class AcademiasConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "academias"

    def ready(self):
        import academias.signals  # noqa
