import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// DATA CONSTANTS & UNIT CONVERSIONS (TGTG Look)
// ─────────────────────────────────────────────
const UNIT_TYPES = {
  individual: "Individual Pieces",
  volume: "Liquids / Volumes",
  weight: "Solid Foods / Weight",
};

const VOLUME_SIZES = [
  { label: "Small Cup/Box (250ml)", value: 250 },
  { label: "Medium Bottle (500ml)", value: 500 },
  { label: "Large Carton (1L)", value: 1000 },
  { label: "Bulk Bottle (1.5L)", value: 1500 },
];

const WEIGHT_SIZES = [
  { label: "Single Portion (~150g)", value: 150 },
  { label: "Standard Kilo Pack (1kg)", value: 1000 },
  { label: "Large Buffet Tray (2kg)", value: 2000 },
];

const ITEM_PROFILE_DEFAULTS = {
  sandwich: { type: "individual", size: 1, weightGrams: 200, virtualWaterLiters: 200 },
  muffins: { type: "individual", size: 1, weightGrams: 120, virtualWaterLiters: 90 },
  bananas: { type: "individual", size: 1, weightGrams: 150, virtualWaterLiters: 120 },
  croissants: { type: "individual", size: 1, weightGrams: 90, virtualWaterLiters: 70 },
  samosas: { type: "individual", size: 1, weightGrams: 75, virtualWaterLiters: 50 },
  cookies: { type: "individual", size: 1, weightGrams: 40, virtualWaterLiters: 30 },
  "juice boxes": { type: "volume", size: 250, weightGrams: 250, virtualWaterLiters: 100 },
  "water bottles": { type: "volume", size: 500, weightGrams: 500, virtualWaterLiters: 5 },
  "coffee cups": { type: "volume", size: 250, weightGrams: 250, virtualWaterLiters: 140 },
  "orange juice": { type: "volume", size: 250, weightGrams: 250, virtualWaterLiters: 110 },
  "lemonade cups": { type: "volume", size: 250, weightGrams: 250, virtualWaterLiters: 40 },
  "tea/coffee": { type: "volume", size: 250, weightGrams: 250, virtualWaterLiters: 120 },
  "date trays": { type: "weight", size: 2000, weightGrams: 2000, virtualWaterLiters: 800 },
  "chips bags": { type: "individual", size: 1, weightGrams: 50, virtualWaterLiters: 40 },
  biscuits: { type: "individual", size: 25, weightGrams: 25, virtualWaterLiters: 20 },
  pastries: { type: "individual", size: 80, weightGrams: 80, virtualWaterLiters: 65 },
  "fruit cups": { type: "weight", size: 150, weightGrams: 150, virtualWaterLiters: 50 },
  "energy bars": { type: "individual", size: 1, weightGrams: 60, virtualWaterLiters: 45 },
};

function getItemMetrics(name, qty, unitType, sizeValue) {
  const normalizedName = name.toLowerCase().trim();
  const defaultProfile = ITEM_PROFILE_DEFAULTS[normalizedName] || {
    type: "individual",
    size: 1,
    weightGrams: 150,
    virtualWaterLiters: 100,
  };

  const finalType = unitType || defaultProfile.type;
  let finalWeightGrams = 0;
  let finalWaterLiters = 0;

  if (finalType === "individual") {
    finalWeightGrams = qty * (defaultProfile.weightGrams || 150);
    finalWaterLiters = qty * (defaultProfile.virtualWaterLiters || 100);
  } else if (finalType === "volume") {
    const mlMultiplier = parseInt(sizeValue, 10) || defaultProfile.size || 250;
    const totalMl = qty * mlMultiplier;
    finalWeightGrams = totalMl;
    finalWaterLiters = totalMl / 1000 + (totalMl * 0.2);
  } else if (finalType === "weight") {
    const gramMultiplier = parseInt(sizeValue, 10) || defaultProfile.size || 150;
    finalWeightGrams = qty * gramMultiplier;
    finalWaterLiters = (finalWeightGrams / 1000) * 400;
  }

  return {
    weightKg: +(finalWeightGrams / 1000).toFixed(2),
    waterLiters: +finalWaterLiters.toFixed(1),
    peopleFed: Math.max(0, Math.floor(finalWeightGrams / 400)),
  };
}

