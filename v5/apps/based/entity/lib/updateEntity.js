import ensureColorInt from './util/ensureColorInt.js';

export default function updateEntity(entityDataOrId, entityData, updateOptions = {}) {

  if (typeof entityDataOrId === 'string' || typeof entityDataOrId === 'number') {
    entityData = { id: entityDataOrId, ...entityData };
  } else {
    entityData = entityDataOrId;
  }

  // Remark: See: ./Game/Lifecyle.js for Mantra Lifecycle Hooks
  entityData = this.game.lifecycle.triggerHook('before.updateEntity', entityData);

  if (entityData == null) {
    console.warn('updateEntity was not provided a valid entityData', entityData);
    console.warn('This is most likely the result of passing invalid data to updateEntity()');
    return;
  }

  // console.log('updateEntity', entityData)
  let entityId = entityData.id;
  if (typeof entityId === 'undefined') {
    // check to see if we have a name, if so, find the entity by name
    if (entityData.name) {
      let ent = this.game.getEntityByName(entityData.name);
      if (ent) {
        entityId = ent.id;
      }
    }
  }

  if (typeof entityId === 'undefined') {
    console.log('Error: updateEntity was not provided a valid entity.id or entity.name', entityData);
    console.log('This is most likely the result of passing invalid data to updateEntity()');
    return;
  }

  let ent = this.game.getEntity(entityId);

  // if the state doesn't exist, return error
  if (!ent) {
    //console.log('Error: updateEntity called for non-existent entity', entityId, entityData);
    //console.log('This should not happen, if a new state came in it should be created');
    return;
  }

  // Remove destroyed entities
  if (entityData.destroyed) {
    this.removeEntity(entityId);
    return;
  }

  // not a component property yet, just ad-hoc on client
  ent.pendingRender = {};
  this.game.graphics.forEach(function (graphicsInterface) {
    ent.pendingRender[graphicsInterface.id] = true;
  });

  if (entityData.color) {
    // entityData.color may be color name as string, hex code, or integer value
    // ensureColorInt will convert incoming color to safe integer value
    //console.log('entityData.color', entityData.color)
    let ensuredColor = ensureColorInt(entityData.color);
    // console.log('ensuredColor', ensuredColor)
    this.game.components.color.set(entityId, ensuredColor);
  }

  let updateSize = false;
  if (entityData.height) {
    updateSize = true;
    this.game.components.height.set(entityId, entityData.height);
  }

  if (entityData.width) {
    updateSize = true;
    this.game.components.width.set(entityId, entityData.width);
  }

  if (entityData.radius) {
    updateSize = true;
    // this.game.components.radius.set(entityId, entityData.radius);
  }

  // size is new API, remove root level height, width, radius
  if (entityData.size) {
    updateSize = true;
    this.game.components.size.set(entityId, entityData.size);
  }

  /*
  if (entityData.body === false) {
    // alert("remove body");
    this.game.physics.removeBody(entityId);
  }
  */

  if (updateSize) {
    // let body = this.game.bodyMap[entityId];
    this.game.physics.setBodySize(entityId, entityData);

  }

  if (entityData.position) {

    // update the position
    this.game.components.position.set(entityId, entityData.position);

    // let body = this.game.bodyMap[entityId];
    this.game.physics.setPosition(entityId, entityData.position);

  }

  if (entityData.velocity) {
    this.game.physics.setVelocity(entityId, entityData.velocity);
  }

  if (entityData.health) {
    this.game.components.health.set(entityId, entityData.health);
  }

  if (typeof entityData.thickness !== 'undefined' && entityData.thickness !== null) {
    this.game.components.width.set(entityId, entityData.thickness);
  }

  //
  // Event handlers / Lifecycle Events
  //

  //
  // Entity event lifecycle events will merge by default ( for now )
  if (typeof entityData.update !== 'undefined') {
    // get the current component value
    let currentFn = this.game.components.update.get(entityId);
    let entRef = this.game.data.ents._[entityId];
    if (entRef) {
      // clear out all existing update functions
      // TODO: add better mappings in EntityBuilder.js for granular removals
      if (entityData.update === null) {
        this.game.components.update.set(entityId, null);
      } else {
        // create a quick config to store the events, we'll want to convert entire function to use this
        let updateConfig = this.game.make();
        updateConfig.onUpdate(entityData.update);
        // inherit the current update function, creates a tree of functions
        // do we want to do this? what are the implications?
        if (currentFn && currentFn.handlers && currentFn.handlers.length) {
          currentFn.handlers.forEach(function (fn) {
            // console.log("adding existing fn to updateConfig", fn.toString())
            updateConfig.onUpdate(fn);
          });
        }
        // console.log("new updateConfig", updateConfig.config.update)
        // Update the current ent that will be returned from updateEntity(entityId, entityData)
        ent.update = updateConfig.config.update;
        // Update the component value
        this.game.components.update.set(entityId, updateConfig.config.update);
      }
    }
  }

  //
  // UI Component Properties
  //
  if (typeof entityData.value !== 'undefined') {
    this.game.components.value.set(entityId, entityData.value);
  }

  //
  // Meta properties
  //
  if (typeof entityData.meta !== 'undefined') {
    let merged = {};
    let componentData = this.game.components.meta.get(entityId);
    if (componentData) {
      merged = { ...componentData, ...entityData.meta };
    } else {
      merged = entityData.meta;
    }
    this.game.components.meta.set(entityId, merged);
  }

  if (typeof entityData.score !== 'undefined' && entityData.score !== null) {
    this.game.components.score.set(entityId, entityData.score);
  }

  if (typeof entityData.rotation !== 'undefined') {
    if (this.game.physics && this.game.physics.setRotation) {
      // let body = this.game.bodyMap[entityId];
      this.game.physics.setRotation(entityId, entityData.rotation);

    } else {
      console.log('WARNING: physics.setRotation is not defined');
      // Remark: we could support direct rotation updates here if mantra was being run without physics engine
      // this.game.components.rotation.set(entityId, entityData.rotation);
    }
  }

  if (typeof entityData.text !== 'undefined') {
    this.game.components.text.set(entityId, entityData.text);
  }

  // Items
  if (typeof entityData.items !== 'undefined') {
    // overwrite all items ( for now )
    // Remark: in the future we could merge instead of overwrite
    this.game.components.items.set(entityId, entityData.items);
  }

  // Sutra rules
  if (typeof entityData.sutra !== 'undefined') {
    // overwrite sutra ( for now )
    this.game.components.sutra.set(entityId, entityData.sutra);
  }

  // Items
  if (typeof entityData.items !== 'undefined') {
    // overwrite all items ( for now )
    // Remark: in the future we could merge instead of overwrite
    this.game.components.items.set(entityId, entityData.items);
  }

  if (typeof entityData.style !== 'undefined') {
    // overwrite all items ( for now )
    // Remark: in the future we could merge instead of overwrite
    this.game.components.style.set(entityId, entityData.style);
  }

  if (typeof entityData.texture !== 'undefined') {
    // overwrite all items ( for now )
    // Remark: in the future we could merge instead of overwrite
    // create new textures object by merging in the new texture
    let prev = this.game.components.texture.get(entityId);
    let newTexture;
    // check to see if incoming entityData.texture is a string, if so, it's a texture id
    if (typeof entityData.texture === 'string') {
      newTexture = entityData.texture;
    } else {
      newTexture = { ...prev, ...entityData.texture };
    }

    this.game.components.texture.set(entityId, newTexture);
  }

  // Remark: The physics engine update will update the position
  //         If we update the position here, it's most likely going to be overwritten by the physics engine
  if (this.game.systems.rbush) {
    // this.game.systems.rbush.updateEntity(ent);
  }

  // Updates the Entity.utick
  this.game.components.utick.set(entityId, this.game.tick);

  //
  // Entity Lifecycle afterUpdateEntity
  //

  let updatedEnt = this.game.getEntity(entityId);

  if (updateOptions.skipAfterUpdateEntity !== true) {
    let _afterUpdateEntity;

    if (typeof updatedEnt.afterUpdateEntity === 'function') {
      _afterUpdateEntity = updatedEnt.afterUpdateEntity;
    }
    if (_afterUpdateEntity) {
      _afterUpdateEntity(updatedEnt);
    }
  }

  updatedEnt = this.game.lifecycle.triggerHook('after.updateEntity', updatedEnt);

  return updatedEnt;

}

