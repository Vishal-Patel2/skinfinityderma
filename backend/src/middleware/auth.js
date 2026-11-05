const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { query, one } = require('../config/db');
const { HttpError, asyncHandler } = require('./error');

const CACHE_TTL_MS = 15 * 1000;
const cache = new Map(); // userId -> { at, user }

/** Drop cached users (call after role / permission / user changes). */
function clearAuthCache(userId) {
  if (userId) cache.delete(Number(userId));
  else cache.clear();
}

async function loadUser(id) {
  const hit = cache.get(id);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.user;

  const user = await one(
    `SELECT u.id, u.name, u.email, u.phone, u.avatar, u.status, u.token_version, u.role_id,
            r.slug AS role_slug, r.name AS role_name
       FROM sid_users u JOIN sid_roles r ON r.id = u.role_id WHERE u.id = ?`,
    [id]
  );
  if (!user) return null;

  user.isSuperAdmin = user.role_slug === 'super_admin';
  const rows = user.isSuperAdmin
    ? await query('SELECT code FROM sid_permissions')
    : await query(
        `SELECT p.code FROM sid_role_permissions rp JOIN sid_permissions p ON p.id = rp.permission_id WHERE rp.role_id = ?`,
        [user.role_id]
      );
  user.permissions = rows.map((r) => r.code);
  cache.set(id, { at: Date.now(), user });
  return user;
}

function signToken(user) {
  return jwt.sign({ sub: user.id, tv: user.token_version, type: 'staff' }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

function signPatientToken(patient) {
  return jwt.sign(
    { sub: patient.id, type: 'patient', phone: patient.phone, email: patient.email },
    config.jwt.secret,
    { expiresIn: '30d' }
  );
}

/** Requires a valid Bearer token for registered patients; attaches `req.patient` and `req.patientId`. */
const authenticatePatient = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new HttpError(401, 'Please sign in or create an account to continue.');

  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret);
  } catch (e) {
    throw new HttpError(401, e.name === 'TokenExpiredError' ? 'Session expired, please sign in again' : 'Invalid authentication session');
  }

  // Support patient token
  const patientId = Number(payload.sub);
  if (!patientId || isNaN(patientId)) throw new HttpError(401, 'Invalid patient session');

  const patient = await one(
    `SELECT p.*, c.title AS preferred_clinic_name 
       FROM sid_patients p 
       LEFT JOIN sid_clinics c ON c.id = p.preferred_clinic_id
      WHERE p.id = ?`,
    [patientId]
  );

  if (!patient || patient.status === 'Blocked') {
    throw new HttpError(401, 'Patient account is inactive or blocked. Please contact clinic support.');
  }

  req.patient = patient;
  req.patientId = patient.id;
  next();
});

/** Optional patient authentication: attaches req.patient if present, without blocking guests */
const optionalPatient = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    const patientId = Number(payload.sub);
    if (patientId) {
      const patient = await one('SELECT * FROM sid_patients WHERE id = ? AND status != "Blocked"', [patientId]);
      if (patient) {
        req.patient = patient;
        req.patientId = patient.id;
      }
    }
  } catch (e) {
    // Ignore invalid optional tokens
  }
  next();
});

/** Requires a valid Bearer token; attaches `req.user` (with `permissions`). */
const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new HttpError(401, 'Authentication required');

  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret);
  } catch (e) {
    throw new HttpError(401, e.name === 'TokenExpiredError' ? 'Session expired, please sign in again' : 'Invalid token');
  }

  const user = await loadUser(Number(payload.sub));
  if (!user || user.status !== 'active') throw new HttpError(401, 'Account is disabled or no longer exists');
  if (user.token_version !== payload.tv) throw new HttpError(401, 'Session is no longer valid, please sign in again');

  req.user = user;
  next();
});

const can = (user, code) => !!user && (user.isSuperAdmin || user.permissions.includes(code));

/** Allows the request when the user holds ANY of the given permission codes. */
const requirePermission = (...codes) => (req, res, next) => {
  const evaluate = () => {
    if (!req.user) return next(new HttpError(401, 'Authentication required'));
    if (codes.some((c) => can(req.user, c))) return next();
    return next(new HttpError(403, `You do not have permission to perform this action (${codes.join(' or ')})`));
  };

  if (!req.user) {
    return authenticate(req, res, (err) => {
      if (err) return next(err);
      evaluate();
    });
  }
  evaluate();
};

module.exports = {
  authenticate,
  authenticatePatient,
  optionalPatient,
  requirePermission,
  can,
  signToken,
  signPatientToken,
  clearAuthCache,
  loadUser,
};
