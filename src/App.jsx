import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// DATA CONSTANTS & UNIT CONVERSIONS (Problem 5 & Units Fix)
// ─────────────────────────────────────────────
const UNIT_TYPES = {
  individual: "Individual (pcs)",
  volume: "Volume (Liquids)",
  weight: "Weight (Solid Foods)",
};

const VOLUME_SIZES = [
  { label: "250ml Cup/Box", value: 250 },
  { label: "500ml Bottle", value: 500 },
  { label: "1L Carton/Bottle", value: 1000 },
  { label: "1.5L Large Bottle", value: 1500 },
];

const WEIGHT_SIZES = [
  { label: "Per Portion (~150g)", value: 150 },
  { label: "Per Kilogram (1000g)", value: 1000 },
  { label: "Per Large Tray (~2000g)", value: 2000 },
];

// Reference conversion map to quickly parse items to metrics
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
  biscuits: { type: "individual", size: 1, weightGrams: 25, virtualWaterLiters: 20 },
  pastries: { type: "individual", size: 1, weightGrams: 80, virtualWaterLiters: 65 },
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
    finalWeightGrams = totalMl; // 1ml water base ~ 1g
    finalWaterLiters = totalMl / 1000 + (totalMl * 0.2); // Liquid Vol + embedded lifecycle
  } else if (finalType === "weight") {
    const gramMultiplier = parseInt(sizeValue, 10) || defaultProfile.size || 150;
    finalWeightGrams = qty * gramMultiplier;
    finalWaterLiters = (finalWeightGrams / 1000) * 400; // Average embedded water factor
  }

  return {
    weightKg: +(finalWeightGrams / 1000).toFixed(2),
    waterLiters: +finalWaterLiters.toFixed(1),
    peopleFed: Math.max(0, Math.floor(finalWeightGrams / 400)), // 400g makes a meal ration
  };
}

