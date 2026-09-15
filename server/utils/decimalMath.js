/**
 * Crypto Compass — Precise Decimal Arithmetic Utility (Phase 9)
 *
 * Implements strict fixed-point arithmetic using JavaScript BigInt at 8 decimal places
 * (satoshi-level precision, 10^8) to completely eliminate JavaScript floating-point errors
 * in crypto holding and order valuation calculations.
 */

const CRYPTO_DECIMALS = 8n;
const SCALE_FACTOR = 100000000n; // 10^8
const HALF_SCALE = 50_000_000n;

/**
 * Parses a market price (number or string) into exact integer cents (BigInt)
 * without using floating-point multiplication (i.e. NO Math.round(price * 100)).
 *
 * Examples:
 *   77673.45   -> 7767345n
 *   77673.456  -> 7767346n (rounds half-up at sub-cent digit via integer logic)
 *   0.05       -> 5n
 *   "0.00001"  -> 0n (sub-cent)
 *
 * @param {number|string} price
 * @returns {bigint} executionPriceCents as BigInt
 */
function parsePriceToCents(price) {
  if (price === null || price === undefined) {
    throw new Error('Price is required.');
  }

  let str = typeof price === 'string' ? price.trim() : price.toString().trim();

  // Expand scientific notation without floating point if present
  if (str.includes('e') || str.includes('E')) {
    const [coeff, expStr] = str.toLowerCase().split('e');
    const exp = parseInt(expStr, 10);
    const coeffParts = coeff.split('.');
    const wholePart = coeffParts[0];
    const fracPart = coeffParts[1] || '';
    if (exp > 0) {
      if (fracPart.length <= exp) {
        str = wholePart + fracPart.padEnd(exp, '0');
      } else {
        str = wholePart + fracPart.slice(0, exp) + '.' + fracPart.slice(exp);
      }
    } else {
      const absExp = Math.abs(exp);
      str = '0.' + '0'.repeat(absExp - 1) + wholePart.replace('-', '') + fracPart;
    }
  }

  if (!/^-?\d+(\.\d+)?$/.test(str)) {
    throw new Error('Price must be a valid numeric representation.');
  }

  if (str.startsWith('-')) {
    throw new Error('Price cannot be negative.');
  }

  const parts = str.split('.');
  const wholePart = parts[0] || '0';
  const fracPart = parts[1] || '';

  const wholeCents = BigInt(wholePart) * 100n;
  const first2 = fracPart.padEnd(2, '0').slice(0, 2);
  let cents = wholeCents + BigInt(first2);

  // If 3rd fractional digit exists and is >= 5, round half-up by 1 cent
  if (fracPart.length >= 3 && fracPart.charCodeAt(2) >= 53 /* ASCII '5' */) {
    cents += 1n;
  }

  return cents;
}

/**
 * Parse any crypto quantity representation (string, Decimal128, etc.)
 * into an exact BigInt representing base units (10^-8).
 *
 * @param {string|Object} rawQty
 * @returns {bigint}
 */
function parseCryptoToUnits(rawQty) {
  if (rawQty === null || rawQty === undefined) {
    throw new Error('Quantity is required.');
  }

  let str = typeof rawQty === 'string' ? rawQty.trim() : rawQty.toString().trim();

  if (!str || str === 'NaN' || str === 'Infinity' || str === '-Infinity') {
    throw new Error('Quantity must be a valid numeric value.');
  }

  // Normalize scientific notation (e.g. Decimal128 "1E-8" -> "0.00000001")
  if (str.includes('e') || str.includes('E')) {
    const [coeff, expStr] = str.toLowerCase().split('e');
    const exp = parseInt(expStr, 10);
    const coeffParts = coeff.split('.');
    let wholePart = coeffParts[0];
    let fracPart = coeffParts[1] || '';
    if (exp > 0) {
      if (fracPart.length <= exp) {
        str = wholePart + fracPart.padEnd(exp, '0');
      } else {
        str = wholePart + fracPart.slice(0, exp) + '.' + fracPart.slice(exp);
      }
    } else {
      const absExp = Math.abs(exp);
      str = '0.' + '0'.repeat(absExp - 1) + wholePart.replace('-', '') + fracPart;
    }
  }

  // Strict regex: positive decimal with up to 8 decimal places
  if (!/^\d+(\.\d{1,8})?$/.test(str)) {
    throw new Error('Quantity must be a positive number with at most 8 decimal places.');
  }

  const parts = str.split('.');
  const wholeStr = parts[0];
  const fracStr = (parts[1] || '').padEnd(8, '0');

  const whole = BigInt(wholeStr);
  const frac = BigInt(fracStr);
  const units = whole * SCALE_FACTOR + frac;

  if (units <= 0n) {
    throw new Error('Quantity must be greater than zero.');
  }

  return units;
}