/* TODO: we need to iterate all events for composite updates
   TODO: add unit tests for Entity.updateEntity({ eventName }) tests
         be sure to check all cases
         double check our usage of using null to pop fn from array
         see about exact fn match for removal

function updateEntityEvents(entityId, entityData) {
  console.log("Updating Entity Events");

  // List of known event names
  const eventNames = [
    'pointerdown', 'pointerup', 'pointermove', 'pointerover', 'pointerout',
    'pointerenter', 'pointerleave', 'collisionStart', 'collisionActive',
    'collisionEnd', 'onDrop', 'update', 'afterRemoveEntity'
  ];

  let entRef = this.game.data.ents._[entityId];
  if (!entRef) {
    console.log("Entity reference not found");
    return;
  }

  eventNames.forEach(eventName => {
    if (typeof entityData[eventName] !== 'undefined') {
      console.log(`Processing ${eventName}`);

      // Create a quick config to store the events
      let eventConfig = this.game.make();

      // Add the new event handler
      eventConfig['_addEventHandler'](eventName, entityData[eventName]);

      // Check if there are existing event handlers to preserve
      let existingEventFn = this.game.components[eventName].get(entityId);
      if (typeof existingEventFn === 'function' && Array.isArray(existingEventFn.handlers)) {
        // Add each existing handler to the new configuration to preserve them
        existingEventFn.handlers.forEach(handler => eventConfig['_addEventHandler'](eventName, handler));
      }

      // Set the updated configuration
      this.game.components[eventName].set(entityId, eventConfig.config[eventName]);
    }
  });
}
*/