/**
 * Record persistence wrapper using localStorage.
 * Falls back gracefully in private browsing mode.
 */
export function getRecord() {
  try {
    const saved = localStorage.getItem('snake-record');
    if (saved) return parseInt(saved, 10) || 0;
  } catch {
    // Ignore private-browsing / storage-disabled errors
  }
  return 0;
}

export function setRecord(score) {
  try {
    const current = getRecord();
    if (score > current) {
      localStorage.setItem('snake-record', String(score));
    }
  } catch {
    // Ignore private-browsing / storage-disabled errors
  }
}
