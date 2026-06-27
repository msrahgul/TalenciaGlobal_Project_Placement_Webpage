/**
 * src/routes/api/chat.ts
 *
 * TanStack Start server function — Gemini chat proxy with Local NLP fallback.
 *
 * GEMINI_API_KEY lives ONLY in process.env (server-side).
 * This file exports a `createFileRoute` with no component (API-only)
 * and the `chatWithGemini` server function for use by the chatbot.
 *
 * Fallback: If GEMINI_API_KEY is missing, rate-limited (429), or erroring,
 * it parses `src/data/companies_master(Master Data).csv` and uses a keyword-based
 * local NLP query matcher to answer questions accurately from the 100+ CSV fields.
 */

import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

// ── Route (required by TanStack's file-based routing) ────────────────────────
// No component — this is a data/API-only route.
export const Route = createFileRoute("/api/chat")({
  component: () => null,
});

// ── Gemini types ─────────────────────────────────────────────────────────────

interface GeminiPart { text: string }

interface GeminiRequest {
  systemInstruction?: { parts: GeminiPart[] };
  contents: Array<{ role: "user" | "model"; parts: GeminiPart[] }>;
  generationConfig?: { temperature?: number; maxOutputTokens?: number };
}

interface GeminiApiResponse {
  candidates?: Array<{ content: { parts: GeminiPart[] } }>;
  error?: { code: number; message: string };
}

// ── System prompt builder ────────────────────────────────────────────────────

function buildSystemPrompt(companyName: string): string {
  return (
    `You are the "Company Intelligence AI", a specialized corporate analyst chatbot embedded within the KITS Placement Hub platform. ` +
    `Your knowledge base is derived from a comprehensive companies_master dataset with 100+ data points per company. ` +
    `The user is currently viewing: **${companyName}**. ` +
    `Data dimensions: Firmographics, Financials & Growth (Revenue, Valuation, YoY Growth, Funding/Investors), ` +
    `Culture & HR (Work Culture, Leave Policy, Health Support, ESOPs, Burnout Risk, Layoff History, Hiring Velocity), ` +
    `Technology (AI/ML Adoption, Tech Stack, Cloud Partners, Cybersecurity), ` +
    `Operations (Remote Policy, Working Hours, Transport Policy), ` +
    `Competitors & Strategy (Key Competitors, Competitive Advantages, Future Projections, Weaknesses). ` +
    `Rules: Base answers ONLY on the dataset. Acknowledge unavailable (NA) data honestly. ` +
    `Use bullet points and **bold** for key metrics. Be direct and analytical — no filler. ` +
    `CRITICAL: At the very end of your response, ALWAYS provide exactly 3 suggested follow-up questions that the user could ask next. ` +
    `Format these follow-up questions EXACTLY like this (with the triple dash):\n\n` +
    `---\nSuggested questions:\n1. [Question 1]\n2. [Question 2]\n3. [Question 3]`
  );
}

// ── Local NLP Fallback Engine ────────────────────────────────────────────────

interface KeywordMapping {
  keywords: string[];
  title: string;
  emoji: string;
  fields: Array<{ key: string; label: string; format?: "list" | "url" | "text" }>;
}