const SEED_HISTORY = [
  {
    id: "evt-001",
    eventType: "Sports Day",
    attendance: 250,
    timeOfDay: "Afternoon",
    audienceNote: "Students and teachers competing",
    items: [
      { name: "Sandwich", planned: 300, actual: 276, perHead: 0.92, unitType: "individual", sizeValue: "1" },
      { name: "Water", planned: 320, actual: 280, perHead: 0.87, unitType: "volume", sizeValue: "500" },
      { name: "Juice", planned: 250, actual: 197, perHead: 0.78, unitType: "individual", sizeValue: "1" },
      { name: "Orange Slices", planned: 200, actual: 155, perHead: 0.62, unitType: "weight", sizeValue: "150" },
    ],
  },
  {
    id: "evt-002",
    eventType: "Parents Evening",
    attendance: 200,
    timeOfDay: "Evening",
    audienceNote: "Parents and school staff",
    items: [
      { name: "Water", planned: 210, actual: 178, perHead: 0.84, unitType: "weight", sizeValue: "150" },
      { name: "Tea", planned: 160, actual: 185, perHead: 0.92, unitType: "volume", sizeValue: "250" },
      { name: "Biscuits", planned: 180, actual: 165, perHead: 0.92, unitType: "individual", sizeValue: "1" },
      { name: "Coffee", planned: 160, actual: 148, perHead: 0.82, unitType: "volume", sizeValue: "250" },
    ],
  },
  {
    id: "evt-003",
    eventType: "Science Fair",
    attendance: 350,
    timeOfDay: "Morning",
    audienceNote: "Students, parents, and judges",
    items: [
      { name: "Water", planned: 400, actual: 320, perHead: 0.80, unitType: "individual", sizeValue: "1" },
      { name: "Juice", planned: 350, actual: 268, perHead: 0.76, unitType: "volume", sizeValue: "250" },
      { name: "Fruits", planned: 350, actual: 270, perHead: 0.77, unitType: "individual", sizeValue: "1" },
      { name: "Sandwich", planned: 300, actual: 290, perHead: 0.96, unitType: "weight", sizeValue: "150" },
    ],
  },
  {
    id: "evt-004",
    eventType: "Debate Tournament",
    attendance: 120,
    timeOfDay: "Afternoon",
    audienceNote: "Students and debate coaches",
    items: [
      { name: "Pizza slice", planned: 140, actual: 95, perHead: 0.79, unitType: "individual", sizeValue: "1" },
      { name: "Water", planned: 150, actual: 110, perHead: 0.73, unitType: "volume", sizeValue: "500" },
      { name: "Juice", planned: 120, actual: 91, perHead: 0.75, unitType: "individual", sizeValue: "1" },
      { name: "Puff", planned: 100, actual: 98, perHead: 0.98, unitType: "weight", sizeValue: "150" },
    ],
  },
  {
    id: "evt-005",
    eventType: "Parents Evening",
    attendance: 200,
    timeOfDay: "Evening",
    audienceNote: "Parents, teachers, and administrators",
    items: [
      { name: "Sandwich", planned: 240, actual: 178, perHead: 0.74, unitType: "individual", sizeValue: "1" },
      { name: "Coffee", planned: 250, actual: 223, perHead: 0.89, unitType: "volume", sizeValue: "250" },
      { name: "Cookies", planned: 200, actual: 143, perHead: 0.71, unitType: "individual", sizeValue: "1" },
      { name: "Water", planned: 250, actual: 213, perHead: 0.85, unitType: "weight", sizeValue: "2000" },
    ],
  },
  {
    id: "evt-006",
    eventType: "Sports Day",
    attendance: 280,
    timeOfDay: "Afternoon",
    audienceNote: "Students, athletes, and spectators",
    items: [
      { name: "Hot dogs", planned: 280, actual: 275, perHead: 0.98, unitType: "individual", sizeValue: "1" },
      { name: "Water", planned: 300, actual: 250, perHead: 0.83, unitType: "volume", sizeValue: "250" },
      { name: "Chips", planned: 280, actual: 195, perHead: 0.70, unitType: "individual", sizeValue: "1" },
      { name: "Fruits", planned: 250, actual: 97, perHead: 0.38, unitType: "weight", sizeValue: "2000" },
    ],
  },
  {
    id: "evt-007",
    eventType: "Science Fair",
    attendance: 400,
    timeOfDay: "Afternoon",
    audienceNote: "Students presenting and viewing projects",
    items: [
      { name: "Pizza Slice", planned: 500, actual: 387, perHead: 0.77, unitType: "individual", sizeValue: "1" },
      { name: "Soft drink", planned: 480, actual: 400, perHead: 1.0, unitType: "volume", sizeValue: "250" },
      { name: "Puff", planned: 400, actual: 323, perHead: 0.80, unitType: "individual", sizeValue: "1" },
      { name: "Water", planned: 500, actual: 367, perHead: 0.73, unitType: "weight", sizeValue: "2000" },
    ],
  },
  {
    id: "evt-008",
    eventType: "Debate Tournament",
    attendance: 500,
    timeOfDay: "Afternoon",
    audienceNote: "Competing debate teams from multiple schools",
    items: [
      { name: "Sandwich", planned: 500, actual: 135, perHead: 0.90, unitType: "individual", sizeValue: "1" },
      { name: "Water", planned: 600, actual: 328, perHead: 0.54, unitType: "volume", sizeValue: "500" },
      { name: "Fruit", planned: 450, actual: 105, perHead: 0.23, unitType: "weight", sizeValue: "150" },
      { name: "Pizza", planned: 500, actual: 487, perHead: 0.97, unitType: "individual", sizeValue: "1" },
    ],
  },
  {
    id: "evt-009",
    eventType: "Parents Evening",
    attendance: 220,
    timeOfDay: "Evening",
    audienceNote: "Parents, guardians, and teaching staff",
    items: [
      { name: "Sandwich", planned: 260, actual: 195, perHead: 0.89, unitType: "individual", sizeValue: "1" },
      { name: "Coffee", planned: 280, actual: 245, perHead: 0.87, unitType: "volume", sizeValue: "250" },
      { name: "Brownies", planned: 220, actual: 170, perHead: 0.77, unitType: "individual", sizeValue: "1" },
      { name: "Pasta", planned: 300, actual: 214, perHead: 0.71, unitType: "weight", sizeValue: "2000" },
    ],
  },
  {
    id: "evt-010",
    eventType: "Custom Event",
    attendance: 300,
    timeOfDay: "Lunch",
    audienceNote: "School community and families",
    items: [
      { name: "Pizza", planned: 350, actual: 285, perHead: 0.81, unitType: "individual", sizeValue: "1" },
      { name: "Water", planned: 400, actual: 387, perHead: 0.96, unitType: "volume", sizeValue: "250" },
      { name: "Cupcake", planned: 300, actual: 255, perHead: 0.85, unitType: "individual", sizeValue: "1" },
      { name: "Fruits", planned: 250, actual: 98, perHead: 0.39, unitType: "weight", sizeValue: "2000" },
    ],
  },
];