// ─────────────────────────────────────────────
// SCHOOL EVENTS DATASET (Sports Day, Science Fair, Parents Evening, Debate Tournament, Custom Events)
// ─────────────────────────────────────────────
const SEED_HISTORY = [
  {
    id: "evt-001",
    eventType: "Sports Day",
    attendance: 250,
    timeOfDay: "Afternoon",
    locationZone: "New York, USA",
    audienceNote: "Students and teachers competing",
    items: [
      { name: "Sandwich", planned: 300, actual: 185, perHead: 0.74, unitType: "individual", sizeValue: "1" },
      { name: "Water", planned: 320, actual: 280, perHead: 1.12, unitType: "volume", sizeValue: "500" },
      { name: "Granola Bars", planned: 250, actual: 140, perHead: 0.56, unitType: "individual", sizeValue: "1" },
      { name: "Orange Slices", planned: 200, actual: 155, perHead: 0.62, unitType: "weight", sizeValue: "150" },
    ],
  },
  {
    id: "evt-002",
    eventType: "Parents Evening",
    attendance: 180,
    timeOfDay: "Evening",
    locationZone: "Los Angeles, USA",
    audienceNote: "Parents and school staff",
    items: [
      { name: "Cheese and Crackers Platter", planned: 195, actual: 178, perHead: 0.99, unitType: "weight", sizeValue: "150" },
      { name: "Hot Chocolate Cup", planned: 220, actual: 185, perHead: 1.03, unitType: "volume", sizeValue: "250" },
      { name: "Cookie", planned: 180, actual: 165, perHead: 0.92, unitType: "individual", sizeValue: "1" },
      { name: "Apple Juice", planned: 160, actual: 148, perHead: 0.82, unitType: "volume", sizeValue: "250" },
    ],
  },
  {
    id: "evt-003",
    eventType: "Science Fair",
    attendance: 350,
    timeOfDay: "Morning",
    locationZone: "San Francisco, USA",
    audienceNote: "Students, parents, and judges",
    items: [
      { name: "Bagel", planned: 400, actual: 280, perHead: 0.80, unitType: "individual", sizeValue: "1" },
      { name: "Orange Juice", planned: 420, actual: 340, perHead: 0.97, unitType: "volume", sizeValue: "250" },
      { name: "Muffin", planned: 350, actual: 210, perHead: 0.60, unitType: "individual", sizeValue: "1" },
      { name: "Fruit Cup", planned: 300, actual: 210, perHead: 0.60, unitType: "weight", sizeValue: "150" },
    ],
  },
  {
    id: "evt-004",
    eventType: "Debate Tournament",
    attendance: 120,
    timeOfDay: "Afternoon",
    locationZone: "Boston, USA",
    audienceNote: "Students and debate coaches",
    items: [
      { name: "Sandwich", planned: 140, actual: 95, perHead: 0.79, unitType: "individual", sizeValue: "1" },
      { name: "Water Bottle", planned: 150, actual: 135, perHead: 1.13, unitType: "volume", sizeValue: "500" },
      { name: "Energy Bar", planned: 120, actual: 90, perHead: 0.75, unitType: "individual", sizeValue: "1" },
      { name: "Banana Slice", planned: 100, actual: 75, perHead: 0.63, unitType: "weight", sizeValue: "150" },
    ],
  },
  {
    id: "evt-005",
    eventType: "Parents Evening",
    attendance: 200,
    timeOfDay: "Evening",
    locationZone: "Chicago, USA",
    audienceNote: "Parents, teachers, and administrators",
    items: [
      { name: "Sandwich", planned: 240, actual: 180, perHead: 0.90, unitType: "individual", sizeValue: "1" },
      { name: "Coffee Service", planned: 250, actual: 225, perHead: 1.13, unitType: "volume", sizeValue: "250" },
      { name: "Pastries", planned: 200, actual: 160, perHead: 0.80, unitType: "individual", sizeValue: "1" },
      { name: "Vegetable Tray", planned: 15, actual: 10, perHead: 0.05, unitType: "weight", sizeValue: "2000" },
    ],
  },
  {
    id: "evt-006",
    eventType: "Sports Day",
    attendance: 280,
    timeOfDay: "Afternoon",
    locationZone: "Dallas, USA",
    audienceNote: "Students, athletes, and spectators",
    items: [
      { name: "Hot Dog", planned: 320, actual: 275, perHead: 0.98, unitType: "individual", sizeValue: "1" },
      { name: "Lemonade Cup", planned: 350, actual: 310, perHead: 1.11, unitType: "volume", sizeValue: "250" },
      { name: "Potato Chip Bag", planned: 280, actual: 195, perHead: 0.70, unitType: "individual", sizeValue: "1" },
      { name: "Watermelon Slice", planned: 25, actual: 18, perHead: 0.06, unitType: "weight", sizeValue: "2000" },
    ],
  },
  {
    id: "evt-007",
    eventType: "Science Fair",
    attendance: 400,
    timeOfDay: "Afternoon",
    locationZone: "Austin, USA",
    audienceNote: "Students presenting and viewing projects",
    items: [
      { name: "Pizza Slice", planned: 500, actual: 380, perHead: 0.95, unitType: "individual", sizeValue: "1" },
      { name: "Sprite and 7-Up", planned: 480, actual: 400, perHead: 1.0, unitType: "volume", sizeValue: "250" },
      { name: "Brownie", planned: 400, actual: 310, perHead: 0.78, unitType: "individual", sizeValue: "1" },
      { name: "Popcorn Bag", planned: 20, actual: 15, perHead: 0.04, unitType: "weight", sizeValue: "2000" },
    ],
  },
  {
    id: "evt-008",
    eventType: "Debate Tournament",
    attendance: 150,
    timeOfDay: "Afternoon",
    locationZone: "Cambridge, USA",
    audienceNote: "Competing debate teams from multiple schools",
    items: [
      { name: "Sandwich", planned: 180, actual: 135, perHead: 0.90, unitType: "individual", sizeValue: "1" },
      { name: "Water Bottle", planned: 200, actual: 175, perHead: 1.17, unitType: "volume", sizeValue: "500" },
      { name: "Mixed Fruit", planned: 150, actual: 105, perHead: 0.70, unitType: "weight", sizeValue: "150" },
      { name: "Granola Bar", planned: 130, actual: 100, perHead: 0.67, unitType: "individual", sizeValue: "1" },
    ],
  },
  {
    id: "evt-009",
    eventType: "Parents Evening",
    attendance: 220,
    timeOfDay: "Evening",
    locationZone: "Seattle, USA",
    audienceNote: "Parents, guardians, and teaching staff",
    items: [
      { name: "Sandwich", planned: 260, actual: 195, perHead: 0.89, unitType: "individual", sizeValue: "1" },
      { name: "Coffee and Tea Service", planned: 280, actual: 245, perHead: 1.11, unitType: "volume", sizeValue: "250" },
      { name: "Brownies", planned: 220, actual: 170, perHead: 0.77, unitType: "individual", sizeValue: "1" },
      { name: "Cheese", planned: 12, actual: 8, perHead: 0.04, unitType: "weight", sizeValue: "2000" },
    ],
  },
  {
    id: "evt-010",
    eventType: "Custom Event",
    attendance: 300,
    timeOfDay: "Lunch",
    locationZone: "Miami, USA",
    audienceNote: "School community and families",
    items: [
      { name: "Pizza Slice", planned: 360, actual: 285, perHead: 0.95, unitType: "individual", sizeValue: "1" },
      { name: "Bottled Water and Juice", planned: 400, actual: 330, perHead: 1.10, unitType: "volume", sizeValue: "250" },
      { name: "Cupcake", planned: 320, actual: 255, perHead: 0.85, unitType: "individual", sizeValue: "1" },
      { name: "Fruit and Veggie Platter", planned: 20, actual: 14, perHead: 0.05, unitType: "weight", sizeValue: "2000" },
    ],
  },
];

// ─────────────────────────────────────────────
// LOCAL SUPPORT ROUTING REFERENCE DATA
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// HYPER-LOCAL RECOVERY REGISTRY & METABOLIC AGE-SCALING ENGINE
// Replaces static country filters with custom behavioral matching logic
// ─────────────────────────────────────────────────────────────