const MAPPINGS: KeywordMapping[] = [
  {
    keywords: ["culture", "work culture", "environment", "vibe", "atmosphere", "stress", "pressure", "burnout", "overtime", "hours", "weekend", "work hours", "working hours", "psychological", "safety", "manager", "quality", "feedback"],
    title: "Work Culture & Environment",
    emoji: "🏢",
    fields: [
      { key: "work_culture_summary", label: "Culture Summary" },
      { key: "typical_hours", label: "Typical Working Hours" },
      { key: "overtime_expectations", label: "Overtime Expectations" },
      { key: "weekend_work", label: "Weekend Work" },
      { key: "burnout_risk", label: "Burnout Risk" },
      { key: "psychological_safety", label: "Psychological Safety" },
      { key: "manager_quality", label: "Manager Quality" },
      { key: "feedback_culture", label: "Feedback Culture" }
    ]
  },
  {
    keywords: ["tech", "stack", "technology", "languages", "database", "ai", "ml", "artificial intelligence", "machine learning", "cloud", "partner", "ip", "intellectual property", "cyber", "cybersecurity", "r&d", "innovation"],
    title: "Technology Infrastructure & Innovation",
    emoji: "💻",
    fields: [
      { key: "tech_stack", label: "Tech Stack", format: "list" },
      { key: "ai_ml_adoption_level", label: "AI/ML Adoption Level" },
      { key: "technology_partners", label: "Technology Partners", format: "list" },
      { key: "intellectual_property", label: "Proprietary IP" },
      { key: "r_and_d_investment", label: "R&D Investment" },
      { key: "cybersecurity_posture", label: "Cybersecurity Posture" },
      { key: "tech_adoption_rating", label: "Tech Adoption Rating" }
    ]
  },
  {
    keywords: ["salary", "pay", "compensation", "package", "ctc", "variable", "fixed", "esop", "stock", "bonus", "incentive", "benefit", "leave", "insurance", "medical", "health insurance", "relocation", "lifestyle"],
    title: "Compensation, Benefits & HR Policies",
    emoji: "💵",
    fields: [
      { key: "fixed_vs_variable_pay", label: "Fixed vs Variable Pay" },
      { key: "bonus_predictability", label: "Bonus Predictability" },
      { key: "esops_incentives", label: "ESOPs & Incentives" },
      { key: "leave_policy", label: "Leave Policy" },
      { key: "family_health_insurance", label: "Family Health Insurance" },
      { key: "relocation_support", label: "Relocation Support" },
      { key: "lifestyle_benefits", label: "Lifestyle Benefits", format: "list" }
    ]
  },
  {
    keywords: ["remote", "hybrid", "wfh", "wfo", "flexibility", "flexible", "commute", "transport", "cab", "airport", "travel", "office zone"],
    title: "Work Location & Remote Flexibility",
    emoji: "🏠",
    fields: [
      { key: "remote_policy_details", label: "Remote Policy" },
      { key: "flexibility_level", label: "Flexibility Level" },
      { key: "office_zone_type", label: "Office Zone Type" },
      { key: "public_transport_access", label: "Public Transport Access" },
      { key: "cab_policy", label: "Cab Policy" },
      { key: "airport_commute_time", label: "Airport Commute Time" }
    ]
  },
  {
    keywords: ["competitor", "rival", "peer", "benchmark", "market share", "advantage", "strength", "weakness", "gap", "challenge", "threat"],
    title: "Market Strategy & Competitive Landscape",
    emoji: "⚔️",
    fields: [
      { key: "key_competitors", label: "Key Competitors", format: "list" },
      { key: "market_share_percentage", label: "Market Share" },
      { key: "competitive_advantages", label: "Competitive Advantages", format: "list" },
      { key: "weaknesses_gaps", label: "Weaknesses & Gaps", format: "list" },
      { key: "key_challenges_needs", label: "Key Challenges & Needs" },
      { key: "benchmark_vs_peers", label: "Benchmark vs Peers" }
    ]
  },
  {
    keywords: ["ceo", "founder", "leader", "leadership", "boss", "who runs", "board", "management", "executive", "contact", "email", "phone"],
    title: "Leadership & Contact Information",
    emoji: "👥",
    fields: [
      { key: "ceo_name", label: "CEO" },
      { key: "ceo_linkedin_url", label: "CEO LinkedIn", format: "url" },
      { key: "key_leaders", label: "Key Leaders", format: "list" },
      { key: "board_members", label: "Board Members", format: "list" },
      { key: "contact_person_name", label: "Contact Person" },
      { key: "contact_person_title", label: "Contact Title" },
      { key: "contact_person_email", label: "Contact Email" },
      { key: "contact_person_phone", label: "Contact Phone" }
    ]
  },
  {
    keywords: ["layoff", "fire", "fired", "stability", "turnover", "retention", "tenure", "risk", "churn"],
    title: "Job Stability & Layoff History",
    emoji: "⚠️",
    fields: [
      { key: "layoff_history", label: "Layoff History" },
      { key: "employee_turnover", label: "Employee Turnover Rate" },
      { key: "avg_retention_tenure", label: "Average Retention / Tenure" },
      { key: "burnout_risk", label: "Burnout Risk" },
      { key: "macro_risks", label: "Macro Risks", format: "list" }
    ]
  },
  {
    keywords: ["hiring", "recruitment", "velocity", "openings", "positions", "vacancies", "careers", "diversity", "hiring velocity"],
    title: "Hiring & Recruitment Metrics",
    emoji: "💼",
    fields: [
      { key: "hiring_velocity", label: "Hiring Velocity", format: "list" },
      { key: "employee_size", label: "Employee Size" },
      { key: "diversity_metrics", label: "Diversity Metrics" }
    ]
  },
  {
    keywords: ["revenue", "profit", "finance", "valuation", "worth", "funding", "investor", "capital", "growth rate", "yoy", "profitable", "market cap", "investment", "raised"],
    title: "Financials & Growth",
    emoji: "📊",
    fields: [
      { key: "annual_revenue", label: "Annual Revenue" },
      { key: "annual_profit", label: "Annual Profit" },
      { key: "valuation", label: "Valuation" },
      { key: "yoy_growth_rate", label: "YoY Growth Rate" },
      { key: "profitability_status", label: "Profitability Status" },
      { key: "key_investors", label: "Key Investors", format: "list" },
      { key: "recent_funding_rounds", label: "Recent Funding Rounds" },
      { key: "total_capital_raised", label: "Total Capital Raised" }
    ]
  },
  {
    keywords: ["career", "growth", "learning", "training", "spend", "onboard", "mentorship", "mobility", "internal mobility", "promotion", "opportunities", "exposure", "skill relevance"],
    title: "Career Growth & Learning",
    emoji: "📈",
    fields: [
      { key: "training_spend", label: "Training Spend" },
      { key: "onboarding_quality", label: "Onboarding Quality" },
      { key: "learning_culture", label: "Learning Culture" },
      { key: "mentorship_availability", label: "Mentorship Availability" },
      { key: "internal_mobility", label: "Internal Mobility" },
      { key: "promotion_clarity", label: "Promotion Clarity" },
      { key: "global_exposure", label: "Global Exposure" },
      { key: "exit_opportunities", label: "Exit Opportunities" },
      { key: "skill_relevance", label: "Skill Relevance" }
    ]
  },
  {
    keywords: ["safety", "neighborhood", "area safety", "safety policies", "infrastructure safety", "emergency", "preparedness", "health support", "medical"],
    title: "Safety & Wellbeing",
    emoji: "🛡️",
    fields: [
      { key: "area_safety", label: "Area Safety" },
      { key: "safety_policies", label: "Safety Policies" },
      { key: "infrastructure_safety", label: "Infrastructure Safety" },
      { key: "emergency_preparedness", label: "Emergency Preparedness" },
      { key: "health_support", label: "Health Support" }
    ]
  },
  {
    keywords: ["office", "location", "address", "hq", "headquarter", "countries", "cities", "operating", "where is"],
    title: "Offices & HQ Locations",
    emoji: "📍",
    fields: [
      { key: "headquarters_address", label: "Headquarters Address" },
      { key: "operating_countries", label: "Operating Countries", format: "list" },
      { key: "office_count", label: "Office Count" },
      { key: "office_locations", label: "Office Locations", format: "list" }
    ]
  },
  {
    keywords: ["rating", "glassdoor", "indeed", "google rating", "sentiment", "award", "recogni"],
    title: "Brand Sentiment & Ratings",
    emoji: "🏆",
    fields: [
      { key: "glassdoor_rating", label: "Glassdoor Rating" },
      { key: "indeed_rating", label: "Indeed Rating" },
      { key: "google_rating", label: "Google Rating" },
      { key: "awards_recognitions", label: "Awards & Recognitions", format: "list" },
      { key: "brand_sentiment_score", label: "Brand Sentiment" },
      { key: "brand_value", label: "Brand Value" }
    ]
  },
  {
    keywords: ["product", "service", "offering", "customer", "testimonial", "pipeline", "roadmap", "sector", "focus", "pain point"],
    title: "Products & Focus Sectors",
    emoji: "📦",
    fields: [
      { key: "offerings_description", label: "Offerings Description", format: "list" },
      { key: "focus_sectors", label: "Focus Sectors", format: "list" },
      { key: "pain_points_addressed", label: "Pain Points Addressed", format: "list" },
      { key: "product_pipeline", label: "Product Pipeline", format: "list" },
      { key: "innovation_roadmap", label: "Innovation Roadmap", format: "list" }
    ]
  },
  {
    keywords: ["esg", "csr", "carbon", "sustainability", "values", "ethics", "social", "green"],
    title: "ESG & Corporate Values",
    emoji: "🌱",
    fields: [
      { key: "core_values", label: "Core Values", format: "list" },
      { key: "esg_ratings", label: "ESG Ratings" },
      { key: "carbon_footprint", label: "Carbon Footprint" },
      { key: "ethical_sourcing", label: "Ethical Sourcing" },
      { key: "sustainability_csr", label: "Sustainability / CSR" },
      { key: "ethical_standards", label: "Ethical Standards" }
    ]
  }
];

