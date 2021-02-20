from django.apps import AppConfig


class BaseConfig(AppConfig):
    # set email as username
    user = instance
    if user.email != '':
        user.username = user.email

    def ready(self):
        import base.signals