const AGE_CONSUMPTION_MULTIPLIERS = {
  primary: 0.65,
  teens: 1.35,
  adults: 1.00,
  mixed: 1.10
};

const CAMPUS_CHARITY_REGISTRY = [
  {
    name: "Hifz Al Naema Food Bank",
    desk: "Doha Logistics Hub",
    contact: "+974 4435 5555",
    acceptedTypes: ["perishable", "shelf-stable"],
    operatingHours: ["Lunch", "Afternoon", "Evening"],
    description: "Reclaims unserved buffet catering and hot meals directly via rapid cold-chain deployment."
  },
  {
    name: "Qatar Charity (Tayf Program)",
    desk: "Community Distribution Network",
    contact: "+974 4466 7711",
    acceptedTypes: ["shelf-stable"],
    operatingHours: ["Morning", "Lunch", "Afternoon"],
    description: "Dedicated distribution network optimized for sealed boxes, dry snacks, and non-perishables."
  }
];

function runIntelligentLogisticsMatching(itemsArray, timeOfDaySelected, allergenAlerts) {
  const hasPerishables = itemsArray.some(item => {
    const name = item.name.toLowerCase();
    return name.includes("sandwich") || name.includes("samosa") || name.includes("pizza") || 
           name.includes("pastry") || name.includes("muffin");
  });

  return CAMPUS_CHARITY_REGISTRY.map(charity => {
    let matchScore = 100;
    const diagnosticNotes = [];

    if (!charity.operatingHours.includes(timeOfDaySelected)) {
      matchScore -= 40;
      diagnosticNotes.push(`🕒 Hub inactive during "${timeOfDaySelected}" window.`);
    } else {
      diagnosticNotes.push(`⚡ Node active for "${timeOfDaySelected}" collection.`);
    }

    if (hasPerishables && !charity.acceptedTypes.includes("perishable")) {
      matchScore -= 50;
      diagnosticNotes.push("❌ Node leaves unsealed fresh items.");
    } else if (hasPerishables) {
      diagnosticNotes.push("❄️ Certified cold-chain transport ready.");
    }

    if (allergenAlerts && allergenAlerts.length > 0) {
      matchScore -= 15;
      diagnosticNotes.push(`⚠️ Contains allergens: (${allergenAlerts.join(", ")}).`);
    }

    return {
      ...charity,
      matchScore: Math.max(10, matchScore),
      routingNotes: diagnosticNotes
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

async function runLocalAnomalyDetection(formData, history) {
  const { eventType, attendance, timeOfDay, items, attendeeAgeGroup, allergenAlerts } = formData;
  const relevantHistory = history.filter((e) => e.eventType === eventType);
  const pool = relevantHistory.length >= 1 ? relevantHistory : history;

  const ratioMap = {};
  const ratioCount = {};
  pool.forEach((evt) => {
    evt.items.forEach((item) => {
      const key = item.name.toLowerCase().trim();
      ratioMap[key] = (ratioMap[key] || 0) + item.perHead;
      ratioCount[key] = (ratioCount[key] || 0) + 1;
    });
  });
  Object.keys(ratioMap).forEach((k) => {
    ratioMap[k] = ratioMap[k] / ratioCount[k];
  });

  const DEFAULT_RATIO = 0.75;
  const anomaliesDetected = [];
  const recommendedQuantities = [];
  
  let globalSurplusWeightKg = 0;
  let globalSurplusWaterLiters = 0;
  let globalPeopleFed = 0;

  const ageMultiplier = AGE_CONSUMPTION_MULTIPLIERS[attendeeAgeGroup] || 1.00;

  items.forEach((item) => {
    const key = item.name.toLowerCase().trim();
    const baselineBase = ratioMap[key] ?? DEFAULT_RATIO;
    const calibratedBaseline = baselineBase * ageMultiplier;
    
    const suggestedQty = Math.max(1, Math.round(calibratedBaseline * attendance));
    const plannedQty = parseInt(item.qty, 10) || 0;
    const deviation = plannedQty > 0 ? ((plannedQty - suggestedQty) / suggestedQty) * 100 : 0;

    let status = "optimal";
    if (deviation > 30) status = "high-risk";
    else if (deviation > 10) status = "slight-over";

    if (deviation > 10) {
      anomaliesDetected.push({
        item: item.name,
        percentageOver: Math.round(deviation),
        reason: `Baseline calculates ${calibratedBaseline.toFixed(2)} units/head. Current order deviates by +${Math.round(deviation)}%.`,
      });

      const surplusQty = plannedQty - suggestedQty;
      const metrics = getItemMetrics(item.name, surplusQty, item.unitType, item.sizeValue);
      globalSurplusWeightKg += metrics.weightKg;
      globalSurplusWaterLiters += metrics.waterLiters;
      globalPeopleFed += metrics.peopleFed;
    }

    recommendedQuantities.push({
      item: item.name,
      plannedQty,
      suggestedQty,
      baselineUsed: calibratedBaseline.toFixed(2),
      status,
      unitType: item.unitType,
      sizeValue: item.sizeValue,
    });
  });

  const isHighVolume = globalSurplusWeightKg > 15;
  const logisticsMatching = runIntelligentLogisticsMatching(items, timeOfDay, allergenAlerts);
  const contingencyPlan = [];

  contingencyPlan.push(`[Procurement] Calibrate original baseline targets down directly to recommended quantities.`);

  if (timeOfDay === "Morning" || timeOfDay === "Lunch") {
    if (isHighVolume) {
      contingencyPlan.push(`[Transit] Forward remaining portions immediately to the Student Lounge Hub for open access distribution.`);
    } else {
      contingencyPlan.push(`[Storage] Hold inventory items inside department breakrooms for afternoon availability.`);
    }
  } else if (timeOfDay === "Afternoon") {
    contingencyPlan.push(`[Redistribution] Redirect fresh unserved tracking units directly to school athletic locker rooms for sports training students.`);
  } else { 
    contingencyPlan.push(`[Recovery] Secure remaining parcels and prioritize dispatch straight to ${logisticsMatching[0].name} before gate closures.`);
  }

  return {
    anomaliesDetected,
    recommendedQuantities,
    contingencyPlan,
    logisticsMatching,
    impactMetrics: {
      foodWasteKg: +globalSurplusWeightKg.toFixed(1),
      waterWasteL: +globalSurplusWaterLiters.toFixed(1),
      hungryPeopleFed: globalPeopleFed || Math.ceil(globalSurplusWeightKg * 2),
    },
  };
}

export default function App() {
  const LS_KEY = "ewscout_history_v3";

  const [eventHistory, setEventHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      return stored ? JSON.parse(stored) : SEED_HISTORY;
    } catch {
      return SEED_HISTORY;
    }
  });

  const [form, setForm] = useState({
    eventType: "Parents Evening",
    attendance: "",
    timeOfDay: "Evening",
    attendeeAgeGroup: "adults",
    allergenAlerts: [],
    items: [{ id: Date.now(), name: "", qty: "", unitType: "individual", sizeValue: "1" }],
  });

  const [auditResult, setAuditResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logActuals, setLogActuals] = useState({});
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("audit");
  const resultsRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(eventHistory));
    } catch {}
  }, [eventHistory]);

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const toggleAllergen = (allergen) => setForm((f) => {
    const active = f.allergenAlerts.includes(allergen)
      ? f.allergenAlerts.filter(a => a !== allergen)
      : [...f.allergenAlerts, allergen];
    return { ...f, allergenAlerts: active };
  });

  const updateItem = (id, field, value) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((it) => (it.id === id ? { ...it, [field]: value } : it)),
    }));

  const addItem = () =>
    setForm((f) => ({
      ...f,
      items: [...f.items, { id: Date.now(), name: "", qty: "", unitType: "individual", sizeValue: "1" }],
    }));

  const removeItem = (id) =>
    setForm((f) => ({ ...f, items: f.items.filter((it) => it.id !== id) }));

  const handleAudit = async () => {
    setError("");
    setAuditResult(null);
    setSaved(false);

    const validItems = form.items.filter((i) => i.name.trim() && i.qty);
    if (!form.attendance || validItems.length === 0) {
      setError("Please specify attendance headcount and input your menu items.");
      return;
    }

    setLoading(true);
    const formData = { ...form, attendance: parseInt(form.attendance, 10), items: validItems };

    await new Promise((r) => setTimeout(r, 600));
    const localCalculations = await runLocalAnomalyDetection(formData, eventHistory);
    setAuditResult({ ...localCalculations, formData, source: "local" });
    setLoading(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleDeleteEvent = (idToDelete) => {
    if (window.confirm("Remove this entry from history?")) {
      setEventHistory(eventHistory.filter((evt) => evt.id !== idToDelete));
    }
  };

  const handleSaveActuals = () => {
    if (!auditResult) return;
    const { formData } = auditResult;
    const newRecord = {
      id: `evt-${Date.now()}`,
      eventType: formData.eventType,
      attendance: formData.attendance,
      timeOfDay: formData.timeOfDay,
      attendeeAgeGroup: formData.attendeeAgeGroup,
      allergenAlerts: formData.allergenAlerts || [],
      items: formData.items.map((item) => {
        const actualVal = parseInt(logActuals[item.name] ?? item.qty, 10) || 0;
        return {
          name: item.name,
          planned: parseInt(item.qty, 10),
          actual: actualVal,
          perHead: formData.attendance > 0 ? +(actualVal / formData.attendance).toFixed(3) : 0,
          unitType: item.unitType,
          sizeValue: item.sizeValue,
        };
      }),
    };
    setEventHistory([newRecord, ...eventHistory]);
    setSaved(true);
  };

  return (
    // TGTG Brand Palette Styling Rules Applied Across Main Tree
    <div className="min-h-screen bg-[#F9F3F0] text-[#103B39] font-sans antialiased selection:bg-[#00615F] selection:text-white">
      
      {/* BRAND HEADER */}
      <header className="sticky top-0 z-50 bg-[#00615F] text-white shadow-md px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          {/* TGTG Inspired Circle Logo Badge */}
          <div className="w-9 h-9 bg-[#E68A73] rounded-full flex items-center justify-center font-black tracking-tighter text-white shadow-sm text-sm">🌱</div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Too Good To Waste</h1>
            <p className="text-[10px] font-mono text-[#A3D3C9] uppercase tracking-widest -mt-0.5">EventWaste Scout // Intelligence</p>
          </div>
        </div>
        
        {/* TAB CONTROL BUTTONS */}
        <div className="flex bg-[#004D4A] p-1 rounded-full border border-[#104E4B]">
          <button
            onClick={() => setActiveTab("audit")}
            className={`text-xs font-bold px-5 py-2 rounded-full transition-all ${
              activeTab === "audit" ? "bg-[#E68A73] text-white shadow-sm" : "text-[#A3D3C9] hover:text-white"
            }`}
          >
            Audit Workspace
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`text-xs font-bold px-5 py-2 rounded-full transition-all flex items-center gap-2 ${
              activeTab === "history" ? "bg-[#E68A73] text-white shadow-sm" : "text-[#A3D3C9] hover:text-white"
            }`}
          >
            Saved History 
            <span className="bg-[#003634] text-[#A3D3C9] font-mono text-[10px] px-2 py-0.5 rounded-full">
              {eventHistory.length}
            </span>
          </button>
        </div>
      </header>

      {/* DASHBOARD GRID CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "audit" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* INPUT WORKSPACE (LEFT COLUMN) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-[#EBE3DE] space-y-5">
              <div>
                <h2 className="text-lg font-black tracking-tight text-[#00615F] uppercase">Event Scope Matrix</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Calibrate historical parameters below</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold tracking-wide text-zinc-600 block mb-1.5">Function Category</label>
                  <select
                    value={form.eventType}
                    onChange={(e) => updateField("eventType", e.target.value)}
                    className="w-full bg-[#F9F3F0] border-0 rounded-2xl p-3 text-sm font-semibold text-[#103B39] focus:ring-2 focus:ring-[#00615F]"
                  >
                    {["Sports Day", "Science Fair", "Parents Evening", "Debate Tournament", "Custom Event"].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold tracking-wide text-zinc-600 block mb-1.5">Expected Guests</label>
                    <input
                      type="number"
                      min="1"
                      value={form.attendance}
                      onChange={(e) => updateField("attendance", e.target.value)}
                      placeholder="Headcount"
                      className="w-full bg-[#F9F3F0] border-0 rounded-2xl p-3 text-sm font-mono text-[#103B39] placeholder-zinc-400 focus:ring-2 focus:ring-[#00615F]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-wide text-zinc-600 block mb-1.5">Time Schedule</label>
                    <select
                      value={form.timeOfDay}
                      onChange={(e) => updateField("timeOfDay", e.target.value)}
                      className="w-full bg-[#F9F3F0] border-0 rounded-2xl p-3 text-sm font-semibold text-[#103B39] focus:ring-2 focus:ring-[#00615F]"
                    >
                      {["Morning", "Lunch", "Afternoon", "Evening"].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold tracking-wide text-zinc-600 block mb-1.5">Target Consumer Demographic</label>
                  <select
                    value={form.attendeeAgeGroup}
                    onChange={(e) => updateField("attendeeAgeGroup", e.target.value)}
                    className="w-full bg-[#F9F3F0] border-0 rounded-2xl p-3 text-sm font-semibold text-[#103B39] focus:ring-2 focus:ring-[#00615F]"
                  >
                    <option value="primary">Primary Students (0.65x baseline scaling)</option>
                    <option value="teens">Teen Cohort / Athletes (1.35x metabolic boost)</option>
                    <option value="adults">Adult Staff Standard (1.00x default baseline)</option>
                    <option value="mixed">Mixed Demographic Group (1.10x model matrix)</option>
                  </select>
                </div>

                {/* SAFETY CHECKLIST ALLERGENS */}
                <div className="bg-[#FAF6F4] rounded-2xl p-4 border border-[#EBE3DE]">
                  <span className="text-xs font-bold tracking-wide text-zinc-700 block mb-2.5">Allergen Safety Registry</span>
                  <div className="flex flex-wrap gap-2">
                    {["Nuts", "Dairy", "Gluten"].map((allergen) => {
                      const isActive = form.allergenAlerts.includes(allergen);
                      return (
                        <button
                          key={allergen}
                          type="button"
                          onClick={() => toggleAllergen(allergen)}
                          className={`text-xs px-4 py-2 rounded-full font-bold border transition-all ${
                            isActive 
                              ? "bg-red-50 border-red-300 text-red-700 shadow-sm" 
                              : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
                          }`}
                        >
                          {allergen.toUpperCase()} {isActive ? "⚠️" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PROVISIONS INVENTORY LIST */}
                <div className="bg-[#FAF6F4] rounded-2xl p-4 border border-[#EBE3DE] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold tracking-wide text-[#00615F]">Catering Allocation</span>
                    <button 
                      onClick={addItem} 
                      className="text-[11px] font-extrabold text-[#00615F] hover:text-[#004D4A] bg-[#EAF4F2] px-2.5 py-1 rounded-full transition-all"
                    >
                      + Add Menu Item
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                    {form.items.map((item, index) => (
                      <div key={item.id} className="bg-white rounded-xl p-3 border border-zinc-200 shadow-xs space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-zinc-400 font-bold">#{index + 1}</span>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, "name", e.target.value)}
                            placeholder="e.g. Sandwich"
                            className="flex-1 bg-[#F9F3F0] border-0 rounded-xl p-2 text-xs font-semibold focus:ring-1 focus:ring-[#00615F]"
                          />
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                            placeholder="Qty"
                            className="w-16 bg-[#F9F3F0] border-0 rounded-xl p-2 text-xs font-mono font-bold text-center focus:ring-1 focus:ring-[#00615F]"
                          />
                          {form.items.length > 1 && (
                            <button 
                              onClick={() => removeItem(item.id)} 
                              className="text-zinc-400 hover:text-red-600 p-1 font-bold text-sm transition-all"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-dashed border-zinc-100">
                          <select
                            value={item.unitType}
                            onChange={(e) => updateItem(item.id, "unitType", e.target.value)}
                            className="bg-[#FAF6F4] border-0 rounded-lg p-1.5 text-[10px] font-bold text-zinc-600 focus:ring-0"
                          >
                            {Object.entries(UNIT_TYPES).map(([k, val]) => (
                              <option key={k} value={k}>{val}</option>
                            ))}
                          </select>

                          {item.unitType !== "individual" ? (
                            <select
                              value={item.sizeValue}
                              onChange={(e) => updateItem(item.id, "sizeValue", e.target.value)}
                              className="bg-[#FAF6F4] border-0 rounded-lg p-1.5 text-[10px] font-bold text-zinc-600 focus:ring-0"
                            >
                              {(item.unitType === "volume" ? VOLUME_SIZES : WEIGHT_SIZES).map((sz) => (
                                <option key={sz.value} value={sz.value}>{sz.label}</option>
                              ))}
                            </select>
                          ) : (
                            <div className="text-[10px] text-zinc-400 font-medium px-2 py-1 bg-zinc-50 rounded-lg border border-transparent">
                              Piece Unit Metric
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {error && <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold">⚠️ {error}</div>}

                <button
                  onClick={handleAudit}
                  disabled={loading}
                  className="w-full bg-[#E68A73] hover:bg-[#D57962] disabled:bg-zinc-200 text-white font-extrabold rounded-2xl py-3.5 text-xs uppercase tracking-wider transition-all shadow-sm"
                >
                  {loading ? "Calibrating Model Parameters..." : "Run Sustainability Audit →"}
                </button>
              </div>
            </div>

            {/* DIAGNOSTIC RESULTS DISPLAY (RIGHT COLUMN) */}
            <div ref={resultsRef} className="lg:col-span-7 space-y-6">
              {auditResult ? (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* ALLERGEN ALERTS FIREWALL CONTAINER */}
                  {auditResult.formData.allergenAlerts.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-3xl p-5 shadow-sm">
                      <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider mb-1.5">
                        ⚠️ High-Alert Security Screening Triggered
                      </div>
                      <h3 className="text-sm font-black text-zinc-900 uppercase">
                        Active Allergen Footprint: {auditResult.formData.allergenAlerts.join(", ")}
                      </h3>
                      <p className="text-xs text-zinc-600 mt-1 leading-relaxed font-medium">
                        Redistribution pipelines have been locked to secure locations. High-visibility physical flags are required on all outgoing cargo parcel boxes before hub collection.
                      </p>
                    </div>
                  )}

                  {/* SUSTAINABILITY ECO TELEMETRY MAP */}
                  <div className="bg-[#00615F] text-white rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-[#004D4B] pb-3">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#A3D3C9]">Sustainability Footprint Balance</span>
                      <span className="text-[11px] bg-[#004D4B] text-[#A3D3C9] px-2.5 py-1 rounded-full font-bold">Local Edge Node</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-[#004D4B] rounded-2xl p-4 border border-[#003B39]">
                        <span className="text-[10px] font-bold text-[#A3D3C9] uppercase tracking-wider block">Estimated Waste Mass</span>
                        <div className="text-2xl font-black mt-1 font-mono text-white">
                          {auditResult.impactMetrics?.foodWasteKg || 0} <span className="text-xs font-sans text-[#A3D3C9] font-normal">KG</span>
                        </div>
                      </div>
                      <div className="bg-[#004D4B] rounded-2xl p-4 border border-[#003B39]">
                        <span className="text-[10px] font-bold text-[#A3D3C9] uppercase tracking-wider block">Lifecycle Water Loss</span>
                        <div className="text-2xl font-black mt-1 font-mono text-white">
                          {auditResult.impactMetrics?.waterWasteL || 0} <span className="text-xs font-sans text-[#A3D3C9] font-normal">L</span>
                        </div>
                      </div>
                      <div className="bg-[#004D4B] rounded-2xl p-4 border border-[#003B39]">
                        <span className="text-[10px] font-bold text-[#A3D3C9] uppercase tracking-wider block">Nutritional Capacity</span>
                        <div className="text-2xl font-black mt-1 font-mono text-white">
                          {auditResult.impactMetrics?.hungryPeopleFed || 0} <span className="text-xs font-sans text-[#A3D3C9] font-normal">MEALS</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DETECTED OVER-ALLOCATION BLOCK */}
                  {auditResult.anomaliesDetected.length > 0 ? (
                    <div className="bg-white rounded-3xl p-5 border border-[#EBE3DE] shadow-sm space-y-3">
                      <h3 className="text-xs font-black uppercase text-[#E68A73] tracking-wider">⚠️ Procurement Anomalies Detected</h3>
                      <div className="space-y-2">
                        {auditResult.anomaliesDetected.map((anom, idx) => (
                          <div key={idx} className="bg-[#FAF6F4] rounded-2xl p-3 flex justify-between items-start border border-[#EBE3DE] gap-4 text-xs">
                            <div>
                              <div className="font-extrabold text-[#103B39] uppercase">{anom.item}</div>
                              <p className="text-zinc-500 mt-0.5 text-[11px] font-medium leading-relaxed">{anom.reason}</p>
                            </div>
                            <span className="bg-[#E68A73] text-white font-mono font-bold px-2 py-0.5 rounded-lg text-[11px]">
                              +{anom.percentageOver}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 text-xs font-semibold">
                      ✓ Optimization Clear. Order sits within structural baseline limits.
                    </div>
                  )}

                  {/* RE-CALIBRATION MATRIX LIST */}
                  <div className="bg-white rounded-3xl border border-[#EBE3DE] shadow-sm overflow-hidden">
                    <div className="p-4 bg-[#FAF6F4] border-b border-[#EBE3DE] text-xs uppercase font-extrabold text-[#00615F] flex justify-between">
                      <span>Provisions Re-Calibration Guide</span>
                      <span className="text-zinc-400 font-mono font-normal">Target Model Outputs</span>
                    </div>
                    <div className="divide-y divide-zinc-100">
                      {auditResult.recommendedQuantities.map((rec, idx) => (
                        <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full ${rec.status === 'high-risk' ? 'bg-[#E68A73]' : 'bg-emerald-600'}`}></span>
                            <span className="font-extrabold text-[#103B39] uppercase">{rec.item}</span>
                            <span className="text-[10px] text-zinc-400 font-medium">({rec.baselineUsed}/head target)</span>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-4 font-mono text-[11px]">
                            <span className="text-zinc-400 line-through">{rec.plannedQty} Input</span>
                            <span className="font-black text-[#00615F] text-sm">{rec.suggestedQty} Target</span>
                            <span className={`uppercase font-bold text-[10px] px-2 py-0.5 rounded-full ${rec.status === "high-risk" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                              {rec.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CHARITY ROUTING TGTG LOOK */}
                  <div className="bg-white rounded-3xl p-5 border border-[#EBE3DE] shadow-sm space-y-3">
                    <span className="text-xs font-black uppercase text-[#00615F] tracking-wider block">Qatar Food Recovery Routing Hubs</span>
                    <div className="space-y-3">
                      {auditResult.logisticsMatching.map((charity, i) => (
                        <div key={i} className="bg-[#FAF6F4] border border-[#EBE3DE] rounded-2xl p-4 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1">
                            <div className="font-extrabold text-[#103B39] uppercase flex items-center gap-2 flex-wrap">
                              <span>{charity.name}</span>
                              <span className="text-[10px] bg-white border border-zinc-200 text-zinc-500 px-2 py-0.5 font-normal rounded-full">{charity.desk}</span>
                            </div>
                            <div className="text-[11px] text-zinc-500 font-medium leading-relaxed">{charity.description}</div>
                            <div className="pt-1 space-y-0.5">
                              {charity.routingNotes.map((note, idx) => (
                                <div key={idx} className="text-[10px] text-zinc-500 font-medium font-mono">{note}</div>
                              ))}
                            </div>
                          </div>
                          <div className="sm:text-right flex sm:flex-col justify-between w-full sm:w-auto items-center sm:items-end border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-200">
                            <div className="text-xl font-black font-mono text-[#00615F]">{charity.matchScore} <span className="text-xs font-normal text-zinc-400">%</span></div>
                            <div className="text-[11px] font-bold text-zinc-500 font-mono mt-0.5">{charity.contact}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AUTOMATED REDISTRIBUTION SCRIPT BLOCK */}
                  <div className="bg-white rounded-3xl p-5 border border-[#EBE3DE] shadow-sm">
                    <h3 className="text-xs font-black uppercase text-[#00615F] tracking-wider mb-3">⚡ Smart Recovery Action Matrix</h3>
                    <div className="space-y-2.5">
                      {auditResult.contingencyPlan.map((step, idx) => (
                        <div key={idx} className="flex gap-3 text-xs items-start bg-[#FAF6F4] p-2.5 rounded-xl border border-[#EBE3DE]">
                          <span className="font-mono text-[10px] bg-[#00615F] font-bold text-white px-1.5 py-0.5 rounded-md">
                            STEP_{idx + 1}
                          </span>
                          <p className="text-zinc-700 font-medium leading-relaxed pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* POST EVENT CLOSING RECORD LAYER */}
                  <div className="bg-white rounded-3xl p-5 border border-[#EBE3DE] shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#00615F] uppercase">Post-Event Verification Log</h4>
                        <p className="text-xs text-zinc-500 mt-0.5">Input actual consumed pieces to calibrate internal local baselines.</p>
                      </div>
                      {saved && <span className="text-[11px] font-mono bg-[#00615F] text-white font-bold px-3 py-1 rounded-full">MEMORIZED ON DISK</span>}
                    </div>

                    {!saved && (
                      <div className="mt-4 space-y-3">
                        {auditResult.formData.items.map((item) => (
                          <div key={item.name} className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-2">
                            <span className="text-xs font-bold text-zinc-700 uppercase">{item.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-zinc-400 font-mono">Planned: {item.qty}</span>
                              <input
                                type="number"
                                min="0"
                                max={item.qty}
                                placeholder="Actual eaten"
                                value={logActuals[item.name] || ""}
                                onChange={(e) => {
                                  let val = parseInt(e.target.value, 10);
                                  const maxVal = parseInt(item.qty, 10);
                                  if (val > maxVal) val = maxVal;
                                  setLogActuals({ ...logActuals, [item.name]: isNaN(val) ? "" : val });
                                }}
                                className="w-24 bg-[#F9F3F0] border-0 rounded-xl p-1.5 text-xs font-mono font-bold text-center focus:ring-1 focus:ring-[#00615F]"
                              />
                            </div>
                          </div>
                        ))}
                        <button 
                          onClick={handleSaveActuals} 
                          className="w-full bg-[#00615F] hover:bg-[#004D4A] text-white font-bold rounded-xl py-2.5 text-xs uppercase tracking-wide transition-all shadow-xs"
                        >
                          Commit Ingestion Data to System Memory →
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="bg-white rounded-3xl border-2 border-dashed border-[#EBE3DE] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <span className="text-3xl mb-2">📊</span>
                  <span className="text-xs font-black text-[#00615F] uppercase tracking-wider block mb-1">Telemetry Monitor Sleep Mode</span>
                  <p className="text-zinc-400 text-xs max-w-xs font-medium leading-relaxed">Fill out your target catering metrics inside the left panel configuration boards to kickstart optimization loops.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* HISTORICAL REGISTRY LAYOUT (TAB 2) */}
        {activeTab === "history" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#EBE3DE] space-y-6">
            <div>
              <h2 className="text-xl font-black tracking-tight text-[#00615F] uppercase">System Baselines Database</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Localized storage footprints representing persistent regional metadata logs.</p>
            </div>

            <div className="space-y-4">
              {[...eventHistory].map((evt, idx) => (
                <div key={evt.id || idx} className="bg-[#FAF6F4] border border-[#EBE3DE] rounded-2xl p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-200 pb-2 mb-3 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm uppercase text-[#103B39]">{evt.eventType}</span>
                      <span className="font-mono text-[10px] bg-[#00615F] text-white font-bold px-2 py-0.5 rounded-full uppercase">{evt.timeOfDay}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-zinc-400">{evt.id || `historical-node-${idx}`}</span>
                      <button
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="font-mono text-[10px] text-red-600 hover:text-red-800 font-bold transition-all"
                      >
                        [✕ Purge Log Record]
                      </button>
                    </div>
                  </div>

                  {/* UPGRADED HISTORICAL CARD MATRIX */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-zinc-500 mb-3 bg-white p-2.5 rounded-xl border border-zinc-100">
                    <div>👥 DEMOGRAPHIC BUCKET: <span className="font-bold uppercase text-zinc-800">{evt.attendeeAgeGroup || "adults"}</span></div>
                    <div>
                      🛡️ HAZARD FOOTPRINT:{" "}
                      {evt.allergenAlerts && evt.allergenAlerts.length > 0 ? (
                        <span className="font-bold text-red-600 uppercase">CONTAINS RESIDUAL ({evt.allergenAlerts.join(", ")})</span>
                      ) : (
                        <span className="text-emerald-700 font-bold uppercase">ALLERGEN SECURE</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {evt.items.map((it, i) => (
                      <div key={i} className="bg-white border border-zinc-200 p-2.5 rounded-xl font-mono text-xs">
                        <div className="text-[10px] text-zinc-400 uppercase truncate font-bold">{it.name}</div>
                        <div className="text-sm font-black text-[#00615F] mt-0.5">
                          {it.actual !== undefined ? it.actual : "Unchecked"} / <span className="text-zinc-400 text-xs font-normal">{it.planned}</span>
                        </div>
                        <div className="text-[9px] text-zinc-500 font-medium mt-0.5">Ratio: {it.perHead ? it.perHead.toFixed(2) : "0.00"}/head</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-[#EBE3DE] py-8 text-center font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
        EventWaste Scout // High School Track Portfolio Submission // Doha, Qatar 2026
      </footer>
    </div>
  );
}