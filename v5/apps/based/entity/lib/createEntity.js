// TODO: add support for Entity.items

import EntityClass from '../EntityClass.js'
// TODO: remove TimersComponent import, use game reference instead ( reduce imported code )
//import TimersComponent from '../../../Component/TimersComponent.js';
import ensureColorInt from './util/ensureColorInt.js';
import layoutEntity from './layoutEntity.js';




function distanceSquared(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return dx * dx + dy * dy;
}

function deferEntityCreation(entityData) {
  // Add entity data to a spatial data structure
  spatialStructure.add(entityData);
}

// ignoreSetup set to true will ignore the setup phase of createEntity
// the setup phase assigns default values to the entity and auto-id
// this is currently being used from `rbush` plugin when creating deferred entities
export default function createEntity(config = {}, ignoreSetup = false) {
  // console.log('createEntity', config)

  let entityId;

  // Remark: See: ./Game/Lifecyle.js for Mantra Lifecycle Hooks
  // config = this.bp.lifecycle.triggerHook('before.createEntity', config);

  if (!ignoreSetup) {
    entityId = this._generateId();

    let defaultConfig = {
      id: entityId,
      name: null,
      kind: null,
      body: true,
      shape: 'triangle',
      color: null,
      position: { x: 0, y: 0, z: 0 },
      startingPosition: null,
      velocity: { x: 0, y: 0, z: 0 },
      rotation: 0,
      mass: 100,
      density: 100,
      health: Infinity,
      score: 0,
      // radius: null,
      height: 16,
      width: 16,
      depth: 16,
      // Remark: height, width, and depth are being replaced by size
      size: { width: 100, height: 100, depth: 16 },
      lifetime: null,
      maxSpeed: 100,
      isStatic: false,
      isSensor: false,
      restitution: 0,
      container: null,
      items: null,
      sutra: null,
      scene: [],
      meta: null,
      collectable: false,
      hasInventory: true,
      owner: 0, // 0 = server
      source: null, // originating source of the entity, in most cases this is process id
      inputs: null,
      value: null,
      destroyed: false,
      type: 'NONE',
      friction: 0.1,  // Default friction
      frictionAir: 0.01, // Default air friction
      frictionStatic: 0.5, // Default static friction
      lockedProperties: null, // object hash of properties that should never be updated
      actionRateLimiter: null, // object hash of state history
      timers: null, // object hash timers for TimersComponent.js
      yCraft: null, // object hash of properties for YCraft.js
      text: null,
      style: null,
      texture: null,

      collisionStart: true,
      collisionActive: false,
      collisionEnd: false,

      pointerdown: false,
      pointerup: false,
      pointermove: false,
      pointerover: false,
      pointerout: false,
      pointerenter: false,
      pointerleave: false,

      onDrop: null,
      afterItemCollected: null,

      afterRemoveEntity: null,
      afterCreateEntity: null,
      afterUpdate: null,
      update: null,
      exit: null,
      ctick: this.bp.tick,
      utick: this.bp.tick
    };

    // Remark: Adding support for new Entity.size prop, removing Entity.height and Entity.width
    if (typeof config.size === 'object') {
      config.width = config.size.width;
      config.height = config.size.height;
      config.depth = config.size.depth;
    } else {
      // Remark: Added 2/8/2024 Backwards support for legacy API, removed soon
      config.size = { width: config.width, height: config.height, depth: config.depth };
    }

    // merge config with defaultConfig
    config = { ...defaultConfig, ...config };

    // before mutating any game state based on the incoming entity, we *must* check that certain properties validate
    // check that position is well formed, contains, x,y,z, and is all valid numbers
    if (config.position &&
      (typeof config.position.x !== 'number' || isNaN(config.position.x) ||
        typeof config.position.y !== 'number' || isNaN(config.position.y))) {
      console.log('Entity.createEntity could not create with data', config);
      throw new Error('Invalid position for entity');
    }

    /*
    if (this.bp.systems.rbush) {
      this.bp.systems.rbush.addEntity(config);
    }
    */

    // Remark: Always add to deferredEntities, this is now being used to store all local
    //         game data that may not yet be in the game.data scope ( off screen / not loaded )
         // this.bp.deferredEntities[config.id.toString()] = config;
    // TODO: add option for allowSpatialTreeToDefer to be set to false ( ignore FoV for certain ents )
    
    /*
    if (this.bp.config.useFoV) {
      // check to see if entity is within game.data.fieldOfView,
      // if not, we will defer creation until it is
      let currentPlayer = this.bp.getCurrentPlayer();
      if (currentPlayer) {
        let incomingPosition = config.position || { x: 0, y: 0, z: 0 };
        let distance = distanceSquared(currentPlayer.position.x, currentPlayer.position.y, incomingPosition.x, incomingPosition.y);
        let fieldOfViewSquared = this.bp.data.fieldOfView * this.bp.data.fieldOfView;
        if (distance > fieldOfViewSquared) {
          return;
        }
      }

    }
      */

  }

  entityId = config.id;
  const entity = new EntityClass(entityId);

  /*
  entity.getTimer = (timerId) => {
    return this.bp.components.timers.get(entityId, timerId);
  };
  */

  if (!config.startingPosition) {
    config.startingPosition = config.position;
  }

  const { name, type, kind, position, rotation, startingPosition, body, mass, density, velocity, isSensor, isStatic, lockedProperties, width, height, depth, size, radius, shape, color, maxSpeed, health, score, items, container, sutra, scene, meta, collectable, hasInventory, owner, source, inputs, value, lifetime, yCraft, text, style, texture, collisionActive, collisionStart, collisionEnd, pointerdown, pointerup, pointermove, pointerenter, pointerleave, pointerover, pointerout, onDrop, afterRemoveEntity, afterCreateEntity, afterUpdateEntity, afterItemCollected, update, exit, ctick, utick } = config;

  let { x, y } = position;

  /*
  if (typeof config.position !== 'undefined') {
    position.x = config.position.x;
    position.y = config.position.y;
  }
  */

  // asset that color is integer value
  if (typeof color === 'string') {
    // check to see if # is present, if so, convert hex to int
    // needs to map common colors to integer values, red, green, black , etc
  }

  let ensuredColor = ensureColorInt(color);
  
  // console.log('position', position, 'width', width, 'height', height)
  // Using game's API to add components
  this.bp.addComponent(entityId, 'type', type || 'PLAYER');
  this.bp.addComponent(entityId, 'name', name || null);
  this.bp.addComponent(entityId, 'kind', kind);
  this.bp.addComponent(entityId, 'position', position);
  this.bp.addComponent(entityId, 'startingPosition', startingPosition);
  this.bp.addComponent(entityId, 'velocity', velocity);
  this.bp.addComponent(entityId, 'rotation', rotation);
  this.bp.addComponent(entityId, 'mass', mass);
  this.bp.addComponent(entityId, 'density', density);
  this.bp.addComponent(entityId, 'health', health);
  this.bp.addComponent(entityId, 'score', score);
  this.bp.addComponent(entityId, 'width', width);
  this.bp.addComponent(entityId, 'height', height);
  this.bp.addComponent(entityId, 'depth', depth);
  // Remark: height, width, and depth are being replaced by size
  this.bp.addComponent(entityId, 'size', size);
  this.bp.addComponent(entityId, 'radius', radius);
  this.bp.addComponent(entityId, 'shape', shape);
  this.bp.addComponent(entityId, 'color', ensuredColor);
  this.bp.addComponent(entityId, 'maxSpeed', maxSpeed);
  this.bp.addComponent(entityId, 'owner', owner);
  // source is reversed in order to form the relationship between the source and the entity
  this.bp.addComponent(source, 'source', source + '_' + entityId);
  this.bp.addComponent(entityId, 'items', items);
  this.bp.addComponent(entityId, 'scene', scene);

  this.bp.addComponent(entityId, 'meta', meta);
  this.bp.addComponent(entityId, 'collectable', collectable);
  
  // if entity is allowed to pickup items, add an inventory component
  this.bp.addComponent(entityId, 'hasInventory', hasInventory);

  this.bp.addComponent(entityId, 'value', value);

  this.bp.addComponent(entityId, 'inputs', inputs);
  this.bp.addComponent(entityId, 'lifetime', lifetime);
  this.bp.addComponent(entityId, 'destroyed', false);
  this.bp.addComponent(entityId, 'creationTime', Date.now());  // Current time in milliseconds
  this.bp.addComponent(entityId, 'isSensor', isSensor);
  this.bp.addComponent(entityId, 'isStatic', isStatic);
  this.bp.addComponent(entityId, 'lockedProperties', lockedProperties);
  this.bp.addComponent(entityId, 'actionRateLimiter', {});
  // TODO: clean up API contract with Component
      // this.bp.addComponent(entityId, 'timers', new TimersComponent('timers', entityId, this.bp));
  this.bp.addComponent(entityId, 'yCraft', yCraft);
  this.bp.addComponent(entityId, 'text', text);
  this.bp.addComponent(entityId, 'style', style);
  this.bp.addComponent(entityId, 'texture', texture);


  this.bp.addComponent(entityId, 'afterItemCollected', afterItemCollected);


  this.bp.addComponent(entityId, 'afterRemoveEntity', afterRemoveEntity);
  this.bp.addComponent(entityId, 'afterCreateEntity', afterRemoveEntity);
  this.bp.addComponent(entityId, 'afterUpdateEntity', afterUpdateEntity);


  this.bp.addComponent(entityId, 'collisionActive', collisionActive);
  this.bp.addComponent(entityId, 'collisionStart', collisionStart);
  this.bp.addComponent(entityId, 'collisionEnd', collisionEnd);

  this.bp.addComponent(entityId, 'pointerdown', pointerdown);
  this.bp.addComponent(entityId, 'pointerup', pointerup);
  this.bp.addComponent(entityId, 'pointermove', pointermove);
  this.bp.addComponent(entityId, 'pointerenter', pointerenter);
  this.bp.addComponent(entityId, 'pointerleave', pointerleave);
  this.bp.addComponent(entityId, 'pointerover', pointerover);
  this.bp.addComponent(entityId, 'pointerout', pointerout);

  // Drag and Drop Events
  this.bp.addComponent(entityId, 'onDrop', onDrop);

  this.bp.addComponent(entityId, 'update', update);
  this.bp.addComponent(entityId, 'exit', exit);
  this.bp.addComponent(entityId, 'ctick', ctick);
  this.bp.addComponent(entityId, 'utick', utick);

  let _sutra;
  // if the incoming sutra is an object, it is config object which needs to be scoped to the new entity
  if (typeof sutra === 'object' && sutra !== null) {
    if (typeof sutra.rules === 'function') {
      if (typeof sutra.config !== 'object') {
        sutra.config = {};
      }
      // if there is a valid rules function, we will create the Sutra instance
      // it is assumed the signature of the rules function is (game, entityId, config)
      // this may change in the future
      _sutra = sutra.rules(this.bp, entityId, sutra.config);
    } else {
      // could be a Sutra instance object instance without config object
      _sutra = sutra;
    }
  } else {
    // the incoming sutra was not a non-null object
    // it could be null or a function, assign component value without modification
    _sutra = sutra;
  }

  this.bp.addComponent(entityId, 'sutra', _sutra);

  if (body) {
    // remove this step, have everything work in addToWorld
    let body = {
      entityId: entityId,
      width: width,
      height: height,
      radius: radius,
      type: type,
      shape: shape,
      position: position,
      velocity: velocity,
      rotation: rotation,
      mass: mass,
      density: density,
      isStatic: isStatic,
      isSensor: isSensor,
      restitution: config.restitution,
      friction: config.friction,
      frictionAir: config.frictionAir,
      frictionStatic: config.frictionStatic
    }
    body.myEntityId = entityId; // TODO myEntityId is legacy, remove

    /* Disabled physics for now
    this.bp.physics.addToWorld(body);
    // TODO: bodyMap needs to be removed
    //       in order to decouple physics from game, we'll need to use body references in app space
    //       and allow the physics interface to use entity.id as the key between worker and app space
    // this.bp.bodyMap[entityId] = body;

    if (velocity && (velocity.x !== 0 || velocity.y !== 0)) {
      this.bp.physics.setVelocity(entityId, velocity);
    }

    if (position) {
      this.bp.physics.setPosition(entityId, position);
    }
    if (typeof rotation !== 'undefined') {
      if (this.bp.physics && this.bp.physics.setRotation) {
        this.bp.physics.setRotation(entityId, rotation);
      }
    }
      */
  } else {
    // immediately add to changedEntities
    // this.bp.changedEntities.add(entityId);
  }

  // Add the entity to the game entities scope
  // TODO: new Entity() should do this
  // console.log('setting id', entityId, 'to entity')
  this.bp.entities.set(entityId, {
    id: entityId
  });
  // console.log("SETTING CHANGED", entityId)
  // this.bp.changedEntities.add(entityId);

  // get updated entity with components
  let updatedEntity = this.bp.getEntity(entityId);

  if (typeof updatedEntity.pendingRender === 'undefined') {
    updatedEntity.pendingRender = {};
  }
  
  /*
  this.bp.graphics.forEach(function (graphicsInterface) {
    updatedEntity.pendingRender[graphicsInterface.id] = true;
  });
  */

  // updates entity in the ECS entity Map scope
  this.bp.entities.set(entityId, updatedEntity);

  // TODO: move this to separate file
  if (container) {
    this.layoutEntity(container, entityId);
  }

  // updates entity in the flat game.data scope
  this.bp.data.ents = this.bp.data.ents || {};
  this.bp.data.ents._ = this.bp.data.ents._ || {};
  this.bp.data.ents._[entityId] = updatedEntity;
  this.bp.data.ents[updatedEntity.type] = this.bp.data.ents[updatedEntity.type] || [];
  this.bp.data.ents[updatedEntity.type].push(updatedEntity);

  // check to see if there are no active players, if so set the entity as the current player
  // TODO: config flag
  if (updatedEntity.type === 'PLAYER' && this.bp.data.ents.PLAYER) {
    let activePlayerCount = Object.keys(this.bp.data.ents.PLAYER).length;
    // console.log("activePlayerCount", activePlayerCount)
    if (activePlayerCount < 1) {
      // console.log('Setting player id', entityId);
      this.bp.setPlayerId(entityId);
    }
  }

  //
  // Entity Lifecycle afterCreateEntity
  //
  let _afterCreateEntity;
  if (typeof config.afterCreateEntity === 'function') {
    _afterCreateEntity = config.afterCreateEntity;
  }
  if (_afterCreateEntity) {
    _afterCreateEntity(config);
  }

  //
  //
  // Game Lifecycle after.createEntity
  // updatedEntity = this.bp.lifecycle.triggerHook('after.createEntity', config);

  return updatedEntity;
}