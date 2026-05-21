// Auth system — code validation via simple checksum.
//
// Codes follow the pattern:  SNAKE-XXXXXXC
//   XXXXXX = 6 random chars from a 32-char alphabet (no I, O, 0, 1)
//   C      = checksum char (sum of the 6 char positions mod 32)
//
// Samu's admin panel generates valid codes. The game validates independently
// — no central list needed. Each buyer gets their own unique code.
//
// Codes in codes.json are pre-generated and always valid (they already
// contain correct checksums).

const STORAGE_KEY_USER = 'snake-auth-code';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 32 chars

/** Compute the checksum character for a 6-char body. */
function checksumChar(body) {
  let sum = 0;
  for (const ch of body) {
    sum += ALPHABET.indexOf(ch);
  }
  return ALPHABET[sum % ALPHABET.length];
}

/** Check if a full code (body + checksum) is valid. */
function validChecksum(code) {
  if (code.length !== 13) return false;           // "SNAKE-" + 6 chars + 1 checksum
  if (!code.startsWith('SNAKE-')) return false;
  const body = code.slice(6, 12);
  const actual = code[12];
  const expected = checksumChar(body);
  return actual === expected;
}

/** Generate a random valid code. */
export function generateCode() {
  let body = '';
  for (let i = 0; i < 6; i++) {
    body += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  const check = checksumChar(body);
  return 'SNAKE-' + body + check;
}

/** Check if a code is valid (checksum-based). */
export function isValid(code) {
  if (!code) return false;
  return validChecksum(code.toUpperCase().trim());
}

/** Save authenticated code to user's localStorage. */
export function saveCode(code) {
  try {
    localStorage.setItem(STORAGE_KEY_USER, code.toUpperCase().trim());
  } catch { /* ignore */ }
}

/** Returns true if the user already entered a valid code on this device. */
export function isAuthenticated() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    return saved && validChecksum(saved);
  } catch {
    return false;
  }
}

/** Log out — clears the saved code. */
export function logout() {
  try { localStorage.removeItem(STORAGE_KEY_USER); } catch { /* ignore */ }
}

/** No-op — kept for backward compat. Codes are validated via checksum now. */
export async function loadCodes() {}

// --- Admin helpers (used by admin.html) ---

const STORAGE_KEY_ADMIN = 'snake-admin-codes';

/** Save a generated code to the admin list (localStorage on Samu's machine only). */
export function addAdminCode(code) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN);
    const list = raw ? JSON.parse(raw) : [];
    const entry = { code, date: new Date().toISOString().slice(0, 10) };
    list.unshift(entry);
    // Keep last 200 max
    if (list.length > 200) list.length = 200;
    localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(list));
  } catch { /* ignore */ }
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
