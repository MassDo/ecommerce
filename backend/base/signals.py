from django.db.models.signals import pre_save
from django.contrib.auth.models import User


# when model User is modified the updateUser function is triggered

def updateUser(sender, instance, **kwargs):
    user = instance
    if user.email != '':
        user.username = user.email

pre_save.connect(updateUser, sender=User)