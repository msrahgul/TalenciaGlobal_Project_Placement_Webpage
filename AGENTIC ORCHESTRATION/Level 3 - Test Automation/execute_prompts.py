import json
import os

def json_to_markdown_table(data):
    if not data:
        return ""
    headers = list(data[0].keys())
    header_row = "| " + " | ".join(headers) + " |"
    separator_row = "| " + " | ".join(["---"] * len(headers)) + " |"
    
    rows = []
    for item in data:
        row = "| " + " | ".join([str(item.get(h, "")) for h in headers]) + " |"
        rows.append(row)
        
    return "\n".join([header_row, separator_row] + rows)

def main():
    # Prompt 1
    with open("data/parameter_metadata.json", "r", encoding="utf-8") as f:
        meta_data = json.load(f)
    
    with open("prompt_1_output.md", "w", encoding="utf-8") as f:
        f.write("# Output for Prompt 1\n\n")
        f.write("## Markdown Table\n\n")
        f.write(json_to_markdown_table(meta_data))
        f.write("\n\n## JSON Array\n\n```json\n")
        json.dump(meta_data, f, indent=2)
        f.write("\n```\n")

    # Prompt 2
    with open("data/master_test_cases.json", "r", encoding="utf-8") as f:
        master_cases = json.load(f)
        
    with open("prompt_2_output.md", "w", encoding="utf-8") as f:
        f.write("# Output for Prompt 2\n\n")
        f.write("## Markdown Table\n\n")
        f.write(json_to_markdown_table(master_cases))
        f.write("\n\n## JSON Array\n\n```json\n")
        json.dump(master_cases, f, indent=2)
        f.write("\n```\n")

    # Prompt 3
    prompt_3_content = """import json
from pathlib import Path
from openradix_tests import rules, registry

ROOT = Path(__file__).resolve().parents[2]
VALID = json.loads((ROOT / "data" / "sample_company_valid.json").read_text())
META = {m["column_name"]: m for m in registry.load_metadata()}

def test_glassdoor_rating_in_range():
    assert rules.rating_range_0_10(VALID["glassdoor_rating"], META["glassdoor_rating"]) is None
    
def test_website_rating_in_range():
    assert rules.rating_range_0_10(VALID["website_rating"], META["website_rating"]) is None

def test_indeed_rating_in_range():
    assert rules.rating_range_0_10(VALID["indeed_rating"], META["indeed_rating"]) is None

def test_google_rating_in_range():
    assert rules.rating_range_0_10(VALID["google_rating"], META["google_rating"]) is None
"""
    with open("prompt_3_output.py", "w", encoding="utf-8") as f:
        f.write(prompt_3_content)

if __name__ == "__main__":
    main()
