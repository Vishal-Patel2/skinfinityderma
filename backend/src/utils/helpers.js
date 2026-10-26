const config = require('../config/env');

const pad = (n) => String(n).padStart(2, '0');

/** Date -> 'YYYY-MM-DD' in server local time. */
function ymd(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Date -> 'YYYY-MM-DD HH:MM:SS' in server local time (MySQL DATETIME). */
function mysqlDateTime(d = new Date()) {
  return `${ymd(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Strip HTML tags / control chars and clamp length — for public form input. */
function cleanText(value, max = 255) {
  if (value === undefined || value === null) return null;
  const s = String(value)
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max);
  return s === '' ? null : s;
}

/** Digits (and a leading +) only. */
function cleanPhone(value) {
  if (!value) return null;
  const s = String(value).trim();
  const plus = s.startsWith('+') ? '+' : '';
  const digits = s.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 ? plus + digits : null;
}

function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/** Recursively turns '/uploads/...' strings into absolute URLs (for the public website). */
function absolutizeUploads(value) {
  if (typeof value === 'string') {
    return value.startsWith('/uploads/') ? config.publicBaseUrl + value : value;
  }
  if (Array.isArray(value)) return value.map(absolutizeUploads);
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = absolutizeUploads(v);
    return out;
  }
  return value;
}

/** '₹1,69,999' style formatting (Indian grouping). */
function inr(amount) {
  if (amount === null || amount === undefined || amount === '' || Number.isNaN(Number(amount))) return '';
  return '₹' + Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function parseJson(value, fallback = null) {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    return fallback;
  }
}

module.exports = { ymd, mysqlDateTime, cleanText, cleanPhone, isEmail, absolutizeUploads, inr, parseJson };
