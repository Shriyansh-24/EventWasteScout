# EventWaste Scout 🌱 
> Real-time Predictive Procurement & Responsible Surplus Routing for Campus Events.

EventWaste Scout is a context-aware, client-side expert system engineered to eliminate institutional food waste at the source. Built with inspiration from the visual identity and sustainability mission of **Too Good To Go**, the application uses local edge logic to optimize catering procurement budgets before an event and automate safe surplus redistribution immediately after.

Live Demo: https://eventwastescout.netlify.app/

---

## 🚀 The Core AI Architecture & Solution

Traditional event planning relies on static spreadsheets that treat consumption linearly. EventWaste Scout replaces this with a **Deterministic Edge Reasoning Layer** that runs entirely client-side, making it private, free, and functional offline inside campus environments.

*   **Dynamic Demographic Calibration Matrix:** The engine tracks local historical baselines and applies custom metabolic multipliers (e.g., scaling targets down to `0.65x` for primary school cohorts to prevent immediate over-ordering, or up to `1.35x` for teen tracking athletes with heavy sports training schedules).
*   **Sustainability Telemetry Map:** Instantly translates abstract menus into ecological impacts, showcasing exact kilograms of potential biomass waste, lifecycle water loss (L), and nutritional meal capacity.
*   **Responsible AI Safety Firewall:** The millisecond biological hazards like nuts, dairy, or gluten are flagged, the routing engine intercept triggers an immediate penalty score on open public spaces and dynamically shifts logistics priorities to certified cold-chain charity nodes like *Hifz Al Naema*.

---

## 🛠️ Tech Stack & Dependencies

*   **Framework:** React.js (via Vite)
*   **Styling:** Tailwind CSS (Custom brand palette: Forest Teal `#00615F`, Soft Cream `#F9F3F0`, Clay `#E68A73`)
*   **Database Layer:** HTML5 `localStorage` API (Zero-cost, persistent client-side data logging)
*   **CI/CD & Hosting:** Vercel Edge Networks

---

## 💻 Local Installation & Setup Guide

Ensure you have [Node.js](https://nodejs.org/) installed on your machine before starting.

### 1. Clone the Repository
```bash
git clone [https://github.com/](https://github.com/)[your-username]/eventwaste-scout.git
cd eventwaste-scout
```
### 2. Install Project Dependencies
```bash
npm install
```

### 3. Spin Up the Local Development Server
```bash
npm run dev
```
Once the compilation finishes, copy the local URL (usually http://localhost:5173) and open it in your web browser.

⚙️ Testing the Dataset & Cache Troubleshooting
The application includes a robust system database of 10 distinct school functions (Sports Days, Science Fairs, Parents Evenings) to build baseline trends.

🔮 Future Roadmap Expansion
Hybrid Cloud LLM Layer (Optional): Integrating an API routing layer (Claude/Gemini) to act as a frontend translator, parsing unstructured catering emails or menu screenshots into structured data arrays.

Dynamic Geolocation API: Connecting live location services to automatically track coordinates anywhere in the region, querying active food banks within a strict radius and matching them based on real-time transit windows
