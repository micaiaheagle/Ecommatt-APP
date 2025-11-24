
export const STORAGE_KEYS = {
  PIGS: 'ECOMATT_PIGS_DB',
  USERS: 'ECOMATT_USERS_DB',
  TASKS: 'ECOMATT_TASKS_DB',
  FEEDS: 'ECOMATT_FEEDS_DB',
  HEALTH: 'ECOMATT_HEALTH_DB',
  FINANCE: 'ECOMATT_FINANCE_DB'
};

// Generic Load Function
export const loadData = <T>(key: string, defaultData: T): T => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultData;
    }
    return JSON.parse(serializedData);
  } catch (err) {
    console.error(`Error loading data for key ${key}`, err);
    return defaultData;
  }
};

// Generic Save Function
export const saveData = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (err) {
    console.error(`Error saving data for key ${key}`, err);
  }
};

// Helper to clear data (Factory Reset)
export const clearAllData = () => {
  localStorage.clear();
  window.location.reload();
};
