import { LOCALSTORAGE_PATH } from "../constants/constants";

  
  /**
   * LocalStorage Manager for importing and exporting data
   */
  class LocalStorageManager {
    constructor(keys = LOCALSTORAGE_PATH) {
      this.keys = keys;
    }
  
    /**
     * Export all localStorage data to a JSON object
     * @returns {Object} Object containing all localStorage data
     */
    exportData() {
      const exportData = {};
      
      Object.entries(this.keys).forEach(([keyName, storageKey]) => {
        try {
          const value = localStorage.getItem(storageKey);
          if (value !== null) {
            // Try to parse JSON, fallback to string if not valid JSON
            try {
              exportData[keyName] = JSON.parse(value);
            } catch {
              exportData[keyName] = value;
            }
          } else {
            exportData[keyName] = null;
          }
        } catch (error) {
          console.warn(`Failed to export ${keyName}:`, error);
          exportData[keyName] = null;
        }
      });
  
      return exportData;
    }
  
    /**
     * Export localStorage data as a downloadable JSON file
     * @param {string} filename - Name of the file to download
     */
    exportToFile(filename = 'localstorage-backup.json') {
      const data = this.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  
    /**
     * Import data into localStorage
     * @param {Object} data - Data object to import
     * @param {boolean} overwrite - Whether to overwrite existing values
     * @returns {Object} Import results with success/failure counts
     */
    importData(data, overwrite = true) {
      const results = {
        success: 0,
        failed: 0,
        skipped: 0,
        errors: []
      };
  
      Object.entries(data).forEach(([keyName, value]) => {
        const storageKey = this.keys[keyName];
        
        if (!storageKey) {
          results.failed++;
          results.errors.push(`Unknown key: ${keyName}`);
          return;
        }
  
        try {
          const existingValue = localStorage.getItem(storageKey);
          
          if (existingValue !== null && !overwrite) {
            results.skipped++;
            return;
          }
  
          const valueToStore = typeof value === 'object' && value !== null
            ? JSON.stringify(value)
            : String(value);
            
          localStorage.setItem(storageKey, valueToStore);
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push(`Failed to import ${keyName}: ${error.message}`);
        }
      });
  
      return results;
    }
  
    /**
     * Import data from a JSON file
     * @param {File} file - File object to import from
     * @param {boolean} overwrite - Whether to overwrite existing values
     * @returns {Promise<Object>} Import results
     */
    async importFromFile(file, overwrite = true) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            const results = this.importData(data, overwrite);
            resolve(results);
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error.message}`));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        
        reader.readAsText(file);
      });
    }
  
    /**
     * Clear specific localStorage items
     * @param {string[]} keyNames - Array of key names to clear
     * @returns {number} Number of items cleared
     */
    clearItems(keyNames = []) {
      let cleared = 0;
      const keysToClear = keyNames.length > 0 ? keyNames : Object.keys(this.keys);
      
      keysTolear.forEach(keyName => {
        const storageKey = this.keys[keyName];
        if (storageKey && localStorage.getItem(storageKey) !== null) {
          localStorage.removeItem(storageKey);
          cleared++;
        }
      });
      
      return cleared;
    }
  
    /**
     * Get a specific value from localStorage
     * @param {string} keyName - Key name to retrieve
     * @returns {any} Parsed value or null if not found
     */
    getValue(keyName) {
      const storageKey = this.keys[keyName];
      if (!storageKey) return null;
      
      const value = localStorage.getItem(storageKey);
      if (value === null) return null;
      
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
  
    /**
     * Set a specific value in localStorage
     * @param {string} keyName - Key name to set
     * @param {any} value - Value to store
     */
    setValue(keyName, value) {
      const storageKey = this.keys[keyName];
      if (!storageKey) {
        throw new Error(`Unknown key: ${keyName}`);
      }
      
      const valueToStore = typeof value === 'object' && value !== null
        ? JSON.stringify(value)
        : String(value);
        
      localStorage.setItem(storageKey, valueToStore);
    }
  
    /**
     * Get all current localStorage values
     * @returns {Object} Current values for all configured keys
     */
    getAllValues() {
      const values = {};
      Object.keys(this.keys).forEach(keyName => {
        values[keyName] = this.getValue(keyName);
      });
      return values;
    }
  }
  
  // Create and export default instance
  const storageManager = new LocalStorageManager(LOCALSTORAGE_PATH);
  
  // Export individual functions for convenience
  export const exportData = () => storageManager.exportData();
  export const exportToFile = (filename) => storageManager.exportToFile(filename);
  export const importData = (data, overwrite) => storageManager.importData(data, overwrite);
  export const importFromFile = (file, overwrite?:boolean) => storageManager.importFromFile(file, overwrite);
  export const clearItems = (keyNames) => storageManager.clearItems(keyNames);
  export const getValue = (keyName) => storageManager.getValue(keyName);
  export const setValue = (keyName, value) => storageManager.setValue(keyName, value);
  export const getAllValues = () => storageManager.getAllValues();
  
  // Export the manager class and instance
  export { LocalStorageManager, storageManager as default, LOCALSTORAGE_PATH };
  
  // Usage examples:
  /*
  // Import the module
  import storageManager, { exportToFile, importFromFile, getValue, setValue } from './localStorage-manager.js';
  
  // Export current data
  const currentData = storageManager.exportData();
  console.log(currentData);
  
  // Export to file
  storageManager.exportToFile('my-backup.json');
  
  // Get/Set individual values
  setValue('chromePath', '/usr/bin/google-chrome');
  const chromePath = getValue('chromePath');
  
  // Import from file (with file input)
  const fileInput = document.querySelector('#file-input');
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const results = await importFromFile(file);
        console.log('Import results:', results);
      } catch (error) {
        console.error('Import failed:', error);
      }
    }
  });
  */