/**
 * Convert BigInt base units (10^8) to an exact, normalized decimal string.
 * e.g. 1000000n -> "0.01", 100000000n -> "1"
 *
 * @param {bigint} units
 * @returns {string}
 */
function unitsToCryptoString(units) {
  if (typeof units !== 'bigint') {
    throw new Error('Units must be a BigInt.');
  }

  if (units < 0n) {
    throw new Error('Units cannot be negative.');
  }

  const whole = units / SCALE_FACTOR;
  const frac = units % SCALE_FACTOR;

  if (frac === 0n) {
    return whole.toString();
  }

  // Pad to 8 digits and strip trailing zeros
  const fracStr = frac.toString().padStart(8, '0').replace(/0+$/, '');
  return `${whole.toString()}.${fracStr}`;
}

/**
 * Calculates gross order value in integer cents entirely using BigInt.
 * grossValueCents = (quantityBaseUnits * executionPriceCents + 50_000_000n) / 100_000_000n
 *
 * @param {bigint} qtyUnits - Quantity in 10^-8 base units
 * @param {bigint|number|string} executionPriceCents - Authoritative price in integer cents
 * @returns {bigint} Gross order value as BigInt cents
 */
function calculateGrossValueCents(qtyUnits, executionPriceCents) {
  const priceBig = typeof executionPriceCents === 'bigint'
    ? executionPriceCents
    : BigInt(executionPriceCents.toString().split('.')[0]);

  const grossValueCents = (qtyUnits * priceBig + HALF_SCALE) / SCALE_FACTOR;
  return grossValueCents;
}

/**
 * Recalculates weighted average buy price in integer cents for BUY orders entirely using BigInt.
 * NewAvg = ((OldUnits * OldAvg) + (NewUnits * NewPrice) + (TotalUnits / 2n)) / TotalUnits
 *
 * @param {bigint} oldUnits
 * @param {bigint|number|string} oldAvgCents
 * @param {bigint} newUnits
 * @param {bigint|number|string} newPriceCents
 * @returns {bigint} Weighted average price as BigInt cents
 */
function calculateWeightedAverageCents(oldUnits, oldAvgCents, newUnits, newPriceCents) {
  const oldAvgBig = typeof oldAvgCents === 'bigint'
    ? oldAvgCents
    : BigInt(oldAvgCents.toString().split('.')[0]);
  const newPriceBig = typeof newPriceCents === 'bigint'
    ? newPriceCents
    : BigInt(newPriceCents.toString().split('.')[0]);

  const totalUnits = oldUnits + newUnits;
  if (totalUnits === 0n) return 0n;

  const totalCost = oldUnits * oldAvgBig + newUnits * newPriceBig;
  const roundedAvg = (totalCost + totalUnits / 2n) / totalUnits;

  return roundedAvg;
}

module.exports = {
  SCALE_FACTOR,
  HALF_SCALE,
  parsePriceToCents,
  parseCryptoToUnits,
  unitsToCryptoString,
  calculateGrossValueCents,
  calculateWeightedAverageCents,
};
