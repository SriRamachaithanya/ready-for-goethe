const STORAGE_KEY = 'globio_exam_ready_last_result';
const NAME_KEY = 'globio_exam_ready_passenger_name';

/**
 * Safely saves the quiz result to localStorage
 * @param {object} resultData 
 */
export function saveLastResult(resultData) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resultData));
    }
  } catch (err) {
    console.warn('LocalStorage unavailable or quota exceeded:', err);
  }
}

/**
 * Safely loads the last quiz result
 * @returns {object|null}
 */
export function loadLastResult() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    }
  } catch (err) {
    console.warn('Failed to load from LocalStorage:', err);
  }
  return null;
}

/**
 * Safely saves passenger name
 */
export function savePassengerName(name) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (name) {
        window.localStorage.setItem(NAME_KEY, name);
      } else {
        window.localStorage.removeItem(NAME_KEY);
      }
    }
  } catch {
    // ignore storage restrictions
  }
}

/**
 * Safely loads saved passenger name
 */
export function loadPassengerName() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(NAME_KEY) || '';
    }
  } catch {
    return '';
  }
  return '';
}