// 1. Consumption multipliers based on your insight that teens eat more than children/adults
const AGE_CONSUMPTION_MULTIPLIERS = {
  primary: 0.65,      // High physical plate waste, small individual capacity
  teens: 1.35,        // Peak metabolic demand, athletic consumption curve
  adults: 1.00,       // Standard baseline consumption benchmark
  mixed: 1.10         // Blended distribution model for community events
};

// 2. Local operational registry for recovery networks in Qatar
const CAMPUS_CHARITY_REGISTRY = [
  {
    name: "Hifz Al Naema Food Bank",
    desk: "Doha Central HQ / Industrial Area Logistics Hub",
    contact: "+974 4435 5555",
    acceptedTypes: ["perishable", "shelf-stable"],
    operatingHours: ["Lunch", "Afternoon", "Evening"],
    description: "Qatar's premier surplus food recovery network. Specializes in rapid cold-chain deployment to reclaim unserved buffet catering and hot meals directly from campus functions."
  },
  {
    name: "Qatar Charity (Tayf Program)",
    desk: "Doha Community Collection Network",
    contact: "+974 4466 7711",
    acceptedTypes: ["shelf-stable"],
    operatingHours: ["Morning", "Lunch", "Afternoon"],
    description: "Dedicated infrastructure focusing heavily on packaged, non-perishable goods. Best optimized for sealed juice boxes, dry snacks, and canned items remaining after day fairs."
  },
  {
    name: "Eid Charity Food Bank",
    desk: "Al Markhiya Regional Hub Terminal",
    contact: "+974 4040 5555",
    acceptedTypes: ["perishable", "shelf-stable"],
    operatingHours: ["Lunch", "Afternoon"],
    description: "Processes packaged individual portions, meals, sandwiches, and bakery surplus. Excellent for shifting food into local neighborhoods before late afternoon distribution windows close."
  }
];

