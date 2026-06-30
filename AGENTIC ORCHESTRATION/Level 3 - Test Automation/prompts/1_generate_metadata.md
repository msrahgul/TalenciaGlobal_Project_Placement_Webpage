# Prompt 1 — Generate Parameter Metadata (SELF-CONTAINED)

> Copy this ENTIRE file into ChatGPT / Claude / Gemini. Everything needed (the
> 163-parameter schema and the exact output columns) is already inside — you do
> not need to attach or paste anything else.

---

# ROLE
You are a Test Data Architect. Convert the research schema below into a rich
**validation + governance metadata sheet** that a metadata-driven test framework
can consume.

# OUTPUT — produce ONE row per parameter with EXACTLY these columns
`id, column_name, label, category, description, content_type, granularity, ac,
minimum_element, maximum_element, min_length, max_length, data_type,
validation_type, format_constraints, regex_pattern, nullability, nullable,
delimiter, criticality, confidence_level, data_volatility, update_frequency,
data_owner, business_rules, data_rules, data_source, validation_mode,
is_derived_from, allowed_values`

Column rules:
- **column_name**: snake_case database name (e.g. `logo_url`).
- **granularity**: `One per Entity` (atomic) or `Many per Entity` (composite).
- **ac**: `Atomic` or `Composite` (from the A/C column below).
- **minimum_element / maximum_element**: composite ELEMENT-COUNT bounds (null for atomic).
- **min_length / max_length**: character-length bounds (derive from data_type, e.g. VARCHAR(255) → 255; TEXT → 8000; NUMERIC → 6).
- **data_type**: a SQL-ish type — `VARCHAR(n)`, `TEXT`, or `NUMERIC(3,1)`.
- **validation_type**: one of `text, url, email, phone, number, rating`.
- **regex_pattern**: a regex ONLY where it adds value (image-URL for logos, a legal-name charset for `name`, a handle pattern for `twitter_handle`); else null.
- **nullability** = `Not Null` for the seven identity fields
  (`name, short_name, category, overview_text, headquarters_address, website_url, ceo_name`),
  else `Nullable`. **nullable** is the matching boolean.
- **criticality**: `Critical` (Not Null fields), `High` (Financials/Funding/Leadership/Contact/Risk/Governance), else `Medium`.
- **content_type, format_constraints, data_owner, business_rules, data_rules,
  data_source, confidence_level, data_volatility, update_frequency,
  validation_mode, is_derived_from**: fill sensibly per the field's meaning
  (e.g. `short_name` is_derived_from `name`; financials are `Dynamic` / `Quarterly`).
- **allowed_values**: a list, empty unless the field is a fixed enum.

Return BOTH a Markdown table and a JSON array (the framework reads the JSON).

# THE 163-PARAMETER SCHEMA
(ID  Category  Description  Parameter  Content Type  Min  Max  A/C)

