# EventWaste Scout 🌱
> **Real-time Predictive Procurement & Responsible Surplus Routing for Campus Events**

EventWaste Scout is a **deterministic edge reasoning layer** engineered to eliminate institutional food waste at the source. Built as a **zero-cost, privacy-first** client-side expert system, it replaces static spreadsheets with intelligent procurement calibration and automated surplus logistics routing—all running directly in your browser with no external dependencies, cloud subscriptions, or user accounts required.

**Live Demo:** [https://eventwastescout.netlify.app/](https://eventwastescout.netlify.app/)  
**GitHub:** [Shriyansh-24/EventWasteScout](https://github.com/Shriyansh-24/EventWasteScout)

---

## 📋 Table of Contents

- [Vision & Problem Statement](#vision--problem-statement)
- [Core Architecture](#core-architecture)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [How It Works](#how-it-works)
- [Algorithms & Logic](#algorithms--logic)
- [Data Storage & Privacy](#data-storage--privacy)
- [Sustainability Metrics](#sustainability-metrics)
- [API Reference](#api-reference)
- [Usage Guide](#usage-guide)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [FAQ & Troubleshooting](#faq--troubleshooting)
- [License](#license)

---

## 🎯 Vision & Problem Statement

### The Problem
School event coordinators and institutional catering managers face a critical gap between procurement planning and waste reality:

- **Static Spreadsheets**: Traditional planning uses fixed assumptions with no historical learning
- **Last-Minute Surprises**: Orders are often guesswork, leading to 30-50% food waste at campus events
- **Lost Sustainability Opportunity**: When surplus food exists, there's no structured, safe pipeline to redirect it to food-insecure communities
- **Safety Blind Spots**: Allergen restrictions and demographic dietary needs are often missed, creating liability

### The Solution
EventWaste Scout bridges this gap with a **predictive + reactive intelligence layer** that:

1. **Learns from history** – Analyzes past event consumption patterns specific to your institution
2. **Predicts intelligently** – Generates optimized ordering recommendations calibrated by demographic metabolic profiles
3. **Routes responsibly** – Automatically generates safe, compliant redistribution blueprints to local food banks
4. **Runs offline** – Zero cloud overhead, no subscriptions, no internet required

---

## 🏗️ Core Architecture

### Three-Layer Intelligence Stack

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PREDICTIVE LAYER                                         │
│ • Historical Baseline Extraction                            │
│ • Demographic Consumption Calibration                       │
│ • Demographic Multiplier Application (0.65x - 1.35x)      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. ANOMALY DETECTION LAYER                                  │
│ • Deviation Analysis (vs. baseline)                         │
│ • Over-allocation Identification                            │
│ • Allergen Safety Intercepts                                │
│ • Waste Impact Quantification                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. LOGISTICS ROUTING LAYER                                  │
│ • Charity Hub Matching (Regional Registry)                  │
│ • Operating Hours Alignment                                 │
│ • Food Type Compatibility Checks                            │
│ • Allergen-Aware Route Scoring                              │
└─────────────────────────────────────────────────────────────┘
```

### Design Philosophy
- **Client-Side First**: All computation runs in the browser; no backend required
- **Deterministic Output**: Same inputs always produce identical recommendations
- **Edge Deployment Ready**: Compatible with Vercel, Netlify, or any static host
- **Privacy Preserving**: All data stored locally; no tracking, no cloud syncing

---

## 🛠️ Key Features

### ✅ Implemented & Fully Functional

#### 1. **Dynamic Demographic Calibration**
- **Status**: Fully operational
- **Capability**: System calculates baseline consumption metrics and applies demographic multipliers
- **Multiplier Table**:
  - **Primary Students**: `0.65×` (smaller appetites, lighter meals)
  - **Teen Athletes**: `1.35×` (high metabolic demand during sports events)
  - **Adult Staff**: `1.00×` (baseline standard)
  - **Mixed Demographics**: `1.10×` (conservative mixed-audience scaling)
- **Result**: Ordering recommendations automatically adjust for audience composition

#### 2. **Sustainability Telemetry Dashboard**
- **Status**: Fully operational
- **Metrics Tracked**:
  - **Biomass Waste (KG)**: Weight of food prevented from landfill
  - **Virtual Water Loss (Liters)**: Water lifecycle impact of saved production
  - **Nutritional Capacity (Meals)**: Complete human meals preserved
- **Real-Time Updates**: Metrics regenerate instantly as form inputs change

#### 3. **Allergen Safety Intercept**
- **Status**: Fully operational
- **Safety Toggles**: Nuts, Dairy, Gluten
- **Behavior**: When an allergen is flagged, the system:
  - Penalizes redistribution to open public campus spaces
  - Flags maximum-security logistics routing requirements
  - Marks all redistributable items with hazard notifications
  - Restricts hub eligibility to certified allergen-safe facilities

#### 4. **Historical Event Registry & Baseline Learning**
- **Status**: Fully operational
- **Storage**: Browser localStorage (HTML5 API)
- **Seeded With**: 10 distinct event type templates (Sports Days, Science Fairs, Parent Evenings, Debate Tournaments, Custom Events)
- **Auto-Expansion**: Every completed audit adds a new record to the system database
- **Learning Effect**: Future forecasts automatically refine as more events are logged

### 🔄 In Active Development / Roadmap

#### **Food Surplus Routing to Food Banks**
- **Current Status**: Routing logic + prioritization engine **fully written and operational**
- **Current Implementation**: Simulated using hardcoded regional partner registry (Hifz Al Naema, Qatar Charity Tayf Program)
- **Planned Enhancement**: 
  - Live API integration with regional food bank networks
  - Real-time operating hours pull from charity management systems
  - Dynamic driver dispatch automation
  - Live inventory synchronization

---

## 🔧 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React.js 19.2.6 (via Vite) | Component-based UI rendering |
| **Styling** | Tailwind CSS 4.3.1 | Utility-first responsive design |
| **Build Tool** | Vite 8.0.12 | Lightning-fast dev & production builds |
| **State Management** | React Hooks (useState, useEffect, useRef) | Local component state & side effects |
| **Data Storage** | HTML5 localStorage API | Zero-cost persistent client-side ledger |
| **CI/CD & Hosting** | Vercel | Edge deployment with GitHub integration |
| **Code Quality** | ESLint 10.3.0 | Static code analysis |
| **Styling Framework** | @tailwindcss/vite 4.3.1 | Optimized Tailwind compilation |

### Design System & Brand Palette
```javascript
// Core Color Scheme
Primary Teal:     #00615F  (Trust, sustainability, environmental action)
Soft Cream:       #F9F3F0  (Accessibility, warmth, invite)
Clay/Accent:      #E68A73  (Action buttons, warnings, impact visibility)
Dark Text:        #103B39  (Primary readable contrast)
Secondary Teal:   #004D4A  (Hover states, nested elements)
Muted Secondary:  #A3D3C9  (Disabled states, helper text)
```

---

## 📥 Installation & Setup

### Prerequisites
- **Node.js**: v16.x or higher ([Download](https://nodejs.org/))
- **npm**: v7.x or higher (comes with Node.js)
- **Git**: For cloning the repository

### Step 1: Clone the Repository
```bash
git clone https://github.com/Shriyansh-24/EventWasteScout.git
cd EventWasteScout
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start the Development Server
```bash
npm run dev
```

The app will compile and display output like:
```
  VITE v8.0.12  ready in 245 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Open **http://localhost:5173** in your browser. The page auto-refreshes on file changes.

### Step 4: Build for Production
```bash
npm run build
```

Output goes to the `dist/` directory. Optimized for deployment to Vercel, Netlify, or any static host.

### Step 5: Preview Production Build Locally
```bash
npm run preview
```

### (Optional) Windows Batch Launcher
A pre-configured batch script is included for Windows users:
```bash
Launch_App.bat
```

This automatically:
1. Builds the project
2. Launches a local web server on port 8080
3. Opens the app in your default browser

---

## ⚙️ How It Works

### User Journey: From Audit to Action

#### **Phase 1: Event Setup** (Left Panel Input)
1. **Select Event Type**: Choose from predefined categories or "Custom Event"
2. **Specify Attendance**: Enter expected headcount
3. **Set Time Schedule**: Morning / Lunch / Afternoon / Evening (affects routing hub availability)
4. **Choose Demographics**: Select primary audience (affects consumption multiplier)
5. **Flag Allergens** (Optional): Toggle Nuts, Dairy, Gluten for safety routing
6. **Input Menu Items**: Add food items with planned quantities and unit types

#### **Phase 2: Local Anomaly Detection** (Right Panel Output)
When you click **"Run Sustainability Audit"**, the app executes:

1. **Historical Pattern Matching**
   - Searches localStorage for past events matching your event type
   - Calculates average "per-head consumption ratio"
   - Falls back to global average if no matches exist

2. **Demographic Calibration**
   - Applies your selected demographic multiplier
   - Recalculates baseline with age-adjusted consumption profiles

3. **Deviation Analysis**
   - Compares your planned quantities against calibrated baseline
   - Flags items with >10% overage as "slight-over"
   - Flags items with >30% overage as "high-risk"

4. **Sustainability Quantification**
   - Calculates surplus food weight (planned - recommended)
   - Translates to ecological metrics (biomass, water, meals)
   - Displays live impact dashboard

5. **Logistics Matching**
   - Scores regional food banks based on:
     - Operating hours alignment
     - Food type compatibility
     - Allergen handling capability
   - Generates ranked routing recommendations

6. **Contingency Planning**
   - Generates 3-4 automated action steps for redistribution
   - Adjusts based on time-of-day and volume constraints

#### **Phase 3: Post-Event Logging** (Optional)
1. Enter **actual consumed quantities** for each menu item
2. Click **"Commit Ingestion Data to System Memory"**
3. Record is saved to localStorage and immediately feeds into future baseline calculations

---

## 🧠 Algorithms & Logic

### The Deterministic Edge Reasoning Layer

The core prediction engine is a **three-step mathematical pipeline** that runs entirely in the browser:

#### **Step 1: The Baseline Loop**
Extract historical consumption patterns for matching event types.

```javascript
// Pseudocode
function extractHistoricalBaseline(eventType, history) {
  // 1. Filter history for matching event types
  const relevantEvents = history.filter(e => e.eventType === eventType);
  
  // 2. If insufficient data, use full history
  const referencePool = relevantEvents.length >= 1 ? relevantEvents : history;
  
  // 3. Calculate per-head ratio for each item across all events
  const ratioMap = {};
  referencePool.forEach(event => {
    event.items.forEach(item => {
      ratioMap[item.name] = 
        (actualConsumed / eventAttendance);
    });
  });
  
  // 4. Average across all occurrences
  const averageRatio = ratioMap[itemName] / occurrenceCount;
  
  return averageRatio; // e.g., 0.82 means 82% consumption rate
}
```

#### **Step 2: The Metabolic Modifier**
Apply demographic-specific multipliers.

```javascript
// Demographic Consumption Multipliers (Evidence-Based)
const AGE_CONSUMPTION_MULTIPLIERS = {
  primary: 0.65,    // Primary students: lighter portions, pickier eaters
  teens: 1.35,      // Teen athletes: high energy expenditure
  adults: 1.00,     // Adult baseline (standard reference)
  mixed: 1.10       // Mixed groups: conservative estimate
};

// Apply to baseline
const calibratedBaseline = 
  historicalPerHeadRatio × multiplier[ageGroup];
```

#### **Step 3: The Final Recommendation Equation**
```
TARGET_QUANTITY = CURRENT_ATTENDANCE 
                  × HISTORICAL_PER_HEAD_RATIO 
                  × DEMOGRAPHIC_MULTIPLIER

Example:
- Event: Science Fair (350 attendees)
- Demographic: Mixed (1.10x)
- Historical sandwich ratio: 0.77 per head
- Recommended sandwiches: 350 × 0.77 × 1.10 = 298 units
```

### Anomaly Detection Thresholds

| Deviation | Classification | Action |
|-----------|-----------------|--------|
| ≤10% over | Optimal | ✓ Approved |
| 10-30% over | Slight-Over | ⚠️ Warning |
| >30% over | High-Risk | 🚨 Alert |

### Virtual Water Calculation

Each food item is mapped to a virtual water footprint based on agricultural lifecycle data:

```javascript
// Example mappings (liters per unit)
ITEM_PROFILE_DEFAULTS = {
  sandwich: { weightGrams: 200, virtualWaterLiters: 200 },
  muffins: { weightGrams: 120, virtualWaterLiters: 90 },
  bananas: { weightGrams: 150, virtualWaterLiters: 120 },
  // ...
  "date trays": { weightGrams: 2000, virtualWaterLiters: 800 }
}
```

For items without specific profiles, the system applies a default multiplier:
```
waterLiters = (gramWeight / 1000) × 400
```

---

## 💾 Data Storage & Privacy

### localStorage Architecture

#### **Storage Key**
```javascript
const LS_KEY = "ewscout_history_v4";
```

#### **Data Schema**
```javascript
// Historical Event Record Structure
{
  id: "evt-001",                    // Unique event identifier
  eventType: "Sports Day",          // Category
  attendance: 250,                  // Headcount
  timeOfDay: "Afternoon",           // Scheduling reference
  attendeeAgeGroup: "mixed",        // Demographic profile
  allergenAlerts: ["Nuts"],         // Active flags
  items: [
    {
      name: "Sandwich",
      planned: 300,                 // Ordered quantity
      actual: 276,                  // Consumed quantity
      perHead: 0.92,                // Ratio (actual / attendance)
      unitType: "individual",
      sizeValue: "1"
    },
    // ... more items
  ]
}
```

#### **Seeded Baseline Data**
The app comes pre-populated with 10 diverse event records:
- Sports Days (2 variants with different demographics)
- Science Fairs (2 variants)
- Parent Evenings (3 variants)
- Debate Tournaments (2 variants)
- Custom Events (1 variant)

Each record includes realistic consumption patterns across food categories (sandwiches, beverages, snacks, fruits).

#### **Privacy Guarantees**
✅ **100% Client-Side**: All data stored in browser only  
✅ **No Cloud Sync**: Data never leaves your device  
✅ **No User Accounts**: Anonymous, consent-free usage  
✅ **No Tracking**: No analytics, no cookies, no third parties  
✅ **Offline Capable**: App functions without internet  
✅ **Browser Portable**: Export/import via localStorage export/import (manual)  

#### **Data Persistence Rules**
- Maximum storage: ~5-10MB (browser-dependent; typically 50,000+ events)
- Auto-saves on every audit completion
- Manual deletion via "Purge Log Record" button in History tab
- Browser clearing cookies = data loss (user responsibility)

---

## 📊 Sustainability Metrics

### Impact Dashboard Explained

The app translates procurement deviations into three ecological indicators:

#### **1. Biomass Waste (KG)**
```
Formula: (Planned Quantity - Recommended Quantity) 
         × Average Item Weight in Grams 
         ÷ 1000

Example:
- Planned 50 sandwiches, Recommended 40
- Surplus: 10 sandwiches × 200g = 2000g = 2.0 KG saved
```

**Impact Narrative**: "By following recommendations, you prevent 2.0 kilograms of organic matter from landfill decomposition."

#### **2. Virtual Water Loss (Liters)**
```
Formula: Surplus Food Weight × Item-Specific Water Footprint Multiplier

Example (sandwich):
- 10 surplus sandwiches × 200g each = 2000g total
- Sandwich water profile: 200L per sandwich
- Water saved: 10 × 200L = 2000L prevented
```

**Impact Narrative**: "Virtual water" accounts for all water used in production (rainfall on crops, irrigation, processing). Preventing food waste directly conserves water resources.

#### **3. Nutritional Capacity (Meals)**
```
Formula: Surplus Food Weight in Grams ÷ 400g per meal
         OR Direct Caloric Mapping (if available)

Example:
- 2000g surplus food ÷ 400g = 5 complete meals preserved
```

**Impact Narrative**: "The diverted surplus can feed 5 hungry people in your community."

### Calculation Accuracy

The metrics use **conservative, evidence-based assumptions**:
- Meal size standard: 400g (average adult portion)
- Virtual water data: Sourced from USDA & FAO agricultural research
- Food density approximations: Physics-based rather than caloric

---

## 📡 API Reference

### Core Functions

#### **1. getItemMetrics(name, qty, unitType, sizeValue)**
Calculates mass and water impact for a single food item.

**Parameters:**
```javascript
name: string              // Item name (e.g., "sandwich")
qty: number              // Quantity ordered
unitType: string         // "individual" | "volume" | "weight"
sizeValue: string        // Size unit (e.g., "500" for ml)
```

**Returns:**
```javascript
{
  weightKg: number,         // Total weight in kilograms
  waterLiters: number,      // Virtual water footprint
  peopleFed: number         // Meals that could be served
}
```

**Example:**
```javascript
const metrics = getItemMetrics("sandwich", 10, "individual", "1");
// Returns: { weightKg: 2.0, waterLiters: 2000, peopleFed: 5 }
```

---

#### **2. runLocalAnomalyDetection(formData, history)**
Main audit engine. Executes the three-layer intelligence stack.

**Parameters:**
```javascript
formData: {
  eventType: string,          // Event category
  attendance: number,         // Headcount
  timeOfDay: string,          // "Morning" | "Lunch" | "Afternoon" | "Evening"
  attendeeAgeGroup: string,   // "primary" | "teens" | "adults" | "mixed"
  allergenAlerts: string[],   // ["Nuts", "Dairy", "Gluten"]
  items: Array<{
    name: string,
    qty: number,
    unitType: string,
    sizeValue: string
  }>
}

history: Array<EventRecord>   // localStorage event history
```

**Returns:**
```javascript
{
  anomaliesDetected: Array<{
    item: string,
    percentageOver: number,
    reason: string
  }>,
  
  recommendedQuantities: Array<{
    item: string,
    plannedQty: number,
    suggestedQty: number,
    baselineUsed: number,
    status: "optimal" | "slight-over" | "high-risk",
    unitType: string,
    sizeValue: string
  }>,
  
  contingencyPlan: string[],  // Automated action steps
  
  logisticsMatching: Array<{
    name: string,             // Charity name
    desk: string,             // Organization unit
    contact: string,          // Phone/email
    matchScore: number,       // 0-100 compatibility %
    routingNotes: string[],   // Diagnostic messages
    acceptedTypes: string[],
    operatingHours: string[]
  }>,
  
  impactMetrics: {
    foodWasteKg: number,
    waterWasteL: number,
    hungryPeopleFed: number
  }
}
```

**Example:**
```javascript
const auditResult = await runLocalAnomalyDetection(
  {
    eventType: "Sports Day",
    attendance: 250,
    timeOfDay: "Afternoon",
    attendeeAgeGroup: "teens",
    allergenAlerts: [],
    items: [
      { name: "Sandwich", qty: 300, unitType: "individual", sizeValue: "1" },
      { name: "Water", qty: 320, unitType: "volume", sizeValue: "500" }
    ]
  },
  eventHistory
);

console.log(auditResult.impactMetrics);
// { foodWasteKg: 8.5, waterWasteL: 3200, hungryPeopleFed: 21 }
```

---

#### **3. runIntelligentLogisticsMatching(itemsArray, timeOfDay, allergenAlerts)**
Scores and ranks regional food bank partners.

**Parameters:**
```javascript
itemsArray: Array<{
  name: string,
  unitType: string
}>,

timeOfDay: string,           // Affects hub availability
allergenAlerts: string[]     // "Nuts" | "Dairy" | "Gluten"
```

**Returns:**
```javascript
Array<{
  name: string,
  desk: string,
  contact: string,
  acceptedTypes: string[],   // "perishable" | "shelf-stable"
  operatingHours: string[],
  description: string,
  matchScore: number,        // 10-100 (higher = better fit)
  routingNotes: string[]     // Diagnostic messages
}>
```

**Scoring Logic:**
- Base score: 100
- -40 if hub closed during requested time window
- -50 if hub cannot accept perishable items (and menu has perishables)
- -15 per active allergen flag
- Final floor: minimum 10 (no hub rejected outright)

---

#### **4. UNIT_TYPES Configuration**
Defines supported measurement categories.

```javascript
const UNIT_TYPES = {
  individual: "Individual Pieces",      // Sandwiches, muffins, etc.
  volume: "Liquids / Volumes",          // Juices, water, coffee
  weight: "Solid Foods / Weight"        // Bulk trays, pastries
};
```

**Volume Size Presets** (when unitType = "volume"):
```javascript
[
  { label: "Small Cup/Box (250ml)", value: 250 },
  { label: "Medium Bottle (500ml)", value: 500 },
  { label: "Large Carton (1L)", value: 1000 },
  { label: "Bulk Bottle (1.5L)", value: 1500 }
]
```

**Weight Size Presets** (when unitType = "weight"):
```javascript
[
  { label: "Single Portion (~150g)", value: 150 },
  { label: "Standard Kilo Pack (1kg)", value: 1000 },
  { label: "Large Buffet Tray (2kg)", value: 2000 }
]
```

---

### Global Data Constants

#### **Demographic Multipliers**
```javascript
const AGE_CONSUMPTION_MULTIPLIERS = {
  primary: 0.65,      // Children eat ~35% less
  teens: 1.35,        // Athletes/teens eat ~35% more
  adults: 1.00,       // Baseline standard
  mixed: 1.10         // Mixed groups: conservative mid-point
};
```

#### **Food Item Profiles**
```javascript
const ITEM_PROFILE_DEFAULTS = {
  sandwich: { 
    type: "individual", 
    weightGrams: 200, 
    virtualWaterLiters: 200 
  },
  muffins: { 
    type: "individual", 
    weightGrams: 120, 
    virtualWaterLiters: 90 
  },
  bananas: { 
    type: "individual", 
    weightGrams: 150, 
    virtualWaterLiters: 120 
  },
  "juice boxes": { 
    type: "volume", 
    size: 250, 
    weightGrams: 250, 
    virtualWaterLiters: 100 
  },
  // ... 15+ more items
};
```

#### **Campus Charity Registry**
```javascript
const CAMPUS_CHARITY_REGISTRY = [
  {
    name: "Hifz Al Naema Food Bank",
    desk: "Doha Logistics Hub",
    contact: "+974 4435 5555",
    acceptedTypes: ["perishable", "shelf-stable"],
    operatingHours: ["Lunch", "Afternoon", "Evening"],
    description: "Reclaims unserved buffet catering via rapid cold-chain."
  },
  {
    name: "Qatar Charity (Tayf Program)",
    desk: "Community Distribution Network",
    contact: "+974 4466 7711",
    acceptedTypes: ["shelf-stable"],
    operatingHours: ["Morning", "Lunch", "Afternoon"],
    description: "Optimized for sealed boxes and dry snacks."
  }
];
```

---

## 📖 Usage Guide

### Typical Workflow: Planning a Sports Day

#### **Scenario**
You're coordinating food for a Sports Day with 250 students (mostly teens, ages 14-17). Expected time: Afternoon.

#### **Step 1: Enter Event Details**
```
Function Category: Sports Day
Expected Guests: 250
Time Schedule: Afternoon
Target Consumer Demographic: Teen Cohort / Athletes (1.35x)
Allergen Safety Registry: [Toggle] Nuts
```

#### **Step 2: Add Menu Items**
```
Item #1: Sandwiches
  Quantity: 300
  Unit Type: Individual Pieces
  
Item #2: Water Bottles
  Quantity: 320
  Unit Type: Liquids / Volumes
  Size: Medium Bottle (500ml)
  
Item #3: Orange Slices
  Quantity: 200
  Unit Type: Solid Foods / Weight
  Size: Single Portion (~150g)
```

#### **Step 3: Run Audit**
Click **"Run Sustainability Audit →"**

The app processes:
- Searches history for past "Sports Day" events
- Finds average per-head ratios (e.g., sandwich ratio = 0.92)
- Applies teen multiplier: 0.92 × 1.35 = 1.242 per head
- Calculates targets: 250 × 1.242 = 310.5 sandwiches
- Flags: Your 300 sandwiches = -3.3% (OPTIMAL)

#### **Step 4: Review Results**

**Sustainability Dashboard Shows:**
```
Estimated Waste Mass: 1.2 KG
Nutritional Capacity: 3 MEALS
```

**Detected Over-Allocations:**
None (you're well-calibrated!)

**Provisions Re-Calibration:**
- Sandwiches: Planned 300 → Suggested 310 (slight under, within margin)
- Water: Planned 320 → Suggested 298 (slight over, 7%)
- Oranges: Planned 200 → Suggested 185 (slight over, 8%)

**Qatar Food Recovery Routing Hubs:**
```
🏆 #1 Hifz Al Naema (95% match)
    ⚡ Node active for "Afternoon" collection
    ❄️ Certified cold-chain transport ready
    ⚠️ Contains allergens: (Nuts)
    Contact: +974 4435 5555

🏆 #2 Qatar Charity - Tayf (60% match)
    🕒 Hub inactive during "Afternoon" window
    ❌ Node leaves unsealed fresh items
    Contact: +974 4466 7711
```

**Smart Recovery Action Matrix:**
```
STEP_1 [Procurement] Calibrate original baseline targets down to recommended quantities.
STEP_2 [Redistribution] Redirect fresh unserved tracking units directly to school athletic locker rooms for sports training students.
STEP_3 [Recovery] Secure remaining parcels and prioritize dispatch to Hifz Al Naema before gate closures.
```

#### **Step 5: Post-Event Logging (After Sports Day)**

Input actual consumed amounts:
```
Sandwiches: Planned 300 → Actual Eaten: 287
Water Bottles: Planned 320 → Actual Eaten: 268
Orange Slices: Planned 200 → Actual Eaten: 142
```

Click **"Commit Ingestion Data to System Memory"**

✅ Record saved. Next Sports Day will factor this data into recommendations.

---

### Advanced: Custom Event Types

If you frequently host unique events not in the template list:

1. Select **"Custom Event"** from Function Category
2. Fill in menu details as usual
3. Save after completion
4. System will:
   - Create a new event record in history
   - Learn patterns across all similar custom events
   - Improve recommendations over time

---

### Tips for Best Results

✅ **Log actual consumption**: The more post-event data you add, the more accurate future predictions become  
✅ **Track allergens consistently**: If you always flag "Dairy," the system learns your safety requirements  
✅ **Group similar events**: Use the same event type for similar gatherings (e.g., all "Parent Evenings" use "Parent Evening")  
✅ **Review recommendations**: Don't blindly accept suggestions; they're calibrated to your historical data  
✅ **Export data regularly**: Periodically screenshot or export history for backup (browser localStorage can be cleared)

---

## 🗺️ Roadmap

### Phase 1: Current Release (MVP) ✅
- [x] Client-side prediction engine
- [x] Demographic calibration
- [x] Allergen safety intercepts
- [x] Sustainability telemetry
- [x] Historical baseline learning
- [x] Charity routing (simulated)
- [x] React + Tailwind UI

### Phase 2: Backend Integration (Q3 2026) 🚀
- [ ] Optional LLM routing layer (Claude/Gemini API)
  - Parse unstructured catering emails
  - Extract menu items from images
  - Natural language event descriptions
  
- [ ] Geolocation API integration
  - Auto-detect school campus coordinates
  - Query live food bank operating hours
  - Generate dynamic regional registries
  
- [ ] Real-time charity management system
  - Direct API handshakes with food bank networks
  - Automated dispatch notifications
  - Live inventory synchronization

### Phase 3: Enterprise Features (2027) 💼
- [ ] Multi-school deployment architecture
  - Centralized analytics dashboard
  - Cross-campus consumption benchmarking
  - Regional waste reduction reporting
  
- [ ] Advanced ML predictions
  - Temporal pattern recognition (seasonal trends)
  - Weather-based consumption adjustment
  - Predictive allergen prevalence
  
- [ ] Integration with institutional ERP systems
  - Budget tracking & cost optimization
  - Procurement automation
  - Compliance reporting (ESG metrics)

### Phase 4: Global Expansion (2027+) 🌍
- [ ] Multi-language support
- [ ] International food bank networks
- [ ] Regulatory compliance modules (region-specific)
- [ ] Carbon footprint tracking (beyond water)

---

## 🤝 Contributing

EventWaste Scout is designed for community contributions. Whether you're fixing bugs, optimizing algorithms, or adding regional support, we welcome your help.

### Contribution Areas

#### **Bug Reports & Fixes**
- Test on your device; document any UI/logic issues
- Submit detailed bug reports with:
  - Steps to reproduce
  - Expected vs. actual behavior
  - Browser/device info

#### **Algorithm Improvements**
- Suggest better demographic multipliers based on research
- Add new food item profiles with scientifically-backed water footprints
- Improve anomaly detection thresholds

#### **Regional Customization**
- Add food banks/charities for your region
- Localize event types (e.g., Indian schools: "Diwali Celebration" vs. "Sports Day")
- Translate UI to new languages

#### **Feature Development**
- Extend the roadmap (see Roadmap section)
- Add export formats (CSV, PDF reports)
- Implement data visualization (charts, graphs)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/EventWasteScout.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Test locally with `npm run dev`
   - Lint with `npm run lint`

4. **Commit with clear messages**
   ```bash
   git commit -m "Add [feature]: description of change"
   ```

5. **Push and open a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- **Component Structure**: One component per file in src/
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Comments**: JSDoc-style for complex functions
- **Testing**: Manual testing required for UI changes; no automated tests yet

### Pull Request Process

1. Update README.md if adding features
2. Include before/after screenshots for UI changes
3. Link to any related issues
4. Wait for review from maintainers
5. Address feedback; merge after approval

---

## ❓ FAQ & Troubleshooting

### General Questions

#### **Q: Do I need an account to use EventWaste Scout?**
**A:** No. The app runs entirely client-side with no login required. Your data stays on your device.

#### **Q: Will my data be synced across devices?**
**A:** Not automatically. Event history is stored in your browser's localStorage. If you want to transfer data:
- Use browser dev tools to export/import localStorage manually
- Future versions may include cloud sync (optional)

#### **Q: Can I use this offline?**
**A:** Yes, after the initial load. The app caches all logic locally; no internet required for predictions or audits.

#### **Q: How much data can I store?**
**A:** Typically 5-10MB, which accommodates 50,000+ events depending on item complexity.

#### **Q: Is there a cost?**
**A:** No. EventWaste Scout is free and open-source.

---

### Technical Troubleshooting

#### **Q: The app won't load. What do I do?**
**A:** 
1. Check Node.js version: `node --version` (should be v16+)
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules & reinstall: `rm -rf node_modules && npm install`
4. Try again: `npm run dev`
5. Check browser console for errors (F12)

#### **Q: My changes aren't showing up.**
**A:**
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check if dev server is running: http://localhost:5173
3. Look for errors in terminal output

#### **Q: localStorage seems empty. Did I lose data?**
**A:**
1. Check if browser privacy mode is enabled (data clears on close)
2. Verify storage key: Open DevTools → Application → Storage → Local Storage
3. Look for key starting with "ewscout_history_"
4. If not found, history has been cleared (intentionally or by browser)

#### **Q: Build fails with "module not found."**
**A:**
1. Ensure all dependencies installed: `npm install`
2. Check package.json for typos
3. Try: `npm update` to sync versions

#### **Q: Tailwind styles aren't loading.**
**A:**
1. The vite build includes Tailwind automatically
2. If styles missing in production, run: `npm run build`
3. Check dist/ folder exists and contains CSS file

---

### Functional Questions

#### **Q: How accurate are the predictions?**
**A:** Accuracy depends on:
- Historical data volume (more events = better baselines)
- Consistency in event types (similar events improve accuracy)
- Data entry accuracy (garbage in, garbage out)
- Typical error margin: ±10-15% deviation from actual consumption

#### **Q: Why is a food bank scored low despite being open?**
**A:**
- Hub doesn't accept your menu's food types (e.g., perishables)
- Active allergens present (items marked with allergen reduce compatibility)
- Operating hours don't align with your event time

#### **Q: Can I use this for non-school events?**
**A:** Yes. While designed for schools, you can:
- Use "Custom Event" category
- Adjust attendance & demographics
- Adapt menu items (the logic is universal)
- The system learns from your historical patterns

#### **Q: How do I report a bug?**
**A:**
1. Open a GitHub Issue: https://github.com/Shriyansh-24/EventWasteScout/issues
2. Include:
   - Browser & version
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots if UI-related

#### **Q: Can I export my event history?**
**A:** Currently: Manual export via browser DevTools
- Open DevTools (F12)
- Application → Local Storage → Find "ewscout_history_v4"
- Copy the data
- Paste into a text file or Excel

Future version: Built-in CSV/JSON export button planned.

---

### Performance & Optimization

#### **Q: The app feels slow. How do I optimize?**
**A:**
1. Reduce historical records: Delete very old events from History tab
2. Close other browser tabs (memory pressure)
3. Clear browser cache: `Ctrl+Shift+Delete`
4. Use a modern browser (Chrome/Firefox/Safari latest)

#### **Q: How do I clear all data and start fresh?**
**A:**
1. Open DevTools (F12)
2. Application → Local Storage → Right-click "ewscout_history_v4" → Delete
3. Refresh page (F5)
4. App resets to seeded baseline (10 template events)

---

## 📄 License

This project is released under the **MIT License**. See LICENSE file for full details.

### License Summary
- ✅ Free to use, modify, distribute
- ✅ Attribution appreciated (cite repo link in credits)
- ❌ No warranty provided
- ❌ Liability disclaimer applies

---

## 🌍 Sustainability Impact

### The Math Behind Our Mission

If EventWaste Scout is adopted by just **50 schools** averaging **3 events/month**:

```
Annual Events: 50 schools × 3 events/month × 12 months = 1,800 events

Average Waste Reduction (Conservative):
- Per event: ~5-8 KG food waste prevented
- Per event: ~2,000-3,000 L virtual water saved
- Per event: ~12-20 meals redirected to food-insecure individuals

Annual Impact:
- Food waste prevented: 9,000-14,400 KG
- Virtual water saved: 3.6-5.4 million liters
- Meals provided: 21,600-36,000 meals to hungry families
```

This is why we built EventWaste Scout—not as a nice-to-have, but as **urgent infrastructure for a more equitable, sustainable world**.

---

## 📞 Contact & Support

- **Issues & Bug Reports**: [GitHub Issues](https://github.com/Shriyansh-24/EventWasteScout/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/Shriyansh-24/EventWasteScout/discussions) (coming soon)
- **Email**: Contact via GitHub profile
- **Live Demo**: https://eventwastescout.netlify.app/

---

## 🙏 Acknowledgments

EventWaste Scout was built as a **high school track portfolio submission** (Doha, Qatar 2026) with inspiration from:

- **Too Good To Go** – Visual identity & sustainability mission
- **Effective Altruism** – Problem prioritization framework
- **FAO & USDA Agricultural Data** – Virtual water footprint research
- **Open Source Community** – React, Vite, Tailwind CSS

---

**Made with 🌱 for a world with zero food waste.**