let cachedCompanies: Record<string, string>[] | null = null;

async function loadCompanies(): Promise<Record<string, string>[]> {
  if (cachedCompanies) return cachedCompanies;

  try {
    // Dynamic imports to prevent any client-side bundler errors with server-only fs/path modules
    const fs = await import("fs");
    const path = await import("path");
    
    let csvText = "";
    // Try primary path
    const csvPath = path.join(process.cwd(), "src", "data", "companies_master(Master Data).csv");
    if (fs.existsSync(csvPath)) {
      csvText = fs.readFileSync(csvPath, "utf-8");
    } else {
      // Fallback path
      const altPath = path.join(process.cwd(), "data", "companies_master(Master Data).csv");
      if (fs.existsSync(altPath)) {
        csvText = fs.readFileSync(altPath, "utf-8");
      } else {
        throw new Error(`CSV file not found at ${csvPath} or ${altPath}`);
      }
    }
    
    // Split into lines
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
    if (lines.length === 0) return [];
    
    // Parse helper for single line handling quotes
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let currentVal = "";
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            currentVal += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(currentVal.trim());
          currentVal = "";
        } else {
          currentVal += char;
        }
      }
      result.push(currentVal.trim());
      return result;
    };
    
    const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim());
    const results: Record<string, string>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        let val = values[index] !== undefined ? values[index] : "";
        val = val.replace(/^"|"$/g, '').trim();
        row[header] = val;
      });
      results.push(row);
    }
    
    cachedCompanies = results;
    return results;
  } catch (error) {
    console.error("Failed to read or parse companies CSV:", error);
    return [];
  }
}

