// Auth system — loads valid codes from codes.json at runtime.
// Generated codes are stored locally so the admin can update the list.

const STORAGE_KEY_USER = 'snake-auth-code';
const STORAGE_KEY_ADMIN = 'snake-admin-codes';

/** Set of valid codes — populated from codes.json + admin localStorage. */
let VALID_CODES = new Set();

/** Whether codes have been loaded. */
let _loaded = false;

/**
 * Load codes from the JSON file. Must be called once before isValid/isAuthenticated.
 * Also merges in any locally-generated admin codes.
 */
export async function loadCodes() {
  try {
    const resp = await fetch('./codes.json', { cache: 'no-cache' });
    if (resp.ok) {
      const list = await resp.json();
      for (const c of list) VALID_CODES.add(c.toUpperCase().trim());
    }
  } catch {
    // Offline — use whatever we already have
  }

  // Merge admin-generated codes from localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN);
    if (raw) {
      const extra = JSON.parse(raw);
      for (const c of extra) VALID_CODES.add(c.toUpperCase().trim());
    }
  } catch {
    // ignore
  }

  _loaded = true;
}

/** Check if a code is valid. */
export function isValid(code) {
  if (!code) return false;
  return VALID_CODES.has(code.toUpperCase().trim());
}

/** Save authenticated code to user's localStorage. */
export function saveCode(code) {
  try {
    localStorage.setItem(STORAGE_KEY_USER, code.toUpperCase().trim());
  } catch {
    // ignore
  }
}

/** Returns true if the user already entered a valid code on this device. */
export function isAuthenticated() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    return saved && VALID_CODES.has(saved);
  } catch {
    return false;
  }
}

/** Log out — clears the saved code. */
export function logout() {
  try {
    localStorage.removeItem(STORAGE_KEY_USER);
  } catch {
    // ignore
  }
}

// --- Admin helpers (used by admin.html) ---

/** Add a locally-generated code to the admin store (survives refresh). */
export function addAdminCode(code) {
  const key = code.toUpperCase().trim();
  VALID_CODES.add(key);
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN);
    const list = raw ? JSON.parse(raw) : [];
    if (!list.includes(key)) {
      list.push(key);
      localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(list));
    }
  } catch {
    // ignore
  }
}

/** Get all locally-generated codes. */
export function getAdminCodes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
