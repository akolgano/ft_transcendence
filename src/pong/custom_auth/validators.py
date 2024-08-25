from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class NoSpacesPasswordValidator:
    def validate(self, password, user=None):
        if ' ' in password:
            raise ValidationError(
                _("The password must not contain spaces."),
                code='password_with_spaces',
            )

    def get_help_text(self):
        return _("Your password must not contain any spaces.")