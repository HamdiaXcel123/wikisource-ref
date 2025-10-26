📘 WikiSourceVerifier – Project README & Task Assignment
A community-powered platform to verify and catalogue credible references for Wikipedia and Wikimedia projects, organized by country and reliability.

🎯 Project Goal
To crowdsource, verify, and maintain a country-based database of credible references that strengthen citation practices across Wikipedia, especially in underrepresented languages and regions.

🛠️ Tech Stack Overview
Component	Technology Used
Frontend	React + TailwindCSS
Backend	Node.js (Express)
Database	SQLite
Auth	Wikimedia OAuth
Hosting	Wikimedia Toolforge / VPS
API	REST API
🧩 Task Group Assignments
Each group is assigned a distinct, equally weighted module of the project. All teams will collaborate through GitHub, weekly standups, and shared documentation.

🧱 Group 1: Submission & Reference Intake
Goal: Build the contributor-facing interface and backend logic for submitting references.

Tasks:

Design and implement the Reference Submission Form (React + Tailwind)

Backend route: POST /submit-reference

Fields:

URL or file upload (PDF, DOI, book info)

Country of origin

Source category: Primary, Secondary, Not Reliable

Optional Wikipedia article link

Store submissions in SQLite with timestamp and contributor ID

Validate inputs and sanitize uploads

🛡️ Group 2: Verification Dashboard
Goal: Build the admin interface and backend logic for country-based verification.

Tasks:

Create Verifier Dashboard (React)

Backend routes:

GET /pending-references

POST /verify-reference

POST /flag-reference

SQLite schema for:

Verification status

Notes (e.g., “Academic publisher”, “Government-owned”)

Verifier ID and timestamp

Role-based access control for country admins

📚 Group 3: Public Reference Directory
Goal: Build the public-facing directory of verified sources.

Tasks:

Design searchable and filterable Reference Directory (React)

Backend route: GET /references

Filters:

Country, Category, Reliability, Media Type

Display:

Title, Publisher, URL/DOI, Country, Date Verified, Verifier Name

SQLite indexing for fast lookup

Build REST API endpoint for Wikipedia tool integration

🏅 Group 4: Gamification & Metrics
Goal: Incentivize contributions and track community engagement.

Tasks:

Design contributor Leaderboard & Badge System

Backend routes:

GET /leaderboard

POST /award-points

SQLite schema for:

Contributor points

Badge levels

Country-level stats

Display top contributors per country

Monthly engagement reports

🔗 Group 5: Integration & Future Extensions
Goal: Extend platform functionality and prepare for future Wikimedia integration.

Tasks:

Implement Wikimedia OAuth for contributor login

Link verified sources to Wikidata properties

Build Wikipedia gadget for citation pop-up

Explore ML-based source reliability scoring (future phase)

Backend routes:

GET /wikidata-link

GET /gadget-status

🧭 Implementation Timeline
Phase	Description	Duration
Phase 1	Submission form + public list	2–3 weeks
Phase 2	Admin dashboard	2 weeks
Phase 3	OAuth + API	2 weeks
Phase 4	Public beta (5–10 countries)	1 month
Phase 5	Wikipedia tool integration	Later phase
🌟 Benefits to Wikimedia Movement
Reduces misinformation and unreliable citations

Empowers local communities to vet sources

Strengthens smaller Wikipedias (Dagbani, Twi, Fante, etc.)

Builds an open, country-based dataset of verified sources