async function findCompany(companyName: string): Promise<Record<string, string> | null> {
  const companies = await loadCompanies();
  const searchName = companyName.toLowerCase().trim();
  
  // Try exact match on short_name or name
  let found = companies.find(
    (c) => c.short_name?.toLowerCase() === searchName || c.name?.toLowerCase() === searchName
  );
  
  if (!found) {
    // Try includes match
    found = companies.find(
      (c) =>
        (c.short_name && c.short_name.toLowerCase().includes(searchName)) ||
        (c.name && c.name.toLowerCase().includes(searchName)) ||
        searchName.includes(c.short_name?.toLowerCase() || "") ||
        searchName.includes(c.name?.toLowerCase() || "")
    );
  }
  return found || null;
}

function buildDefaultSummary(company: Record<string, string>): string {
  const getVal = (key: string, label: string) => {
    const val = company[key];
    if (!val || val.toUpperCase() === "NA" || val.toUpperCase() === "NOT APPLICABLE" || val.toLowerCase() === "n/a") {
      return "Not specified";
    }
    return val;
  };
  
  return (
    `### 📋 **${company.name || "Company"}** (${company.category || "Enterprise"}) — Overview\n\n` +
    `**Overview**: ${getVal("overview_text", "Company Overview")}\n\n` +
    `#### ⚙️ Quick Profile\n` +
    `* **Headquarters**: ${getVal("headquarters_address", "HQ Address")}\n` +
    `* **Founded**: ${getVal("incorporation_year", "Founded")}\n` +
    `* **Employee Size**: ${getVal("employee_size", "Employee Size")}\n` +
    `* **Remote Policy**: ${getVal("remote_policy_details", "Remote Policy")}\n` +
    `* **Glassdoor Rating**: ⭐ **${getVal("glassdoor_rating", "Glassdoor Rating")}**\n` +
    `* **Annual Revenue**: **${getVal("annual_revenue", "Annual Revenue")}**\n` +
    `* **Valuation**: **${getVal("valuation", "Valuation")}**\n\n` +
    `You can ask me specific questions about **Culture**, **Tech Stack**, **Salary & Benefits**, **Competitors**, **Leadership**, **Layoffs**, or **Career Growth**.`
  );
}

