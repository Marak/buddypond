// Component.js - Marak Squires 2023
class Component {
    constructor(name, game) {
      this.name = name;
      this.data = {};
      this.game = game;
    }
  
    set(key, value) {
      const entityId = Array.isArray(key) ? key[0] : key;
  
      // Check if the property is locked
      if (this.game) {
        // console.log('this.game', this.game)
        /*
        const lockedProps = this.game.components['lockedProperties'].get(entityId);
        if (this.isLocked(lockedProps, this.name)) {
          // console.log(`Property ${key} is locked and cannot be updated.`);
          return; // Do not update if the property is locked
        }
          */
      }
  
      if (Array.isArray(key)) {
        // Ensure nested structure exists
        let current = this.data;
        for (let i = 0; i < key.length - 1; i++) {
          if (!current[key[i]]) {
            current[key[i]] = {};
          }
          current = current[key[i]];
        }
        current[key[key.length - 1]] = value;
      } else {
        this.data[key] = value;
      }
  
      // After setting the value, update the corresponding entity in the game.entities
      if (this.game && this.game.entities && this.game.entities.has(entityId)) {
        let existing = this.game.entities.get(entityId);
        existing[this.name] = this.get(entityId);
      }
  
    }
  
    get(key) {
      if (Array.isArray(key)) {
        let current = this.data;
        for (let i = 0; i < key.length; i++) {
          if (current[key[i]] === undefined) {
            return null;
          }
          current = current[key[i]];
        }
        return current;
      }
  
      if (typeof this.data[key] === 'undefined' || this.data[key] === null) {
        return null;
      }
  
      return this.data[key];
    }
  
    remove(key) {
      if (Array.isArray(key)) {
        let current = this.data;
        for (let i = 0; i < key.length - 1; i++) {
          if (current[key[i]] === undefined) {
            return;
          }
          current = current[key[i]];
        }
        delete current[key[key.length - 1]];
      } else {
        delete this.data[key];
      }
  
    }
  
    // Helper method to check if a property or sub-property is locked
    isLocked(lockedProps, key) {
      if (!lockedProps) return false;
  
      if (Array.isArray(key)) {
        let current = lockedProps;
        for (let i = 0; i < key.length; i++) {
          if (current[key[i]] === undefined) {
            return false; // Property not locked
          }
          current = current[key[i]];
        }
        return true; // Property is locked
      }
  
      return lockedProps[key] !== undefined;
    }
  
  }
  
  export default Component;