function runIntelligentLogisticsMatching(itemsArray, timeOfDaySelected) {
  const hasPerishables = itemsArray.some(item => {
    const name = item.name.toLowerCase();
    return name.includes("sandwich") || name.includes("samosa") || name.includes("pizza") || 
           name.includes("pastry") || name.includes("fruit") || name.includes("chicken");
  });

  return CAMPUS_CHARITY_REGISTRY.map(charity => {
    let matchScore = 100;
    const diagnosticNotes = [];

    // Temporal Synchronization Check
    if (!charity.operatingHours.includes(timeOfDaySelected)) {
      matchScore -= 40;
      diagnosticNotes.push(`⚠️ Timing Alert: Your event concludes in the "${timeOfDaySelected}", but this hub's active distribution windows lean toward alternative day shifts.`);
    } else {
      diagnosticNotes.push(`✅ Temporal Sync: Intake desk is active during your "${timeOfDaySelected}" cleanup window.`);
    }

    // Asset Perishability Check
    if (hasPerishables && !charity.acceptedTypes.includes("perishable")) {
      matchScore -= 50;
      diagnosticNotes.push("❌ Asset Mismatch: Your surplus contains fresh cooked perishables, but this node exclusively accepts sealed dry packaging.");
    } else if (hasPerishables) {
      diagnosticNotes.push("✅ Cold-Chain Compliant: Equipped with active refrigeration controls to accept fresh entries.");
    }

    return {
      ...charity,
      matchScore: Math.max(10, matchScore),
      routingNotes: diagnosticNotes
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

// ─────────────────────────────────────────────
// LOCAL ENGINE WITH DETERMINISTIC CONTEXT BRANCHING
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// LOCAL ENGINE WITH DETERMINISTIC AGE-SCALING CONTEXT BRANCHING
// ─────────────────────────────────────────────────────────────
async function runLocalAnomalyDetection(formData, history) {
  // Destructure your new fields: attendeeAgeGroup and allergenAlerts
  const { eventType, attendance, timeOfDay, items, attendeeAgeGroup, allergenAlerts } = formData;

  const relevantHistory = history.filter((e) => e.eventType === eventType);
  const pool = relevantHistory.length >= 2 ? relevantHistory : history;

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

  const DEFAULT_RATIO = 0.65;
  const anomaliesDetected = [];
  const recommendedQuantities = [];
  
  let globalSurplusWeightKg = 0;
  let globalSurplusWaterLiters = 0;
  let globalPeopleFed = 0;

  // Extract metabolic scaling coefficient based on your new input rules
  const ageMultiplier = AGE_CONSUMPTION_MULTIPLIERS[attendeeAgeGroup] || 1.00;

  items.forEach((item) => {
    const key = item.name.toLowerCase().trim();
    // 1. Core Baseline Ratio pulled from historical databases
    const rawBaseline = ratioMap[key] ?? DEFAULT_RATIO;
    // 2. Adjust baseline based on age groups (e.g., teens consume more physical mass)
    const baseline = rawBaseline * ageMultiplier;

    const suggestedQty = Math.max(1, Math.round(baseline * attendance));
    const plannedQty = parseInt(item.qty, 10) || 0;
    const deviation = plannedQty > 0 ? ((plannedQty - suggestedQty) / suggestedQty) * 100 : 0;

    let status = "optimal";
    if (deviation > 30) status = "high-risk";
    else if (deviation > 10) status = "slight-over";

    if (deviation > 10) {
      anomaliesDetected.push({
        item: item.name,
        percentageOver: Math.round(deviation),
        reason: `Historical allocation estimates ${rawBaseline.toFixed(2)} units/head. Adjusted by ×${ageMultiplier} for "${attendeeAgeGroup}" profile. Your entry deviates by +${Math.round(deviation)}%.`,
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
      baselineUsed: baseline.toFixed(2),
      status,
      unitType: item.unitType,
      sizeValue: item.sizeValue,
    });
  });

  const isHighVolume = globalSurplusWeightKg > 15;
  
  // Call the intelligent registry system matching engine
  const targetSupport = runIntelligentLogisticsMatching(items, timeOfDay);
  
  const contingencyPlan = [];

  contingencyPlan.push(`[PRE-EVENT RE-CALIBRATION] Readjust supplier invoice targets directly to ${recommendedQuantities.map(r => `${r.suggestedQty}x ${r.item}`).join(", ")}.`);

  // Append safety allergen warning card to contingency array if checked
  if (allergenAlerts && allergenAlerts.length > 0) {
    contingencyPlan.push(`[⚠️ SAFETY GUARDRAIL] Logistics flagged with allergen groups: (${allergenAlerts.join(", ")}). Mark freight containers before handling dispatch cycles.`);
  }

  if (timeOfDay === "Morning" || timeOfDay === "Lunch") {
    if (isHighVolume) {
      contingencyPlan.push(`[IMMEDIATE TRANSIT] Divert leftovers immediately at closure to the Student Recreation Common Area for open buffet service during general high-school breaks.`);
      contingencyPlan.push(`[LOCAL LOGISTICS] Coordinate dispatch to ${targetSupport[0].name} (${targetSupport[0].contact}) for their midday lunch run distribution window.`);
    } else {
      contingencyPlan.push(`[FACILITY HOUSING] Cache remaining items inside the primary ground-floor staff kitchenette lounge for general staff consumption during administrative periods.`);
    }
  } else if (timeOfDay === "Afternoon") {
    contingencyPlan.push(`[ATHLETIC REDISTRIBUTION] Deliver leftovers directly to the athletic locker complex coordinators for late-stay track and field students or sports training teams.`);
    if (isHighVolume) {
      contingencyPlan.push(`[LOCAL SUPPORT ROUTING] Issue secondary alert notice to ${targetSupport[0].name} for standard afternoon service pickup.`);
    }
  } else { 
    if (isHighVolume) {
      contingencyPlan.push(`[CRITICAL OVERNIGHT PARADIGM] Campus cold facilities cannot hold bulk volume. Engage emergency dispatch to ${targetSupport.map(c => `${c.name} [${c.contact}]`).join(" OR ")} before late closure gates drop.`);
    } else {
      contingencyPlan.push(`[NIGHT SERVICE SUPPORT] Route the items to the facilities maintenance break control room to support overnight logistical shifts and campus safety personnel.`);
    }
  }
  
  contingencyPlan.push(`[DATA CALIBRATION LOOP] Access the interface dashboard tool tomorrow morning to record verified item usage numbers into local disk persistence storage.`);

  return {
    anomaliesDetected,
    recommendedQuantities,
    contingencyPlan,
    targetSupport,
    impactMetrics: {
      foodWasteKg: +globalSurplusWeightKg.toFixed(1),
      waterWasteL: +globalSurplusWaterLiters.toFixed(1),
      hungryPeopleFed: globalPeopleFed || Math.ceil(globalSurplusWeightKg * 2),
    },
  };
}

export default function App() {
  const LS_KEY = "ewscout_history_v2";

  const [eventHistory, setEventHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      return stored ? JSON.parse(stored) : SEED_HISTORY;
    } catch {
      return SEED_HISTORY;
    }
  });

  const [showThinkingPanel, setShowThinkingPanel] = useState(false);

// Look for your old "form" state variable configuration and replace it with this:
  const [form, setForm] = useState({
    eventType: "Parents Evening",
    attendance: "",
    timeOfDay: "Evening",
    attendeeAgeGroup: "adults", // Default choice index
    allergenAlerts: [],         // Array tracking your new safety checkboxes
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
    const localSavedHistory = localStorage.getItem("campus_event_history");
    if (localSavedHistory) {
      setEventHistory(JSON.parse(localSavedHistory));
    }
  }, []);

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

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
      setError("Please clarify target attendance and record item fields.");
      return;
    }

    setLoading(true);

    // Update this data map object right here:
    const formData = {
      eventType: form.eventType,
      attendance: parseInt(form.attendance, 10),
      timeOfDay: form.timeOfDay,
      attendeeAgeGroup: form.attendeeAgeGroup, // Passed down cleanly
      allergenAlerts: form.allergenAlerts,     // Passed down cleanly
      items: validItems,
    };

    // Local processing calculation execution
    await new Promise((r) => setTimeout(r, 700));
    const localCalculations = await runLocalAnomalyDetection(formData, eventHistory);
    setAuditResult({ ...localCalculations, formData, source: "local", rawThinking: `Deterministic Rule-based engine executed. Adjusted parameters for ${form.attendeeAgeGroup} profile multiplier models.` });
    setLoading(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // ─────────────────────────────────────────────
  // TELEMETRY REGISTRY DELETE HANDLER
  // ─────────────────────────────────────────────
  const handleDeleteEvent = (idToDelete) => {
    // Confirm via native browser window to prevent accidental drops
    if (window.confirm("CONFIRM ACTION: REMOVE THIS OPERATIONAL NODE REGISTER FROM STORAGE?")) {
      const updatedHistory = eventHistory.filter((evt) => evt.id !== idToDelete);
      setEventHistory(updatedHistory);
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
      // 🟢 UPDATED: Mapping your new personalized variables into the saved record
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

    // 🟢 COMMIT TO REACT STATE:
    const updatedHistory = [newRecord, ...eventHistory];
    setEventHistory(updatedHistory);

    // 🟢 COMMIT TO BROWSER STORAGE:
    localStorage.setItem("campus_event_history", JSON.stringify(updatedHistory));

    // Reset layout UI states
    setLogActuals({});
    setAuditResult(null);
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased border-8 border-zinc-900">
      
      <header className="border-b border-zinc-900 px-6 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 mt-2">
            EVENTWASTE SCOUT
          </h1>
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-tight mt-0.5">
            Event Food Waste Optimization Matrix
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-mono text-xs uppercase tracking-wider border border-zinc-900 bg-white px-3 py-2 font-bold">
            ◎ Engine: Local
          </div>

          <div className="flex bg-zinc-100 border border-zinc-900 p-0.5">
            {["audit", "history"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`font-mono text-xs uppercase tracking-wider px-4 py-1.5 transition-all ${
                  activeTab === t ? "bg-zinc-900 text-white font-bold" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {t === "audit" ? "Audit Console" : `Registry Database [${eventHistory.length}]`}
              </button>
            ))}
          </div>
        </div>
      </header>

      
      <main className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === "audit" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            
            <div className="lg:col-span-5 space-y-6">
              <div className="border-l-4 border-zinc-900 pl-4 py-1">
                <h2 className="text-xl font-bold uppercase tracking-tight">Food Waste Radar</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-zinc-500 block mb-1">Event Type / Class</label>
                  <select
                    value={form.eventType}
                    onChange={(e) => updateField("eventType", e.target.value)}
                    className="w-full bg-white border-2 border-zinc-900 p-3 text-sm font-medium focus:outline-none focus:bg-zinc-50"
                  >
                    {["Sports Day", "Science Fair", "Parents Evening", "Debate Tournament", "Custom Event"].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-xs uppercase tracking-wider text-zinc-500 block mb-1">Target Personnel Headcount</label>
                    <input
                      type="number"
                      min="1"
                      value={form.attendance}
                      onChange={(e) => updateField("attendance", e.target.value)}
                      placeholder="e.g. 150"
                      className="w-full bg-white border-2 border-zinc-900 p-3 text-sm font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs uppercase tracking-wider text-zinc-500 block mb-1">Time Window</label>
                    <select
                      value={form.timeOfDay}
                      onChange={(e) => updateField("timeOfDay", e.target.value)}
                      className="w-full bg-white border-2 border-zinc-900 p-3 text-sm focus:outline-none focus:bg-zinc-50"
                    >
                      {["Morning", "Lunch", "Afternoon", "Evening"].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* NEW AGE SELECTION DROPDOWN & ALLERGEN REGISTRY CARD CONTAINER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-xs uppercase tracking-wider text-zinc-500 block mb-1">
                      Attendee Age Profile
                    </label>
                    <select
                      value={form.attendeeAgeGroup}
                      onChange={(e) => updateField("attendeeAgeGroup", e.target.value)}
                      className="w-full bg-white border-2 border-zinc-900 p-3 text-sm font-medium focus:outline-none"
                    >
                      <option value="primary">Primary (Ages 5-11 // High Waste Index)</option>
                      <option value="teens">Teens (Ages 12-18 // High Caloric Demand)</option>
                      <option value="adults">Adults / Staff Members (Baseline Standard)</option>
                      <option value="mixed">Mixed Community Spread (Blended Family Model)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-mono text-xs uppercase tracking-wider text-zinc-500 block mb-1">
                      Containment Content Warning
                    </label>
                    <div className="border-2 border-zinc-900 p-2 bg-white flex flex-wrap gap-3 h-[46px] items-center px-3">
                      {["Nuts", "Dairy", "Gluten"].map((allergen) => {
                        const isChecked = form.allergenAlerts.includes(allergen);
                        return (
                          <label key={allergen} className="flex items-center gap-1.5 font-mono text-xs uppercase font-bold cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                const nextAllergens = isChecked
                                  ? form.allergenAlerts.filter((a) => a !== allergen)
                                  : [...form.allergenAlerts, allergen];
                                updateField("allergenAlerts", nextAllergens);
                              }}
                              className="accent-zinc-900 w-3.5 h-3.5 border-2 border-zinc-900"
                            />
                            {allergen}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="border border-zinc-900 p-4 bg-zinc-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-900 font-bold"> CATERING PROVISIONS </span>
                    <button
                      onClick={addItem}
                      className="font-mono text-xs uppercase tracking-wider bg-zinc-900 text-white px-2 py-1 hover:bg-zinc-800"
                    >
                      + Add Target Item
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                    {form.items.map((item, index) => (
                      <div key={item.id} className="border border-zinc-300 p-3 bg-white space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-zinc-400">#{index + 1}</span>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, "name", e.target.value)}
                            placeholder="Item description name"
                            className="flex-1 bg-white border border-zinc-900 p-1.5 text-xs focus:outline-none"
                          />
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                            placeholder="Qty"
                            className="w-16 bg-white border border-zinc-900 p-1.5 text-xs font-mono focus:outline-none"
                          />
                          {form.items.length > 1 && (
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-zinc-400 hover:text-zinc-900 font-bold px-1"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-dashed border-zinc-200">
                          <div>
                            <select
                              value={item.unitType}
                              onChange={(e) => updateItem(item.id, "unitType", e.target.value)}
                              className="w-full bg-zinc-50 border border-zinc-400 text-[11px] p-1 font-mono focus:outline-none"
                            >
                              {Object.entries(UNIT_TYPES).map(([k, val]) => (
                                <option key={k} value={k}>{val}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            {item.unitType === "volume" && (
                              <select
                                value={item.sizeValue}
                                onChange={(e) => updateItem(item.id, "sizeValue", e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-400 text-[11px] p-1 font-mono focus:outline-none"
                              >
                                {VOLUME_SIZES.map((sz) => (
                                  <option key={sz.value} value={sz.value}>{sz.label}</option>
                                ))}
                              </select>
                            )}
                            {item.unitType === "weight" && (
                              <select
                                value={item.sizeValue}
                                onChange={(e) => updateItem(item.id, "sizeValue", e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-400 text-[11px] p-1 font-mono focus:outline-none"
                              >
                                {WEIGHT_SIZES.map((sz) => (
                                  <option key={sz.value} value={sz.value}>{sz.label}</option>
                                ))}
                              </select>
                            )}
                            {item.unitType === "individual" && (
                              <div className="text-[11px] text-zinc-400 font-mono p-1 bg-zinc-50 border border-transparent">
                                Discrete Piece Standard
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-zinc-50 border-l-2 border-zinc-900 font-mono text-xs text-zinc-900">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  onClick={handleAudit}
                  disabled={loading}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 text-white font-bold uppercase tracking-wider py-4 text-xs transition-colors border-2 border-zinc-900"
                >
                  {loading ? "PROCESSING COMPLEX TELEMETRY MATRIX..." : "EXECUTE ECO-AUDIT MATRIX →"}
                </button>
              </div>
            </div>

            
            <div ref={resultsRef} className="lg:col-span-7 space-y-8">
              {auditResult ? (
                <div className="space-y-6">
                  
                  
                  <div className="flex flex-wrap items-center justify-between border-b border-zinc-900 pb-2">
                    <span className="font-mono text-xs uppercase tracking-wider bg-zinc-900 text-white px-2 py-0.5 font-bold">
                      Diagnostic Frame Matrix: {auditResult.source.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs text-zinc-500 uppercase">
                      Scope: {auditResult.formData.eventType} // {auditResult.formData.attendance} Node Targets
                    </span>
                  </div>

                  
                  <div className="border border-zinc-900 p-6 bg-zinc-50 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border-r border-zinc-300 md:pr-4">
                      <span className="font-mono text-xs uppercase text-zinc-400 block tracking-wider">Estimated Waste Mass</span>
                      <div className="text-3xl font-black font-mono text-zinc-950 mt-1">
                        {auditResult.impactMetrics?.foodWasteKg || 0} <span className="text-xs font-sans font-normal text-zinc-500">KG</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 block font-mono mt-1 uppercase">Physical load footprint</span>
                    </div>

                

                    <div className="md:pl-4">
                      <span className="font-mono text-xs uppercase text-zinc-400 block tracking-wider">Nutritional Capacity Loss</span>
                      <div className="text-3xl font-black font-mono text-zinc-950 mt-1">
                        {auditResult.impactMetrics?.hungryPeopleFed || 0} <span className="text-xs font-sans font-normal text-zinc-500">MEALS</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 block font-mono mt-1 uppercase">Sustained individual cycles</span>
                    </div>
                  </div>

                  
                  {auditResult.anomaliesDetected.length > 0 ? (
                    <div className="border border-zinc-900 p-5 bg-white">
                      <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-900 font-bold mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-zinc-950"></span>
                        Detected Supply Inefficiencies
                      </h3>
                      <div className="space-y-2">
                        {auditResult.anomaliesDetected.map((anom, idx) => (
                          <div key={idx} className="border-l-2 border-zinc-900 bg-zinc-50 p-3 flex justify-between items-start gap-4">
                            <div>
                              <div className="font-mono text-xs font-bold uppercase tracking-tight text-zinc-900">{anom.item}</div>
                              <p className="text-xs text-zinc-600 mt-1">{anom.reason}</p>
                            </div>
                            <span className="font-mono text-xs bg-zinc-900 text-white font-bold px-1.5 py-0.5">
                              +{anom.percentageOver}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="border border-zinc-900 p-4 bg-zinc-50 flex items-center gap-2 text-xs font-mono uppercase text-zinc-700">
                      <span>✓</span> Telemetry stable. Provisions remain locked within baseline optimization constraints.
                    </div>
                  )}

                  
                  {/* CALIBRATED ORDER MATRIX DISPLAY (RECOMMENDATION ENGINE VISIBILITY) */}
                  <div className="border border-zinc-900 bg-white">
                    <div className="p-4 border-b border-zinc-900 bg-zinc-50 font-mono text-xs uppercase tracking-wider font-bold text-zinc-900 flex justify-between">
                      <span>PROVISIONS MODIFICATION MATRIX</span>
                      <span className="text-zinc-400">ENGINE BASELINES SHOWN</span>
                    </div>
                    <div className="divide-y divide-zinc-200">
                      {auditResult.recommendedQuantities.map((rec, idx) => (
                        <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 ${rec.status === 'high-risk' ? 'bg-zinc-950' : 'bg-zinc-400'}`}></span>
                            <span className="font-bold text-zinc-900">{rec.item}</span>
                            <span className="font-mono text-[10px] text-zinc-400">({rec.baselineUsed}/head baseline)</span>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-6 font-mono">
                            <span className="text-zinc-400 line-through">{rec.plannedQty} Input</span>
                            <span className="font-bold text-zinc-900 text-sm">{rec.suggestedQty} Suggested</span>
                            <span className={`uppercase font-bold tracking-tight text-[10px] px-2 py-0.5 ${
                              rec.status === "high-risk" ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-600"
                            }`}>
                              {rec.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* REGIONAL CHARITY RESOURCE HUB CARD */}
                  <div className="border border-zinc-900 p-5 bg-zinc-50">
                    <span className="font-mono text-xs uppercase text-zinc-400 block tracking-wider mb-2">
                      Hyper-Local Operational Matching Matrix (Qatar Context)
                    </span>
                    <h4 className="font-bold text-sm uppercase tracking-tight mb-3">
                      Ranked Logistics Optimization Channels
                    </h4>
                    <div className="space-y-4">
                      {auditResult.targetSupport.map((support, i) => (
                        <div key={i} className="bg-white border-2 border-zinc-900 p-4 font-mono text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <div className="flex justify-between items-center border-b border-dashed border-zinc-300 pb-1.5 mb-2">
                            <div className="font-black text-sm text-zinc-900 uppercase">
                              #{i + 1} . {support.name}
                            </div>
                            <span className={`px-2 py-0.5 font-bold font-mono text-[10px] uppercase tracking-tight text-white ${
                              support.matchScore > 75 ? "bg-zinc-900" : "bg-zinc-500"
                            }`}>
                              Compatibility: {support.matchScore}%
                            </span>
                          </div>
                          <div className="text-zinc-600 font-sans text-xs mb-3 leading-relaxed">{support.description}</div>
                          <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-500 bg-zinc-50 p-2 border border-zinc-200">
                            <div>📞 CONTACT: {support.contact}</div>
                            <div>📍 HUB: {support.desk}</div>
                          </div>
                          <div className="mt-2.5 space-y-1 pt-2 border-t border-zinc-100">
                            {support.routingNotes.map((note, nIdx) => (
                              <div key={nIdx} className="text-[10px] text-zinc-700 tracking-tight font-sans">
                                {note}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border border-zinc-900 p-5 bg-white">
                    <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-900 font-bold mb-4 flex items-center gap-2">
                      ⚡ Local Campus Asset Redistribution Routing Matrix
                    </h3>
                    <div className="space-y-3">
                      {auditResult.contingencyPlan.map((step, idx) => (
                        <div key={idx} className="flex gap-3 text-xs items-start">
                          <span className="font-mono text-[10px] bg-zinc-100 border border-zinc-900 font-bold text-zinc-900 px-1 py-0.5">
                            STEP_{idx + 1}
                          </span>
                          <p className="text-zinc-700 leading-relaxed pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  
                  <div className="border border-zinc-900">
                    <button
                      onClick={() => setShowThinkingPanel(!showThinkingPanel)}
                      className="w-full text-left p-3 bg-zinc-900 text-white font-mono text-xs uppercase tracking-wider flex justify-between items-center"
                    >
                      <span>📑 System Reasoning Process Trace Layer</span>
                      <span>{showThinkingPanel ? "[-] Hide Matrix Log" : "[+] Reveal Log Output"}</span>
                    </button>
                    {showThinkingPanel && (
                      <div className="p-4 bg-zinc-50 border-t border-zinc-900 font-mono text-[11px] text-zinc-600 overflow-x-auto max-h-60 leading-relaxed">
                        <div className="uppercase font-bold text-zinc-900 mb-2">// TELEMETRY PROMPT DUMP ANALYSIS //</div>
                        <pre className="whitespace-pre-wrap">{auditResult.rawThinking || "Executing local analytical matrix parsing arrays without telemetry dependencies."}</pre>
                      </div>
                    )}
                  </div>

                  
                  <div className="border border-zinc-900 p-5 bg-zinc-50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-tight">Post-Event Consumption Register</h4>
                        <p className="font-mono text-xs text-zinc-500 mt-0.5">Feed active metric telemetry to override synthetic baseline thresholds.</p>
                      </div>
                      {saved && (
                        <span className="font-mono text-xs bg-zinc-950 text-white font-bold px-3 py-1">
                          MEMORIZED IN REGISTER
                        </span>
                      )}
                    </div>

                    {!saved && (
                      <div className="mt-4 space-y-3">
                        {auditResult.formData.items.map((item) => (
                          <div key={item.name} className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-2">
                            <span className="text-xs font-medium text-zinc-800">{item.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-[11px] text-zinc-400">Scheduled: {item.qty}</span>
                              <input
                                type="number"
                                min="0"
                                max={item.qty} // Set semantic browser input limit
                                placeholder="Actual pieces/vol"
                                value={logActuals[item.name] || ""}
                                onChange={(e) => {
                                  let val = parseInt(e.target.value, 10);
                                  const maxVal = parseInt(item.qty, 10);
                                  // If input value outstrips the planned quantity limit, snap it backward
                                  if (val > maxVal) val = maxVal;
                                  setLogActuals({ ...logActuals, [item.name]: isNaN(val) ? "" : val });
                                }}
                                className="w-28 bg-white border border-zinc-900 p-1 text-xs font-mono focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={handleSaveActuals}
                          className="w-full bg-white hover:bg-zinc-900 border-2 border-zinc-900 hover:text-white text-zinc-900 font-mono text-xs uppercase tracking-wider py-2 font-bold transition-all"
                        >
                          Commit Verification Metrics to Disk →
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="border-4 border-dashed border-zinc-300 p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                  <span className="font-mono text-xs uppercase text-zinc-400 tracking-widest block mb-2">TELEMETRY PANEL SLEEPING</span>
                  <p className="text-zinc-500 text-xs max-w-xs uppercase font-mono leading-relaxed">
                    Awaiting form submission matrix parameters on the left console panel node.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        
        {activeTab === "history" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">TELEMETRY REGISTRY DATABASE</h2>
              <p className="font-mono text-xs text-zinc-500 mt-0.5">
                Internal storage tracks {eventHistory.length} operational matrices for predictive modeling base calculations.
              </p>
            </div>

            <div className="space-y-4">
            {[...eventHistory].reverse().map((evt, idx) => (
              <div key={evt.id || idx} className="border-2 border-zinc-900 p-4 bg-white">
                
                {/* THIS ENTIRE CONTAINER BELOW IS WHAT GETS REPLACED */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-200 pb-2 mb-3 gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm uppercase tracking-tight">{evt.eventType}</span>
                    <span className="font-mono text-[10px] bg-zinc-900 text-white font-bold px-1.5 py-0.5 uppercase">
                      {evt.timeOfDay}
                    </span>
                    {evt.locationZone && (
                      <span className="font-mono text-[10px] border border-zinc-900 px-1.5 text-zinc-600">
                        {evt.locationZone}
                      </span>
                    )}
                  </div>
                  
                  {/* Here is the new flex container holding the ID and the delete button together */}
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-zinc-400">{evt.id || `historical-node-${idx}`}</span>
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="font-mono text-[10px] uppercase text-red-600 hover:bg-zinc-900 hover:text-white border border-red-200 hover:border-zinc-900 px-2 py-0.5 tracking-tight transition-all font-bold"
                    >
                      [✕ REMOVE REGISTRY]
                    </button>
                  </div>
                </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {evt.items.map((it, i) => (
                      <div key={i} className="bg-zinc-50 border border-zinc-200 p-2.5 font-mono">
                        <div className="text-[11px] text-zinc-400 uppercase truncate">{it.name}</div>
                        <div className="text-sm font-bold text-zinc-900 mt-1">
                          {it.actual !== undefined ? it.actual : "Unknown"} / <span className="text-zinc-400">{it.planned}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5"> Ratio: {it.perHead ? it.perHead.toFixed(2) : "0.00"}/head</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      
      <footer className="border-t border-zinc-900 mt-20 px-6 py-6 text-center font-mono text-xs text-zinc-400 uppercase tracking-tight bg-white">
        EventWaste Scout // Made for USAII Hackathon // High School Track
      </footer>
    </div>
  );
}