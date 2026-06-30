"""
build_metadata.py
=================
Generates `data/parameter_metadata.json` — the rich, machine source-of-truth that
the metadata-driven pytest suite consumes.

It combines two existing OpenRADIX artifacts:
  * the 163-row research schema (IDs, categories, Atomic/Composite, element bounds)
    from  Level 1/Activity 1 - Prompt 1/Prompt1 - Research.txt
  * the 163 wide-table column names (in ID order)
    from  Level 1/Activity 3 - Script 1/Script 1 - Create wide table.txt

and DERIVES a governance + validation profile for each parameter:
  column_name, label, category, description, content_type, granularity, ac,
  minimum_element, maximum_element, min_length, max_length, data_type,
  validation_type, format_constraints, regex_pattern, nullability, nullable,
  delimiter, criticality, confidence_level, data_volatility, update_frequency,
  data_owner, business_rules, data_rules, data_source, validation_mode,
  is_derived_from, allowed_values.

Run:  python tools/build_metadata.py
"""

import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = HERE.parent / "data"
DATA.mkdir(exist_ok=True)

# (id, column_name, category, A/C, minimum_element, maximum_element)
#   minimum_element / maximum_element = composite ELEMENT-COUNT bounds (None for atomic)
PARAMS = [
    (1, "name", "Company Basics", "A", None, None),
    (2, "short_name", "Company Basics", "A", None, None),
    (3, "logo_url", "Company Basics", "C", 1, 5),
    (4, "category", "Company Basics", "A", None, None),
    (5, "incorporation_year", "Company Basics", "A", None, None),
    (6, "overview_text", "Company Narrative", "A", None, None),
    (7, "nature_of_company", "Company Basics", "A", None, None),
    (8, "headquarters_address", "Company Basics", "A", None, None),
    (9, "operating_countries", "Geographic Presence", "C", 1, 10),
    (10, "office_count", "Geographic Presence", "A", None, None),
    (11, "office_locations", "Geographic Presence", "C", 1, 10),
    (12, "employee_size", "People & Talent", "A", None, None),
    (13, "hiring_velocity", "People & Talent", "C", 1, 5),
    (14, "employee_turnover", "People & Talent", "A", None, None),
    (15, "avg_retention_tenure", "People & Talent", "A", None, None),
    (16, "pain_points_addressed", "Business Model", "C", 2, 8),
    (17, "focus_sectors", "Business Model", "C", 1, 10),
    (18, "offerings_description", "Business Model", "C", 2, 10),
    (19, "top_customers", "Business Model", "C", 3, 20),
    (20, "core_value_proposition", "Business Model", "C", 2, 5),
    (21, "vision_statement", "Strategy & Culture", "A", None, None),
    (22, "mission_statement", "Strategy & Culture", "A", None, None),
    (23, "core_values", "Strategy & Culture", "C", 3, 7),
    (24, "unique_differentiators", "Strategy & Culture", "C", 2, 6),
    (25, "competitive_advantages", "Strategy & Culture", "C", 2, 6),
    (26, "weaknesses_gaps", "Strategy & Culture", "C", 1, 5),
    (27, "key_challenges_needs", "Strategy & Culture", "C", 2, 6),
    (28, "key_competitors", "Competitive Landscape", "C", 5, 20),
    (29, "technology_partners", "Competitive Landscape", "C", 2, 8),
    (30, "history_timeline", "Company Narrative", "C", 1, 8),
    (31, "recent_news", "Company Narrative", "C", 2, 8),
    (32, "website_url", "Digital Presence", "A", None, None),
    (33, "website_quality", "Digital Presence", "A", None, None),
    (34, "website_rating", "Digital Presence", "A", None, None),
    (35, "website_traffic_rank", "Digital Presence", "C", None, None),
    (36, "social_media_followers", "Digital Presence", "A", None, None),
    (37, "glassdoor_rating", "Digital Presence", "A", None, None),
    (38, "indeed_rating", "Digital Presence", "A", None, None),
    (39, "google_rating", "Digital Presence", "A", None, None),
    (40, "linkedin_url", "Digital Presence", "A", None, None),
    (41, "twitter_handle", "Digital Presence", "A", None, None),
    (42, "facebook_url", "Digital Presence", "A", None, None),
    (43, "instagram_url", "Digital Presence", "A", None, None),
    (44, "ceo_name", "Leadership", "A", None, None),
    (45, "ceo_linkedin_url", "Leadership", "A", None, None),
    (46, "key_leaders", "Leadership", "C", 2, 5),
    (47, "warm_intro_pathways", "Leadership", "C", 1, 5),
    (48, "decision_maker_access", "Leadership", "A", None, None),
    (49, "primary_contact_email", "Contact Info", "A", None, None),
    (50, "primary_phone_number", "Contact Info", "A", None, None),
    (51, "contact_person_name", "Contact Info", "A", None, None),
    (52, "contact_person_title", "Contact Info", "A", None, None),
    (53, "contact_person_email", "Contact Info", "A", None, None),
    (54, "contact_person_phone", "Contact Info", "A", None, None),
    (55, "awards_recognitions", "Reputation", "C", 1, 8),
    (56, "brand_sentiment_score", "Reputation", "A", None, None),
    (57, "event_participation", "Reputation", "C", 2, 6),
    (58, "regulatory_status", "Risk & Compliance", "C", 1, 6),
    (59, "legal_issues", "Risk & Compliance", "A", None, None),
    (60, "annual_revenue", "Financials", "A", None, None),
    (61, "annual_profit", "Financials", "A", None, None),
    (62, "revenue_mix", "Financials", "C", None, None),
    (63, "valuation", "Financials", "A", None, None),
    (64, "yoy_growth_rate", "Financials", "A", None, None),
    (65, "profitability_status", "Financials", "A", None, None),
    (66, "market_share_percentage", "Financials", "A", None, None),
    (67, "key_investors", "Funding", "C", 2, 6),
    (68, "recent_funding_rounds", "Funding", "C", 1, 5),
    (69, "total_capital_raised", "Funding", "A", None, None),
    (70, "esg_ratings", "Sustainability", "C", 1, 5),
    (71, "sales_motion", "Sales & Growth", "A", None, None),
    (72, "customer_acquisition_cost", "Sales & Growth", "A", None, None),
    (73, "customer_lifetime_value", "Sales & Growth", "A", None, None),
    (74, "cac_ltv_ratio", "Sales & Growth", "A", None, None),
    (75, "churn_rate", "Sales & Growth", "A", None, None),
    (76, "net_promoter_score", "Sales & Growth", "A", None, None),
    (77, "customer_concentration_risk", "Sales & Growth", "A", None, None),
    (78, "burn_rate", "Sales & Growth", "A", None, None),
    (79, "runway_months", "Sales & Growth", "A", None, None),
    (80, "burn_multiplier", "Sales & Growth", "A", None, None),
    (81, "intellectual_property", "Innovation", "C", 1, 6),
    (82, "r_and_d_investment", "Innovation", "A", None, None),
    (83, "ai_ml_adoption_level", "Innovation", "A", None, None),
    (84, "tech_stack", "Operations", "C", 3, 10),
    (85, "cybersecurity_posture", "Operations", "C", 1, 4),
    (86, "supply_chain_dependencies", "Operations", "C", 1, 5),
    (87, "geopolitical_risks", "Operations", "C", 1, 4),
    (88, "macro_risks", "Operations", "C", 1, 4),
    (89, "diversity_metrics", "People & Talent", "C", None, None),
    (90, "remote_policy_details", "People & Talent", "A", None, None),
    (91, "training_spend", "People & Talent", "A", None, None),
    (92, "partnership_ecosystem", "Market", "C", 2, 8),
    (93, "exit_strategy_history", "Market", "C", 1, 3),
    (94, "carbon_footprint", "Sustainability", "A", None, None),
    (95, "ethical_sourcing", "Sustainability", "C", 1, 4),
    (96, "benchmark_vs_peers", "Benchmarking", "C", 3, 6),
    (97, "future_projections", "Forecasting", "A", None, None),
    (98, "strategic_priorities", "Forecasting", "C", 3, 5),
    (99, "industry_associations", "Network", "C", 2, 6),
    (100, "case_studies", "Proof Points", "C", 2, 5),
    (101, "go_to_market_strategy", "Go-to-Market", "C", 3, 6),
    (102, "innovation_roadmap", "Innovation", "C", 2, 6),
    (103, "product_pipeline", "Innovation", "C", 2, 6),
    (104, "board_members", "Governance", "C", 3, 8),
    (105, "marketing_video_url", "Digital Presence", "C", 1, 5),
    (106, "customer_testimonials", "Proof Points", "C", 2, 5),
    (107, "tech_adoption_rating", "Benchmarking", "C", 2, 3),
    (108, "tam", "Market", "A", None, None),
    (109, "sam", "Market", "A", None, None),
    (110, "som", "Market", "A", None, None),
    (111, "work_culture_summary", "Culture & People", "C", 1, 3),
    (112, "manager_quality", "Culture & People", "A", None, None),
    (113, "psychological_safety", "Culture & People", "A", None, None),
    (114, "feedback_culture", "Culture & People", "C", 1, 2),
    (115, "diversity_inclusion_score", "Culture & People", "C", 1, 5),
    (116, "ethical_standards", "Culture & People", "C", 1, 3),
    (117, "typical_hours", "Work-Life Balance", "A", None, None),
    (118, "overtime_expectations", "Work-Life Balance", "A", None, None),
    (119, "weekend_work", "Work-Life Balance", "A", None, None),
    (120, "flexibility_level", "Work-Life Balance", "C", 1, 3),
    (121, "leave_policy", "Work-Life Balance", "C", 1, 4),
    (122, "burnout_risk", "Work-Life Balance", "A", None, None),
    (123, "location_centrality", "Location & Commute", "A", None, None),
    (124, "public_transport_access", "Location & Commute", "C", 1, 4),
    (125, "cab_policy", "Location & Commute", "C", 1, 3),
    (126, "airport_commute_time", "Location & Commute", "A", None, None),
    (127, "office_zone_type", "Location & Commute", "A", None, None),
    (128, "area_safety", "Safety & Well-being", "C", 1, 2),
    (129, "safety_policies", "Safety & Well-being", "C", 1, 4),
    (130, "infrastructure_safety", "Safety & Well-being", "C", 1, 3),
    (131, "emergency_preparedness", "Safety & Well-being", "C", 1, 4),
    (132, "health_support", "Safety & Well-being", "C", 1, 5),
    (133, "onboarding_quality", "Learning & Growth", "A", None, None),
    (134, "learning_culture", "Learning & Growth", "C", 1, 4),
    (135, "exposure_quality", "Learning & Growth", "A", None, None),
    (136, "mentorship_availability", "Learning & Growth", "C", 1, 3),
    (137, "internal_mobility", "Learning & Growth", "A", None, None),
    (138, "promotion_clarity", "Learning & Growth", "C", 1, 3),
    (139, "tools_access", "Learning & Growth", "C", 1, 5),
    (140, "role_clarity", "Role & Work Quality", "A", None, None),
    (141, "early_ownership", "Role & Work Quality", "A", None, None),
    (142, "work_impact", "Role & Work Quality", "C", 1, 3),
    (143, "execution_thinking_balance", "Role & Work Quality", "A", None, None),
    (144, "automation_level", "Role & Work Quality", "A", None, None),
    (145, "cross_functional_exposure", "Role & Work Quality", "C", 1, 4),
    (146, "company_maturity", "Company Stability", "A", None, None),
    (147, "brand_value", "Company Stability", "A", None, None),
    (148, "client_quality", "Company Stability", "C", 1, 5),
    (149, "layoff_history", "Company Stability", "A", None, None),
    (150, "fixed_vs_variable_pay", "Compensation", "A", None, None),
    (151, "bonus_predictability", "Compensation", "A", None, None),
    (152, "esops_incentives", "Compensation", "C", 1, 3),
    (153, "family_health_insurance", "Compensation", "C", 1, 4),
    (154, "relocation_support", "Compensation", "C", 1, 3),
    (155, "lifestyle_benefits", "Compensation", "C", 1, 6),
    (156, "exit_opportunities", "Long-Term Career", "C", 1, 5),
    (157, "skill_relevance", "Long-Term Career", "A", None, None),
    (158, "external_recognition", "Long-Term Career", "A", None, None),
    (159, "network_strength", "Long-Term Career", "C", 1, 3),
    (160, "global_exposure", "Long-Term Career", "C", 1, 3),
    (161, "mission_clarity", "Values Alignment", "A", None, None),
    (162, "sustainability_csr", "Values Alignment", "C", 1, 3),
    (163, "crisis_behavior", "Values Alignment", "A", None, None),
]

