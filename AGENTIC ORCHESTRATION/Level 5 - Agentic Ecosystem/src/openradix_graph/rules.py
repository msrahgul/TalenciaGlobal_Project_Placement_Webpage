"""
rules.py
========
The reusable assertion library for OpenRADIX data-quality testing.

Every rule has the SAME signature:

    def rule(value: str, meta: dict) -> str | None

It returns ``None`` when the value passes, or a short failure-message string
when it fails. ``meta`` is the parameter's metadata row (see
``data/parameter_metadata.json``): keys include ``ac`` (Atomic/Composite),
``data_type``, ``min``, ``max``, ``delimiter``, ``nullable``, ``allowed_values``.

Design notes
------------
* Blank / placeholder handling is owned by ``not_blank`` and ``not_placeholder``
  (which only apply to non-nullable params). Every other rule treats a blank
  value as "nothing to check" and returns ``None`` — so a nullable field that is
  legitimately empty does not trip shape/count rules.
* Shape rules (url/email/phone/number/rating) are *composite-aware*: for a
  composite field they validate every element.
"""

import re

PLACEHOLDERS = {"not found", "n/a", "na", "unknown", "none", "tbd", "-"}

_URL = re.compile(r"^https?://[^\s]+$", re.IGNORECASE)
_EMAIL = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_BULLET = re.compile(r"(^|\s)[•\-\*]\s|\d+\.\s")


def _is_blank(value) -> bool:
    return not str(value).strip()


def _split(value, meta) -> list[str]:
    delim = (meta.get("delimiter") or ";")
    return [p.strip() for p in str(value).split(delim) if p.strip()]


def _values(value, meta) -> list[str]:
    """Whole value for atomic fields; each element for composite fields."""
    if meta.get("ac") == "Composite":
        return _split(value, meta)
    return [str(value).strip()]


# --------------------------------------------------------------------------- #
# Presence rules (apply to non-nullable params)
# --------------------------------------------------------------------------- #
def not_blank(value, meta):
    return None if str(value).strip() else "value is blank"


def not_placeholder(value, meta):
    if _is_blank(value):
        return None  # blank is owned by not_blank
    return f"placeholder value: {value!r}" if str(value).strip().lower() in PLACEHOLDERS else None


# --------------------------------------------------------------------------- #
# Structural rules
# --------------------------------------------------------------------------- #
def atomic_no_delimiter(value, meta):
    if _is_blank(value):
        return None
    return "atomic field contains ';' (should be a single value)" if ";" in str(value) else None


def composite_min_count(value, meta):
    if _is_blank(value):
        return None
    n = len(_split(value, meta))
    lo = meta.get("min") or 1
    return None if n >= lo else f"composite needs >= {lo} elements, got {n}"


def composite_max_count(value, meta):
    if _is_blank(value):
        return None
    hi = meta.get("max")
    if hi is None:
        return None
    n = len(_split(value, meta))
    return None if n <= hi else f"composite allows <= {hi} elements, got {n}"


def composite_elements_nonempty(value, meta):
    if _is_blank(value):
        return None
    delim = (meta.get("delimiter") or ";")
    parts = str(value).split(delim)
    return "empty element between delimiters" if any(not p.strip() for p in parts) else None


def composite_no_trailing_delimiter(value, meta):
    if _is_blank(value):
        return None
    delim = (meta.get("delimiter") or ";")
    return "trailing delimiter" if str(value).rstrip().endswith(delim) else None


def no_newlines(value, meta):
    if _is_blank(value):
        return None
    return "contains a newline (cells must be single-line)" if "\n" in str(value) else None


def no_bullets(value, meta):
    if _is_blank(value):
        return None
    return "contains a bullet/numbered-list marker" if _BULLET.search(str(value)) else None


# --------------------------------------------------------------------------- #
# Typed shape rules (composite-aware)
# --------------------------------------------------------------------------- #
def url_shape(value, meta):
    if _is_blank(value):
        return None
    for v in _values(value, meta):
        if not _URL.match(v):
            return f"not a valid URL: {v!r}"
    return None


def email_shape(value, meta):
    if _is_blank(value):
        return None
    for v in _values(value, meta):
        if not _EMAIL.match(v):
            return f"not a valid email: {v!r}"
    return None


def phone_shape(value, meta):
    if _is_blank(value):
        return None
    for v in _values(value, meta):
        if len(re.sub(r"\D", "", v)) < 7:
            return f"not a valid phone: {v!r}"
    return None


def number_shape(value, meta):
    if _is_blank(value):
        return None
    for v in _values(value, meta):
        if not re.search(r"\d", v):
            return f"no numeric content: {v!r}"
    return None


def rating_range_0_10(value, meta):
    if _is_blank(value):
        return None
    for v in _values(value, meta):
        m = re.search(r"\d+(\.\d+)?", v)
        if not m:
            return f"no numeric rating: {v!r}"
        num = float(m.group())
        if not (0 <= num <= 10):
            return f"rating {num} out of range 0-10"
    return None


def enum_in_allowed(value, meta):
    allowed = [a.lower() for a in (meta.get("allowed_values") or [])]
    if not allowed or _is_blank(value):
        return None
    for v in _values(value, meta):
        if v.lower() not in allowed:
            return f"{v!r} not in allowed set {allowed}"
    return None


def string_max_length(value, meta, limit: int = 8000):
    return None if len(str(value)) <= limit else f"value exceeds {limit} chars"


# --------------------------------------------------------------------------- #
# Hygiene rules
# --------------------------------------------------------------------------- #
def no_leading_trailing_space(value, meta):
    if _is_blank(value):
        return None
    s = str(value)
    return "has leading/trailing whitespace" if s != s.strip() else None


def no_double_space(value, meta):
    if _is_blank(value):
        return None
    return "contains a double space" if "  " in str(value) else None


def not_only_punctuation(value, meta):
    if _is_blank(value):
        return None
    return "value has no alphanumeric content" if not re.search(r"[A-Za-z0-9]", str(value)) else None


def atomic_max_length(value, meta, limit: int = 2000):
    if _is_blank(value):
        return None
    return None if len(str(value)) <= limit else f"atomic value exceeds {limit} chars"


def composite_max_element_length(value, meta, limit: int = 300):
    if _is_blank(value):
        return None
    for v in _split(value, meta):
        if len(v) > limit:
            return f"composite element exceeds {limit} chars: {v[:40]!r}..."
    return None


# Explicit registry: rule_id -> function. Master test cases reference these ids.
REGISTRY = {
    "not_blank": not_blank,
    "not_placeholder": not_placeholder,
    "atomic_no_delimiter": atomic_no_delimiter,
    "composite_min_count": composite_min_count,
    "composite_max_count": composite_max_count,
    "composite_elements_nonempty": composite_elements_nonempty,
    "composite_no_trailing_delimiter": composite_no_trailing_delimiter,
    "no_newlines": no_newlines,
    "no_bullets": no_bullets,
    "url_shape": url_shape,
    "email_shape": email_shape,
    "phone_shape": phone_shape,
    "number_shape": number_shape,
    "rating_range_0_10": rating_range_0_10,
    "enum_in_allowed": enum_in_allowed,
    "string_max_length": string_max_length,
    "no_leading_trailing_space": no_leading_trailing_space,
    "no_double_space": no_double_space,
    "not_only_punctuation": not_only_punctuation,
    "atomic_max_length": atomic_max_length,
    "composite_max_element_length": composite_max_element_length,
}
