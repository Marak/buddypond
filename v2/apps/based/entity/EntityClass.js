// Entity.js - Marak Squires 2023
import createEntity from './lib/createEntity.js';
import getEntity from './lib/getEntity.js';
import inflateEntity from './lib/inflateEntity.js';
import removeEntity from './lib/removeEntity.js';
import updateEntity from './lib/updateEntity.js';
import layoutEntity from './lib/layoutEntity.js';
import removeAllEntities from './lib/removeAllEntities.js';

class Entity {

  static id = 'entity';
  static removable = false;

  constructor() {
    this.id = Entity.id;
    this.nextEntityId = 1; // 0 is reserved for server
  }

  init(bp) {

    // bind game scope to this.bp
    // TODO: game scope now becomes bp scope
    this.bp = bp;

    // init a new Map to store entities
    bp.entities = new Map();

    // does Entity need to register as a system?
    // systems really only care about update() and maybe render()
    // i think Entity proper doesn't care, only instances that are build will need to register?
    // will have to double check and see
    // this.bp.systemsManager.addSystem(this.id, this);

    // Bind some methods to parent Game scope for convenience
    // The most useful and common System methods are expected to be bound to Game
    // This allows developers to customcraft a clean Game API based on their needs
    this.bp.createEntity = createEntity.bind(this);
    this.bp.getEntity = getEntity.bind(this);
    this.bp.removeEntity = removeEntity.bind(this);
    this.bp.getEntityByName = this.getEntityByName.bind(this);
    this.bp.getEntities = this.allEntities.bind(this);
    this.bp.updateEntity = updateEntity.bind(this);
    this.bp.inflateEntity = inflateEntity.bind(this);
    this.bp.hasEntity = this.hasEntity.bind(this);
    this.bp.findEntity = this.findEntity.bind(this);
    this.bp.removeAllEntities = removeAllEntities.bind(this);
    this.removeAllEntities = removeAllEntities.bind(this);
    this.layoutEntity = layoutEntity.bind(this);
  }

  hasEntity (entityId) {
    return this.bp.entities.has(entityId);
  }

  findEntity (query) {
    if (typeof query === 'string') {
      query = { name: query };
    }
    // iterate over entities and return the first match
    for (let [entityId, entity] of this.bp.entities) {
      let match = true;
      for (let key in query) {
        if (entity[key] !== query[key]) {
          match = false;
          break;
        }
      }
      if (match) {
        return entity;
      }
    }
  }

  getEntityByName(name) {
    for (let [entityId, entity] of this.bp.entities) {
      if (entity.name === name) {
        return entity;
      }
    }
  }
 
  _generateId() {
    return this.nextEntityId++;
  }

  cleanupDestroyedEntities() {

    this.bp.lifecycle.triggerHook('before.cleanupRemovedEntities');

    const destroyedComponentData = this.bp.components.destroyed.data;
    for (let entityId in destroyedComponentData) {
      if (typeof entityId === 'string') {
        entityId = parseInt(entityId); // for now, this can be removed when we switch Component.js to use Maps
      }
      const destroyedType = this.bp.components.type.get(entityId);
      if (destroyedComponentData[entityId]) {
        // Removes the body from the physics engine
        if (typeof this.bp.physics.removeBody === 'function') {
          this.bp.physics.removeBody(entityId);
        }
        // Delete associated components for the entity using Component's remove method
        for (let componentType in this.bp.components) {
          this.bp.components[componentType].remove(entityId);
        }
        this.bp.entities.delete(entityId);
        // remove the reference in this.bp.data.ents
        delete this.bp.data.ents._[entityId];
        // find entity by id and filter it out
        if (this.bp.data.ents[destroyedType]) {
          // TODO: missing test ^^^
          this.bp.data.ents[destroyedType] = this.bp.data.ents[destroyedType].filter((entity) => {
            return Number(entity.id) !== Number(entityId);
          });
        }
      }
    }

    this.bp.lifecycle.triggerHook('after.cleanupRemovedEntities');

  }

  // Update the getEntities method to return the game.entities
  allEntities() {
    return this.bp.entities;
  }


  applyLockedProperties(entityId, lockedProperties) {
    // Check and apply locked properties
    if (lockedProperties) {
      console.log("Processing lockedProperties properties");
      for (let key in lockedProperties) {
        let currentVal = this.bp.components[key].get(entityId);
        console.log('currentVal', currentVal, 'key', key, lockedProperties)
        if (currentVal !== undefined && currentVal !== null) {
          if (typeof lockedProperties[key] === 'object' && !Array.isArray(lockedProperties[key])) {
            // If lockedProperties[key] is an object, iterate through its keys
            console.log('lockedProperties[key]', lockedProperties[key])
            for (let subKey in lockedProperties[key]) {
              console.log('subKey', subKey, lockedProperties[key][subKey])
              if (lockedProperties[key][subKey] === true) {  // only process if the value is true
                let nestedVal = currentVal[subKey];
                if (nestedVal !== undefined && nestedVal !== null) {
                  console.log('Setting lockedProperties property', `${key}.${subKey}`, 'to', nestedVal);
                  this.bp.components['lockedProperties'].set(entityId, { [key]: { [subKey]: nestedVal } });
                } else {
                  console.log('Error: No such component or invalid value for', `${key}.${subKey}`);
                }
              }
            }
          } else if (lockedProperties[key] === true) {  // if lockedProperties[key] is not an object and the value is true
            console.log('Setting lockedProperties property', key, 'to', currentVal);
            this.bp.components['lockedProperties'].set(entityId, { [key]: currentVal });
          }
        } else {
          console.log('Error: No such component or invalid value for', key);
        }
      }
    }
  }

}

export default Entity;

/* refactor to use this pattern */
/*
import Entity from './Entity.js';
const entity = new Entity(entityId);

*/