# --- validation_type sets ---------------------------------------------------
URL = {"logo_url", "website_url", "linkedin_url", "facebook_url",
       "instagram_url", "ceo_linkedin_url", "marketing_video_url"}
RATING = {"website_rating", "glassdoor_rating", "indeed_rating", "google_rating"}
NUMBER = {"social_media_followers", "yoy_growth_rate",
          "market_share_percentage", "net_promoter_score", "som"}
EMAIL = {"primary_contact_email", "contact_person_email"}
PHONE = {"primary_phone_number", "contact_person_phone"}

NON_NULLABLE = {"name", "short_name", "category", "overview_text",
                "headquarters_address", "website_url", "ceo_name"}

# atomic text fields that hold long prose (-> TEXT instead of VARCHAR(255))
LONG_TEXT = {
    "overview_text", "vision_statement", "mission_statement", "website_quality",
    "legal_issues", "future_projections", "remote_policy_details",
    "decision_maker_access", "brand_sentiment_score", "carbon_footprint",
    "ai_ml_adoption_level", "r_and_d_investment",
}

# --- regex patterns (only where a regex adds value beyond the shape rules) ---
URL_RE = r"^https?://[^\s]+$"
IMG_URL_RE = r"^https?://.*\.(?:png|jpg|jpeg|svg|webp)(?:\?.*)?$"
NAME_RE = r"^[\w\s&.,\-()'À-ſ]+$"
TWITTER_RE = r"^@?[A-Za-z0-9_]{1,15}$"
REGEX_BY_PARAM = {
    "logo_url": IMG_URL_RE,   # stricter than url_shape: must be an image
    "name": NAME_RE,
    "twitter_handle": TWITTER_RE,
}