1  Company Basics  Full legal/official name  Company Name  Text  As needed    Atomic
2  Company Basics  Short/abbreviated name  Short Name  Text  As needed    Atomic
3  Company Basics  Logo URL or image link  Logo  URL  1  5  Composite
4  Company Basics  Business classification  Category  Text  As needed    Atomic
5  Company Basics  Year incorporated  Year of Incorporation  Text  As needed    Atomic
6  Company Narrative  High-level summary  Overview of the Company  Text  1  1  Atomic
7  Company Basics  Ownership structure  Nature of Company  Text  As needed    Atomic
8  Company Basics  Headquarters address  Company Headquarters  Text  As needed    Atomic
9  Geographic Presence  Countries operating in  Countries Operating In  Text  1  10  Composite
10  Geographic Presence  Number of offices beyond HQ  Number of Offices  Text  As needed    Atomic
11  Geographic Presence  Office locations  Office Locations  Text  1  10  Composite
12  People & Talent  Employee size  Employee Size  Text  As needed    Atomic
13  People & Talent  Open roles by department  Hiring Velocity  Text  1  5  Composite
14  People & Talent  Annual attrition %  Employee Turnover  Text  1  1  Atomic
15  People & Talent  Average tenure  Average Retention Tenure  Text  1  1  Atomic
16  Business Model  Customer pain points  Pain Points Being Addressed  Text  2  8  Composite
17  Business Model  Target sectors  Focus Sectors / Industries  Text  1  10  Composite
18  Business Model  Products/services  Services / Offerings / Products  Text  2  10  Composite
19  Business Model  Top customers by segment  Top Customers  Text  3  20  Composite
20  Business Model  Core value proposition  Core Value Proposition  Text  2  5  Composite
21  Strategy & Culture  Long-term goal  Vision  Text  As needed    Atomic
22  Strategy & Culture  Short-term purpose  Mission  Text  As needed    Atomic
23  Strategy & Culture  Core principles  Values  Text  3  7  Composite
24  Strategy & Culture  Unique features  Unique Differentiators  Text  2  6  Composite
25  Strategy & Culture  Sustainable edges  Competitive Advantages  Text  2  6  Composite
26  Strategy & Culture  Weaknesses/gaps  Weaknesses / Gaps  Text  1  5  Composite
27  Strategy & Culture  Key challenges  Key Challenges and Unmet Needs  Text  2  6  Composite
28  Competitive Landscape  Competitors  Key Competitors  Text  5  20  Composite
29  Competitive Landscape  Tech/alliance partners  Technology Partners  Text  2  8  Composite
30  Company Narrative  History/timeline milestones  History Timeline  Text  1  8  Composite
31  Company Narrative  Recent news with dates  Recent News  Text  2  8  Composite
32  Digital Presence  Official website URL  Website URL  URL  1  1  Atomic
33  Digital Presence  Site quality assessment  Quality of Website  Text  As needed    Atomic
34  Digital Presence  Website quality score /10  Website Rating  Text  As needed    Atomic
35  Digital Presence  Global/US traffic rank  Website Traffic Rank  Text  As needed    Composite
36  Digital Presence  Total social followers  Social Media Followers  Text  As needed    Atomic
37  Digital Presence  Glassdoor rating  Glassdoor Rating  Text  As needed    Atomic
38  Digital Presence  Indeed rating  Indeed Rating  Text  As needed    Atomic
39  Digital Presence  Google rating  Google Reviews Rating  Text  As needed    Atomic
40  Digital Presence  LinkedIn URL  LinkedIn Profile URL  URL  1  1  Atomic
41  Digital Presence  Twitter/X handle  Twitter (X) Handle  Text  As needed    Atomic
42  Digital Presence  Facebook URL  Facebook Page URL  URL  1  1  Atomic
43  Digital Presence  Instagram URL  Instagram Page URL  URL  1  1  Atomic
44  Leadership  CEO name  CEO Name  Text  As needed    Atomic
45  Leadership  CEO LinkedIn URL  CEO LinkedIn URL  URL  1  1  Atomic
46  Leadership  Key executives  Key Business Leaders  Text  2  5  Composite
47  Leadership  Warm intro pathways  Warm Introduction Pathways  Text  1  5  Composite
48  Leadership  Decision maker access  Decision Maker Accessibility  Text  As needed    Atomic
49  Contact Info  Inquiry email  Company Contact Email  Text  As needed    Atomic
50  Contact Info  Company phone  Company Phone Number  Text  As needed    Atomic
51  Contact Info  Primary contact name  Primary Contact Name  Text  As needed    Atomic
52  Contact Info  Primary contact title  Primary Contact Title  Text  As needed    Atomic
53  Contact Info  Primary contact email  Primary Contact Email  Text  As needed    Atomic
54  Contact Info  Primary contact phone  Primary Contact Phone  Text  As needed    Atomic
55  Reputation  Awards/recognitions  Awards & Recognitions  Text  1  8  Composite
56  Reputation  Brand sentiment  Brand Sentiment Score  Text  As needed    Atomic
57  Reputation  Events participated  Event Participation  Text  2  6  Composite
58  Risk & Compliance  Certifications  Regulatory & Compliance Status  Text  1  6  Composite
59  Risk & Compliance  Legal issues  Legal Issues / Controversies  Text  As needed    Atomic
60  Financials  Annual revenue  Annual Revenues  Text  As needed    Atomic
61  Financials  Annual profit/loss  Annual Profits  Text  As needed    Atomic
62  Financials  Revenue mix  Revenue Mix  Text  As needed    Composite
63  Financials  Valuation  Company Valuation  Text  As needed    Atomic
64  Financials  YoY growth %  Year-over-Year Growth Rate  Text  As needed    Atomic
65  Financials  Profitability status  Profitability Status  Text  As needed    Atomic
66  Financials  Market share %  Market Share  Text  As needed    Atomic
67  Funding  Investors  Key Investors / Backers  Text  2  6  Composite
68  Funding  Funding rounds  Recent Funding Rounds  Text  1  5  Composite
69  Funding  Total capital raised  Total Capital Raised  Text  As needed    Atomic
70  Sustainability  ESG practices  ESG Practices or Ratings  Text  1  5  Composite
71  Sales & Growth  Sales motion  Sales Motion  Text  As needed    Atomic
72  Sales & Growth  CAC  Customer Acquisition Cost  Text  As needed    Atomic
73  Sales & Growth  CLV  Customer Lifetime Value  Text  As needed    Atomic
74  Sales & Growth  CAC:LTV ratio  CAC:LTV Ratio  Text  As needed    Atomic
75  Sales & Growth  Churn rate  Churn Rate  Text  As needed    Atomic
76  Sales & Growth  NPS  Net Promoter Score  Text  As needed    Atomic
77  Sales & Growth  Concentration risk  Customer Concentration Risk  Text  As needed    Atomic
78  Sales & Growth  Burn rate  Burn Rate  Text  1  1  Atomic
79  Sales & Growth  Runway months  Runway  Text  1  1  Atomic
80  Sales & Growth  Burn multiplier  Burn Multiplier  Text  As needed    Atomic
81  Innovation  IP owned  Intellectual Property  Text  1  6  Composite
82  Innovation  R&D investment  R&D Investment  Text  As needed    Atomic
83  Innovation  AI/ML adoption  AI/ML Adoption Level  Text  As needed    Atomic
84  Operations  Tech stack  Tech Stack/Tools Used  Text  3  10  Composite
85  Operations  Cybersecurity posture  Cybersecurity Posture  Text  1  4  Composite
86  Operations  Supply chain deps  Supply Chain Dependencies  Text  1  5  Composite
87  Operations  Geopolitical risks  Geopolitical Risks  Text  1  4  Composite
88  Operations  Macro risks  Macro Risks  Text  1  4  Composite
89  People & Talent  Diversity metrics  Diversity Metrics  Text  As needed    Composite
90  People & Talent  Remote policy  Remote Work Policy  Text  As needed    Atomic
91  People & Talent  Training spend  Training/Development Spend  Text  As needed    Atomic
92  Market  Partnerships  Partnership Ecosystem  Text  2  8  Composite
93  Market  Exit history  Exit Strategy/History  Text  1  3  Composite
94  Sustainability  Carbon footprint  Carbon Footprint  Text  As needed    Atomic
95  Sustainability  Ethical sourcing  Ethical Sourcing Practices  Text  1  4  Composite
96  Benchmarking  Peer benchmark  Benchmark vs. Peers  Text  3  6  Composite
97  Forecasting  Future projections  Future Projections  Text  As needed    Atomic
98  Forecasting  Strategic priorities  Strategic Priorities  Text  3  5  Composite
99  Network  Industry associations  Industry Associations  Text  2  6  Composite
100  Proof Points  Case studies  Case Studies  Text  2  5  Composite
101  Go-to-Market  GTM strategy  Go-to-Market Strategy  Text  3  6  Composite
102  Innovation  Innovation roadmap  Innovation Roadmap  Text  2  6  Composite
103  Innovation  Product pipeline  Product Pipeline  Text  2  6  Composite
104  Governance  Board/advisors  Board of Directors  Text  3  8  Composite
105  Digital Presence  Marketing videos  Marketing videos  URL  1  5  Composite
106  Proof Points  Customer testimonials  Customer testimonial  Text  2  5  Composite
107  Benchmarking  Tech adoption rating  Industry Benchmark Tech Adoption  Text  2  3  Composite
108  Market  TAM  Total Addressable Market  Text  1  1  Atomic
109  Market  SAM  Serviceable Addressable Market  Text  1  1  Atomic
110  Market  SOM  Serviceable Obtainable Market  Text  1  1  Atomic
111  Culture & People  Work culture  Work culture  Text  1  3  Composite
112  Culture & People  Manager quality  Manager quality  Text  As needed    Atomic
113  Culture & People  Psychological safety  Psychological safety  Text  As needed    Atomic
114  Culture & People  Feedback culture  Feedback culture  Text  1  2  Composite
115  Culture & People  Diversity & inclusion  Diversity & inclusion  Text  1  5  Composite
116  Culture & People  Ethical standards  Ethical standards  Text  1  3  Composite
117  Work-Life Balance  Typical hours  Typical working hours  Text  As needed    Atomic
118  Work-Life Balance  Overtime expectations  Overtime expectations  Text  As needed    Atomic
119  Work-Life Balance  Weekend work  Weekend work  Text  As needed    Atomic
120  Work-Life Balance  Work flexibility  Remote/hybrid/on-site flexibility  Text  1  3  Composite
121  Work-Life Balance  Leave policy  Leave policy  Text  1  4  Composite
122  Work-Life Balance  Burnout risk  Burnout risk  Text  As needed    Atomic
123  Location & Commute  Central vs peripheral  Central vs peripheral location  Text  As needed    Atomic
124  Location & Commute  Public transport  Public transport access  Text  1  4  Composite
125  Location & Commute  Cab policy  Cab availability  Text  1  3  Composite
126  Location & Commute  Airport commute  Commute time from airport  Text  As needed    Atomic
127  Location & Commute  Office zone  Office zone type  Text  As needed    Atomic
128  Safety & Well-being  Area safety  Area safety  Text  1  2  Composite
129  Safety & Well-being  Safety policies  Company safety policies  Text  1  4  Composite
130  Safety & Well-being  Infra safety  Office infrastructure safety  Text  1  3  Composite
131  Safety & Well-being  Emergency prep  Emergency response preparedness  Text  1  4  Composite
132  Safety & Well-being  Health support  Health support  Text  1  5  Composite
133  Learning & Growth  Onboarding quality  Onboarding and training quality  Text  As needed    Atomic
134  Learning & Growth  Learning culture  Learning culture  Text  1  4  Composite
135  Learning & Growth  Exposure quality  Exposure quality  Text  As needed    Atomic
136  Learning & Growth  Mentorship  Mentorship availability  Text  1  3  Composite
137  Learning & Growth  Internal mobility  Internal mobility  Text  As needed    Atomic
138  Learning & Growth  Promotion clarity  Promotion clarity  Text  1  3  Composite
139  Learning & Growth  Tools access  Tools and technology access  Text  1  5  Composite
140  Role & Work Quality  Role clarity  Role clarity  Text  As needed    Atomic
141  Role & Work Quality  Early ownership  Early ownership  Text  As needed    Atomic
142  Role & Work Quality  Work impact  Work impact  Text  1  3  Composite
143  Role & Work Quality  Execution vs thinking  Execution vs thinking balance  Text  As needed    Atomic
144  Role & Work Quality  Automation level  Automation level  Text  As needed    Atomic
145  Role & Work Quality  Cross-functional  Cross-functional exposure  Text  1  4  Composite
146  Company Stability  Maturity  Company maturity  Text  As needed    Atomic
147  Company Stability  Brand value  Brand value  Text  As needed    Atomic
148  Company Stability  Client quality  Client quality  Text  1  5  Composite
149  Company Stability  Layoff history  Layoff history  Text  As needed    Atomic
150  Compensation  Fixed vs variable  Fixed vs variable pay  Text  As needed    Atomic
151  Compensation  Bonus predictability  Bonus predictability  Text  As needed    Atomic
152  Compensation  ESOPs  ESOPs and long-term incentives  Text  1  3  Composite
153  Compensation  Family insurance  Family health insurance  Text  1  4  Composite
154  Compensation  Relocation support  Relocation support  Text  1  3  Composite
155  Compensation  Lifestyle benefits  Lifestyle and wellness benefits  Text  1  6  Composite
156  Long-Term Career  Exit opportunities  Exit opportunities  Text  1  5  Composite
157  Long-Term Career  Skill relevance  Skill relevance  Text  As needed    Atomic
158  Long-Term Career  External recognition  External recognition  Text  As needed    Atomic
159  Long-Term Career  Network strength  Network strength  Text  1  3  Composite
160  Long-Term Career  Global exposure  Global exposure  Text  1  3  Composite
161  Values Alignment  Mission clarity  Mission clarity  Text  As needed    Atomic
162  Values Alignment  Sustainability/CSR  Sustainability and CSR  Text  1  3  Composite
163  Values Alignment  Crisis behavior  Crisis behavior  Text  As needed    Atomic

# TASK
Generate the metadata for all 163 parameters now. Do not skip any ID.
