// ============================================================
//  storage.js — localStorage helpers
// ============================================================

const PATIENTS_KEY  = 'clinic_patients';
const TOKEN_KEY     = 'clinic_last_token';
const SERVING_KEY   = 'clinic_serving_token';
const SETTINGS_KEY  = 'clinic_pdf_settings';

// ─── Appointment time slots ───────────────────────────────────
export const TIME_SLOTS = [
  '09:00 AM','09:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','12:00 PM','12:30 PM',
  '02:00 PM','02:30 PM','03:00 PM','03:30 PM',
  '04:00 PM','04:30 PM','05:00 PM','05:30 PM',
  '06:00 PM',
];

// ─── Default PDF settings ────────────────────────────────────
export const DEFAULT_SETTINGS = {
  clinicName:    "Dr. Bhukar's Clinic",
  specialty:     "ENT, Cancer & Cochlear Implant",
  address:       "123 Medical Lane, City – 000000",
  phone:         "+91 98765 43210",
  footerMessage: "Please wait for your turn. Thank you for your patience.",
};

// ─── Patients ────────────────────────────────────────────────
export const getPatients = () => {
  try {
    const raw = localStorage.getItem(PATIENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const savePatients = (patients) => {
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
};

// ─── Token generation (daily reset) ──────────────────────────
export const getNextToken = () => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      if (stored && stored.date === today) {
        const next = stored.last + 1;
        localStorage.setItem(TOKEN_KEY, JSON.stringify({ last: next, date: today }));
        return String(next).padStart(3, '0');
      }
    }
  } catch { /* fall through */ }
  // First token of the day
  localStorage.setItem(TOKEN_KEY, JSON.stringify({ last: 1, date: today }));
  return '001';
};

// ─── Serving token ────────────────────────────────────────────
export const getServingToken = () => {
  return localStorage.getItem(SERVING_KEY) || null;
};

export const setServingToken = (token) => {
  if (token === null) {
    localStorage.removeItem(SERVING_KEY);
  } else {
    localStorage.setItem(SERVING_KEY, String(token));
  }
};

// ─── PDF Settings ─────────────────────────────────────────────
export const getPDFSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

export const savePDFSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
