// --- Hjelpefunksjoner for Datoer ---
// Dette er de samme funksjonene som ble brukt i HTML-versjonen, tilpasset React Native.

/**
 * Henter mandagen i uken for en gitt dato.
 * @param {Date} d - Datoen å finne mandagen for.
 * @returns {Date} En ny datoobjekt som representerer mandagen i uken.
 */
export function getMonday(d) {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

/**
 * Legger til et gitt antall uker til en dato.
 * @param {Date} date - Startdatoen.
 * @param {number} weeks - Antall uker å legge til.
 * @returns {Date} En ny datoobjekt etter å ha lagt til ukene.
 */
export function addWeeks(date, weeks) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + weeks * 7);
  return newDate;
}

/**
 * Henter ISO-ukenr for en gitt dato.
 * @param {Date} d - Datoen.
 * @returns {number} Ukenummeret.
 */
export function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}

/**
 * Formaterer en dato til DD.MM.YYYY streng.
 * @param {Date} date - Datoen som skal formateres.
 * @returns {string} Den formaterte datostrengen.
 */
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Parser en DD.MM.YYYY streng til et Date-objekt.
 * @param {string} dateString - Dato-strengen i DD.MM.YYYY format.
 * @returns {Date | null} Det parserte Date-objektet eller null hvis ugyldig.
 */
export function parseDate(dateString) {
  if (!dateString) return null;
  const parts = dateString.split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
      return date;
    }
  }
  return null;
}