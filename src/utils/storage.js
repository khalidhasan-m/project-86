const STORAGE_KEY = "verification-records";

function readRecords() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    const records = value ? JSON.parse(value) : [];
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

export function getRecords() {
  return readRecords();
}

export function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function createSlug(holderName, referenceNo) {
  const base = `${holderName}-${referenceNo}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56) || "record";
  const uniquePart =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${base}-${uniquePart}`;
}

export function addRecord({ holderName, referenceNo, amount, issueDate }) {
  const record = {
    slug: createSlug(holderName, referenceNo),
    holderName: holderName.trim(),
    referenceNo: referenceNo.trim(),
    amount: amount.trim(),
    issueDate,
    createdAt: new Date().toISOString(),
  };

  saveRecords([...readRecords(), record]);
  return record;
}

export function deleteRecord(slug) {
  const records = readRecords().filter((record) => record.slug !== slug);
  saveRecords(records);
}

export function getRecordBySlug(slug) {
  return readRecords().find((record) => record.slug === slug) ?? null;
}