CATEGORY_OWNER = {
    "Company Basics": "Data Governance", "Company Narrative": "Marketing / Comms",
    "Geographic Presence": "Operations", "People & Talent": "HR / People",
    "Business Model": "Strategy", "Strategy & Culture": "Strategy",
    "Competitive Landscape": "Market Intelligence", "Digital Presence": "Marketing / Branding",
    "Leadership": "Executive Office", "Contact Info": "Sales / CRM",
    "Reputation": "Marketing / Comms", "Risk & Compliance": "Legal / Compliance",
    "Financials": "Finance", "Funding": "Finance", "Sustainability": "ESG / Sustainability",
    "Sales & Growth": "Revenue / Sales", "Innovation": "R&D / Product",
    "Operations": "Operations / IT", "Market": "Market Intelligence",
    "Benchmarking": "Market Intelligence", "Forecasting": "Strategy",
    "Network": "Partnerships", "Proof Points": "Marketing / Comms",
    "Go-to-Market": "Revenue / Sales", "Governance": "Legal / Compliance",
    "Culture & People": "HR / People", "Work-Life Balance": "HR / People",
    "Location & Commute": "Facilities / Admin", "Safety & Well-being": "Facilities / Admin",
    "Learning & Growth": "HR / People", "Role & Work Quality": "HR / People",
    "Company Stability": "Strategy", "Compensation": "HR / People",
    "Long-Term Career": "HR / People", "Values Alignment": "Strategy",
}

