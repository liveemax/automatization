import { LOCALSTORAGE_PATH } from "../constants/constants";

/**
   * LocalStorage Editor for modifying existing items
   */
class LocalStorageEditor {
    keys: {[path:string]:string};
    constructor(keys = LOCALSTORAGE_PATH) {
        this.keys = keys;
    }
  
    /**
     * Edit a localStorage item with various operations
     * @param {string} keyName - Key name to edit
     * @param {any} newValue - New value or modification function
     * @param {Object} options - Edit options
     * @returns {Object} Edit result with success status and details
     */
    editItem(keyName:string, newValue:any, options = {}) {
        const {
            mode = "replace",  // 'replace', 'append', 'prepend', 'merge', 'function'
            createIfMissing = false,
            backup = true,
            validate = null
        } = options as any;
  
        const storageKey = this.keys[keyName];

        if (!storageKey) {
            return {
                success: false,
                error: `Unknown key: ${keyName}`,
                originalValue: null,
                newValue: null
            };
        }
  
        try {
        // Get current value
            const currentRaw = localStorage.getItem(storageKey);
            let currentValue = null;
        
            if (currentRaw === null && !createIfMissing) {
                return {
                    success: false,
                    error: `Item '${keyName}' does not exist`,
                    originalValue: null,
                    newValue: null
                };
            }
  
            // Parse current value
            if (currentRaw !== null) {
                try {
                    currentValue = JSON.parse(currentRaw || "");
                } catch {
                    currentValue = currentRaw;
                }
            }
  
            // Create backup if requested
            let backupKey = null;

            if (backup && currentRaw !== null) {
                backupKey = `${storageKey}_backup_${Date.now()}`;
                localStorage.setItem(backupKey, currentRaw);
            }
  
            // Calculate new value based on mode
            let finalValue;

            switch (mode) {
                case "replace":
                    finalValue = newValue;

                    break;
  
                case "append":
                    if (typeof currentValue === "string") {
                        finalValue = currentValue + newValue;
                    } else if (Array.isArray(currentValue)) {
                        finalValue = [...currentValue, ...(Array.isArray(newValue) ? newValue : [newValue])];
                    } else {
                        return {
                            success: false,
                            error: "Append mode requires string or array value",
                            originalValue: currentValue,
                            newValue: null
                        };
                    }

                    break;
  
                case "prepend":
                    if (typeof currentValue === "string") {
                        finalValue = newValue + currentValue;
                    } else if (Array.isArray(currentValue)) {
                        finalValue = [...(Array.isArray(newValue) ? newValue : [newValue]), ...currentValue];
                    } else {
                        return {
                            success: false,
                            error: "Prepend mode requires string or array value",
                            originalValue: currentValue,
                            newValue: null
                        };
                    }

                    break;
  
                case "merge":
                    if (typeof currentValue === "object" && currentValue !== null && !Array.isArray(currentValue) ) {
                        //@ts-ignore
                        finalValue = { ...currentValue,
                            ...newValue };
                    } else {
                        return {
                            success: false,
                            error: "Merge mode requires object value",
                            originalValue: currentValue,
                            newValue: null
                        };
                    }

                    break;
  
                case "function":
                    if (typeof newValue !== "function") {
                        return {
                            success: false,
                            error: "Function mode requires a function as newValue",
                            originalValue: currentValue,
                            newValue: null
                        };
                    }

                    //@ts-ignore
                    finalValue = newValue(currentValue);

                    break;
  
                default:
                    return {
                        success: false,
                        error: `Unknown edit mode: ${mode}`,
                        originalValue: currentValue,
                        newValue: null
                    };
            }
  
            // Validate new value if validator provided
            if (validate && typeof validate === "function") {
                const validationResult = validate(finalValue, currentValue);

                if (validationResult !== true) {
                    return {
                        success: false,
                        error: `Validation failed: ${validationResult}`,
                        originalValue: currentValue,
                        newValue: finalValue
                    };
                }
            }
  
            // Store the new value
            const valueToStore = typeof finalValue === "object" && finalValue !== null
                ? JSON.stringify(finalValue)
                : String(finalValue);
  
            localStorage.setItem(storageKey, valueToStore);
  
            return {
                success: true,
                originalValue: currentValue,
                newValue: finalValue,
                backupKey: backupKey,
                storageKey: storageKey
            };
  
        } catch (error:any) {
            return {
                success: false,
                error: `Edit failed: ${error.message}`,
                originalValue: null,
                newValue: null
            };
        }
    }
  
    /**
     * Edit object property within a localStorage item
     * @param {string} keyName - Key name containing the object
     * @param {string} propertyPath - Dot notation path to property (e.g., 'user.settings.theme')
     * @param {any} newValue - New value for the property
     * @param {Object} options - Edit options
     * @returns {Object} Edit result
     */
    editProperty(keyName:string, propertyPath:string, newValue:string, options = {}) {
        return this.editItem(keyName, (currentValue:any) => {
            if (typeof currentValue !== "object" || currentValue === null) {
                throw new Error("Cannot edit property of non-object value");
            }
  
            const result = { ...currentValue };
            const pathParts = propertyPath.split(".");
            let current = result;
  
            // Navigate to parent of target property
            for (let i = 0; i < pathParts.length - 1; i++) {
                const part = pathParts[i];

                if (!(part in current) || typeof current[part] !== "object") {
                    current[part] = {};
                }

                current = current[part];
            }
  
            // Set the final property
            current[pathParts[pathParts.length - 1]] = newValue;

            return result;
        }, { ...options,
            mode: "function" });
    }
  
