import { rad, deg } from './Units';

const J2000 = 2451545.0;

export function sphericalToCartesian(ra, dec, dist) {
  // See http://www.stargazing.net/kepler/rectang.html
  return [
    dist * Math.cos(ra) * Math.cos(dec),
    dist * Math.sin(ra) * Math.cos(dec),
    dist * Math.sin(dec),
  ];
}

export function equatorialToEcliptic_Cartesian(x, y, z, jd = J2000) {
  const obliquity = getObliquity(jd);

  return [
    x,
    Math.cos(obliquity) * y + Math.sin(obliquity) * z,
    -Math.sin(obliquity) * y + Math.cos(obliquity) * z,
  ];
}

/**
 * Get Earth's obliquity and nutation at a given date.
 * @param {Number} jd JD date
 * @return {Object} Object with attributes "obliquity" and "nutation" provided
 * in radians
 */
export function getNutationAndObliquity(jd = J2000) {
  const t = (jd - J2000) / 36525;
  const omega = rad(125.04452 - 1934.136261 * t + 0.0020708 * t * t + (t * t + t) / 450000);
  const Lsun = rad(280.4665 + 36000.7698 * t);
  const Lmoon = rad(218.3165 + 481267.8813 * t);

  const nutation = (-17.20 / 3600) * Math.sin(omega) - (-1.32 / 3600) * Math.sin(2 * Lsun) - (0.23 / 3600) * Math.sin(2 * Lmoon) + deg((0.21 / 3600) * Math.sin(2 * omega));

  const obliquity_zero = 23 + 26.0 / 60 + 21.448 / 3600 - (46.8150 / 3600) * t - (0.00059 / 3600) * t * t + (0.001813 / 3600) * t * t * t;
  const obliquity_delta = (9.20 / 3600) * Math.cos(omega) + (0.57 / 3600) * Math.cos(2 * Lsun) + (0.10 / 3600) * Math.cos(2 * Lmoon) - (0.09 / 3600) * Math.cos(2 * omega);
  const obliquity = obliquity_zero + obliquity_delta;

  return {
    nutation: rad(nutation),
    obliquity: rad(obliquity),
  };
}

/**
 * Get Earth's obliquity at a given date.
 * @param {Number} jd JD date
 * @return {Number} Obliquity in radians
 */
export function getObliquity(jd = J2000) {
  return getNutationAndObliquity(jd).obliquity;
}