DYNAMIC = {"Financials", "Funding", "Sales & Growth", "Company Narrative",
           "Reputation", "Forecasting"}
HIGH_CRIT = {"Financials", "Funding", "Leadership", "Contact Info",
             "Risk & Compliance", "Governance"}
HIGH_CONF = {"Company Basics", "Digital Presence", "Contact Info",
             "Leadership", "Financials"}

IS_DERIVED = {
    "short_name": "name",
    "cac_ltv_ratio": "customer_acquisition_cost; customer_lifetime_value",
}


def validation_type(p):
    if p in URL:
        return "url"
    if p in RATING:
        return "rating"
    if p in NUMBER:
        return "number"
    if p in EMAIL:
        return "email"
    if p in PHONE:
        return "phone"
    return "text"


def sql_type(p, vt, is_composite):
    if is_composite:
        return "TEXT"
    return {
        "url": "TEXT", "email": "VARCHAR(255)", "phone": "VARCHAR(32)",
        "rating": "NUMERIC(3,1)", "number": "VARCHAR(64)",
    }.get(vt, "TEXT" if p in LONG_TEXT else "VARCHAR(255)")


def max_length_for(data_type):
    if data_type.startswith("VARCHAR"):
        return int(data_type[data_type.index("(") + 1: data_type.index(")")])
    if data_type.startswith("NUMERIC"):
        return 6
    return 8000  # TEXT