    /**
     * Add item to array in localStorage
     * @param {string} keyName - Key name containing the array
     * @param {any} item - Item to add
     * @param {Object} options - Options including position, duplicates handling
     * @returns {Object} Edit result
     */
    addToArray(keyName:string, item:any, options = {}) {
        const { position = "end", allowDuplicates = true, uniqueBy = null } = options as any;
  
        return this.editItem(keyName, (currentValue:any) => {
            if (!Array.isArray(currentValue)) {
                throw new Error("Value is not an array");
            }
  
            const result = [...currentValue];
  
            // Check for duplicates if needed
            if (!allowDuplicates) {
                if (uniqueBy) {
                    const exists = result.some(existing => 
                        typeof existing === "object" && existing[uniqueBy] === item[uniqueBy]
                    );

                    if (exists) return result; // No change
                } else {
                    if (result.includes(item)) return result; // No change
                }
            }
  
            // Add item at specified position
            if (position === "start") {
                result.unshift(item);
            } else if (typeof position === "number") {
                result.splice(position, 0, item);
            } else {
                result.push(item);
            }
  
            return result;
        }, { ...options,
            mode: "function" });
    }
  
    /**
     * Remove item from array in localStorage
     * @param {string} keyName - Key name containing the array
     * @param {any} itemOrIndex - Item to remove or index
     * @param {Object} options - Options including removal criteria
     * @returns {Object} Edit result
     */
    removeFromArray(keyName:string, itemOrIndex:any, options:any = {}) {
        const { by = "value", all = false } = options; // 'value', 'index', 'property'
  
        return this.editItem(keyName, (currentValue:any) => {
            if (!Array.isArray(currentValue)) {
                throw new Error("Value is not an array");
            }
  
            let result = [...currentValue];
  
            if (by === "index") {
                if (typeof itemOrIndex === "number" && itemOrIndex >= 0 && itemOrIndex < result.length) {
                    result.splice(itemOrIndex, 1);
                }
            } else if (by === "value") {
                if (all) {
                    result = result.filter(item => item !== itemOrIndex);
                } else {
                    const index = result.indexOf(itemOrIndex);

                    if (index > -1) {
                        result.splice(index, 1);
                    }
                }
            } else if (by === "property" && typeof options.propertyName === "string") {
                if (all) {
                    result = result.filter(item => 
                        typeof item !== "object" || item[options.propertyName] !== itemOrIndex
                    );
                } else {
                    const index = result.findIndex(item => 
                        typeof item === "object" && item[options.propertyName] === itemOrIndex
                    );

                    if (index > -1) {
                        result.splice(index, 1);
                    }
                }
            }
  
            return result;
        }, { ...options,
            mode: "function" });
    }
  
    /**
     * Restore from backup
     * @param {string} backupKey - Backup key to restore from
     * @param {string} targetKeyName - Target key name to restore to
     * @returns {Object} Restore result
     */
    restoreFromBackup(backupKey:string, targetKeyName:string) {
        try {
            const backupValue = localStorage.getItem(backupKey);

            if (backupValue === null) {
                return {
                    success: false,
                    error: "Backup not found"
                };
            }
  
            const targetStorageKey = this.keys[targetKeyName];

            if (!targetStorageKey) {
                return {
                    success: false,
                    error: `Unknown target key: ${targetKeyName}`
                };
            }
  
            localStorage.setItem(targetStorageKey, backupValue);
            localStorage.removeItem(backupKey); // Clean up backup
  
            return {
                success: true,
                restoredValue: backupValue
            };
        } catch (error:any) {
            return {
                success: false,
                error: `Restore failed: ${error.message}`
            };
        }
    }
}
  
// Create and export default instance
const editor = new LocalStorageEditor(LOCALSTORAGE_PATH);
  
// Export convenience functions
export const editItem = (keyName:string, newValue:any, options:any) => editor.editItem(keyName, newValue, options);
export const editProperty = (keyName:any, propertyPath:any, newValue:any, options:any) => editor.editProperty(keyName, propertyPath, newValue, options);
export const addToArray = (keyName:any, item:any, options:any) => editor.addToArray(keyName, item, options);
export const removeFromArray = (keyName:any, itemOrIndex:any, options:any) => editor.removeFromArray(keyName, itemOrIndex, options);
export const restoreFromBackup = (backupKey:any, targetKeyName:any) => editor.restoreFromBackup(backupKey, targetKeyName);
  
// Export the editor class and instance
export { LocalStorageEditor, editor as default };
  
// Usage examples:
/*
  // Simple replace
  editItem('chromePath', '/new/chrome/path');
  
  // Append to string
  editItem('chromePath', '/additional/path', { mode: 'append' });
  
  // Add to array
  addToArray('alphabotProjects', { name: 'New Project', id: 123 });
  
  // Edit object property
  editProperty('alphabotProjects', 'settings.theme', 'dark');
  
  // Advanced editing with validation
  editItem('chromePath', '/usr/bin/chrome', {
    mode: 'replace',
    backup: true,
    validate: (newValue) => {
      if (!newValue.includes('chrome')) {
        return 'Path must contain "chrome"';
      }
      return true;
    }
  });
  
  // Function-based editing
  editItem('alphabotProjects', (current) => {
    return current.map(project => ({
      ...project,
      lastModified: Date.now()
    }));
  }, { mode: 'function' });
  */