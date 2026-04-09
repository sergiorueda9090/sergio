"""
Template helpers for the marketing navbar / footer.

`section_link` returns the correct href for an in-page section anchor:
- If the user is currently on the homepage, it returns "#home" so the existing
  smooth-scroll JS handles the click.
- If the user is on any sub-page (e.g. /services/api-development/), it returns
  "/#home" so the browser navigates to the homepage and lands on the section.

This is what fixes the bug where clicking nav links on the services pages did
nothing — the old plain-anchor href was caught by `e.preventDefault()` in
scripts.js, found no matching section on the sub-page, and silently aborted.
"""
from django import template
from django.urls import reverse

register = template.Library()


@register.simple_tag(takes_context=True)
def section_link(context, section):
    request = context.get('request')
    home = reverse('mainapp:index')
    if request is not None and request.path == home:
        return f'#{section}'
    return f'{home}#{section}'


@register.simple_tag(takes_context=True)
def is_current(context, url_name):
    """Returns 'active' if the current resolved URL name matches `url_name`."""
    request = context.get('request')
    if request is None or request.resolver_match is None:
        return ''
    return 'active' if request.resolver_match.url_name == url_name else ''