def content_type_for(p, vt, is_composite):
    if p == "name":
        return "Legal Name"
    if p == "short_name":
        return "Alias / Brand Name"
    base = {"url": "URL", "email": "Email", "phone": "Phone",
            "rating": "Score (0-10)", "number": "Numeric"}.get(vt)
    if base:
        return base
    return "List" if is_composite else "Descriptor"


def format_constraints_for(vt, is_composite):
    if vt == "url":
        return "Valid URL; publicly reachable"
    if vt == "email":
        return "RFC 5322 mailbox"
    if vt == "phone":
        return "Digits, spaces, + and - only"
    if vt == "rating":
        return "Decimal 0.0 - 10.0"
    if vt == "number":
        return "Must contain a numeral"
    if is_composite:
        return "Semicolon-delimited; single line; no empty elements"
    return "UTF-8; single line; trimmed"


def data_source_for(category):
    if category in {"Financials", "Funding"}:
        return "SEC Filings / Annual Reports"
    if category == "Digital Presence":
        return "Official Website / Social Profiles"
    if category in {"Leadership", "Contact Info"}:
        return "LinkedIn / Company Website"
    if category in {"Risk & Compliance", "Governance"}:
        return "Regulatory Filings"
    return "Web Research / Public Sources"


def build():
    out = []
    for (pid, p, category, ac, mn_el, mx_el) in PARAMS:
        is_composite = ac == "C"
        vt = validation_type(p)
        data_type = sql_type(p, vt, is_composite)
        max_len = max_length_for(data_type)
        min_len = 2 if p in {"name", "short_name"} else 1
        nullable = p not in NON_NULLABLE
        is_dynamic = category in DYNAMIC
        criticality = ("Critical" if not nullable
                       else "High" if category in HIGH_CRIT else "Medium")
        out.append({
            "id": pid,
            "column_name": p,
            "label": p.replace("_", " ").title(),
            "category": category,
            "description": f"{p.replace('_', ' ').capitalize()} for the target company.",
            "content_type": content_type_for(p, vt, is_composite),
            "granularity": "Many per Entity" if is_composite else "One per Entity",
            "ac": "Composite" if is_composite else "Atomic",
            "minimum_element": mn_el,
            "maximum_element": mx_el,
            "min_length": min_len,
            "max_length": max_len,
            "data_type": data_type,
            "validation_type": vt,
            "format_constraints": format_constraints_for(vt, is_composite),
            "regex_pattern": REGEX_BY_PARAM.get(p),
            "nullability": "Nullable" if nullable else "Not Null",
            "nullable": nullable,
            "delimiter": ";" if is_composite else None,
            "criticality": criticality,
            "confidence_level": "High" if category in HIGH_CONF else "Medium",
            "data_volatility": ("Static" if category == "Company Basics"
                                else "Dynamic" if is_dynamic else "Low"),
            "update_frequency": ("Quarterly" if is_dynamic
                                 else "Ad-hoc (Change Event)" if category == "Company Basics"
                                 else "Ad-hoc"),
            "data_owner": CATEGORY_OWNER.get(category, "Data Governance"),
            "business_rules": ("Must be present and verified against an authoritative source"
                               if not nullable else "Best-effort; estimate allowed when unavailable"),
            "data_rules": ("Trim whitespace; no emojis; no leading/trailing delimiter"
                           if is_composite else "Trim whitespace; no emojis; single line"),
            "data_source": data_source_for(category),
            "validation_mode": "Automated & Manual" if criticality == "Critical" else "Automated",
            "is_derived_from": IS_DERIVED.get(p, "No"),
            "allowed_values": [],
        })
    return out


if __name__ == "__main__":
    data = build()
    assert len(data) == 163, f"expected 163 params, got {len(data)}"
    out_path = DATA / "parameter_metadata.json"
    out_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"wrote {len(data)} parameters x {len(data[0])} columns -> {out_path}")