function generateLocalReply(company: Record<string, string>, query: string): string {
  const q = query.toLowerCase().trim();
  
  const formatList = (val: string) => {
    if (!val || val.toUpperCase() === "NA" || val.toUpperCase() === "NOT APPLICABLE") return "Not specified";
    const splitChar = val.includes(";") ? ";" : (val.includes(",") && !val.includes("Inc.") ? "," : null);
    if (!splitChar) return val;
    return val.split(splitChar).map(item => `- ${item.trim()}`).join("\n");
  };

  // Find matching groups
  const matches: KeywordMapping[] = [];
  for (const m of MAPPINGS) {
    if (m.keywords.some(keyword => q.includes(keyword))) {
      matches.push(m);
    }
  }

  if (matches.length === 0) {
    return buildDefaultSummary(company);
  }

  // Generate markdown response for matching sections
  let response = "";
  for (const match of matches) {
    let sectionContent = "";
    for (const field of match.fields) {
      const rawVal = company[field.key];
      if (!rawVal || rawVal.toUpperCase() === "NA" || rawVal.toUpperCase() === "NOT APPLICABLE" || rawVal.toLowerCase() === "n/a") {
        continue; // Skip fields with no data to keep response dense and relevant
      }
      
      if (field.format === "list") {
        sectionContent += `* **${field.label}**:\n${formatList(rawVal)}\n`;
      } else if (field.format === "url") {
        sectionContent += `* **${field.label}**: [Link / Profile](${rawVal})\n`;
      } else {
        sectionContent += `* **${field.label}**: ${rawVal}\n`;
      }
    }
    
    if (sectionContent) {
      response += `### ${match.emoji} ${match.title} for **${company.short_name || company.name}**\n\n` + sectionContent + "\n";
    }
  }

  // If all fields in all matching sections were empty, fall back to default summary
  if (response.trim() === "") {
    response = buildDefaultSummary(company);
  }

  // Always append suggested questions for local NLP fallback
  const fallbackSuggestions = [
    "What is the work culture like?",
    "What's the tech stack used?",
    "What are the salary & ESOP details?",
    "How is the remote work policy?",
    "What are the key competitors?",
    "Tell me about job stability and layoffs."
  ];
  // Pick 3 random questions
  const shuffled = fallbackSuggestions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  
  response += `\n\n---\nSuggested questions:\n1. ${selected[0]}\n2. ${selected[1]}\n3. ${selected[2]}`;

  return response;
}

// ── Server function ──────────────────────────────────────────────────────────

export const chatWithGemini = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (typeof data !== "object" || !data) throw new Error("Invalid input");
    const d = data as Record<string, unknown>;
    if (typeof d.message !== "string" || !d.message.trim()) throw new Error("message required");
    return {
      message: (d.message as string).trim(),
      companyName: typeof d.companyName === "string" ? d.companyName : "the selected company",
    };
  })
  .handler(async ({ data }): Promise<{ reply: string }> => {
    const apiKey = process.env.GEMINI_API_KEY;
    const { message, companyName } = data;

    const GEMINI_MODEL = "gemini-2.0-flash";
    let raw: Response | undefined;
    let geminiError: string | null = null;
    
    // Check if the API key is set and appears valid (not a default placeholder string)
    const isRealKey = apiKey && apiKey !== "placeholder" && !apiKey.startsWith("your-") && apiKey.trim().length > 10;
    
    if (isRealKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
      const payload: GeminiRequest = {
        systemInstruction: { parts: [{ text: buildSystemPrompt(companyName) }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
      };
      
      try {
        raw = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (raw.ok) {
          const result = (await raw.json()) as GeminiApiResponse;
          if (result.error) {
            geminiError = `Gemini API error (${result.error.code}): ${result.error.message}`;
          } else {
            const reply = result.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
            if (reply) {
              return { reply };
            }
          }
        } else {
          const statusText = await raw.text();
          geminiError = `Gemini API returned status ${raw.status}: ${statusText}`;
        }
      } catch (err) {
        console.error("[chatWithGemini] Network error calling Gemini:", err);
        geminiError = err instanceof Error ? err.message : String(err);
      }
    } else {
      geminiError = isRealKey ? "GEMINI_API_KEY validation failed." : "GEMINI_API_KEY is not configured or is a placeholder.";
    }

    // ── FALLBACK PATH: Local NLP search from companies dataset ────────────────
    console.warn(`[chatWithGemini] Falling back to local NLP search due to: ${geminiError}`);
    
    const company = await findCompany(companyName);
    if (!company) {
      return {
        reply: `🤖 I couldn't find detailed records for **${companyName}**. Please try again or check your query.`,
      };
    }
    
    const reply = generateLocalReply(company, message);
    return { reply };
  });
