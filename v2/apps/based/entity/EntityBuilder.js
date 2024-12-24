// EntityBuilder.js - Marak Squires 2024
import ensureColorInt from '../plugins/entity/lib/util/ensureColorInt.js';
export default class EntityBuilder {
  constructor(game) {
    this.game = game;
    this.config = {
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      rotation: 0, // TODO: x / y z
      // TODO: defaults should be applied at the end,
      //       during build() or .createEntity()
      //       it is unexpected to see default values during make() process
      //       it is better to leave the defaults off until the end
      // TODO: add tests for default values
      size: {
        width: 16,
        height: 16,
        depth: 16
      },
      offset: {
        x: 0,
        y: 0,
        z: 0
      },
      meta: {}

    };
  }

  // provides a default Entity() builder, required for Mantra Markup
  Entity () {
    return this;
  }

  // Remark: id is not used when creating entities, it's used for building configs
  id(value) {
    this.config.id = value;
    return this;
  }

  // Basic properties
  type(value) {
    this.config.type = value;

    if (value === 'TEXT') {
      // text entities should not have a body by default
      // can be overridden by calling body(true) after type('TEXT')
      this.config.body = false;
    }

    return this;
  }

  name(value) {
    this.config.name = value;
    return this;
  }

  kind(value) {
    this.config.kind = value;
    return this;
  }

  startingPosition(x, y) {
    this.config.startingPosition = { x, y };
    return this;
  }

  body(value = true) {
    this.config.body = value;
    return this;
  }

  friction(value) { // friction will default override the other friction values
    this.config.friction = value;
    this.config.frictionStatic = value;
    this.config.frictionAir = value;
    return this;
  }

  frictionStatic(value) {
    this.config.frictionStatic = value;
    return this;
  }

  frictionAir(value) {
    this.config.frictionAir = value;
    return this;
  }

  velocity(x, y) {
    this.config.velocity = { x, y };
    return this;
  }

  rotation(value) {
    this.config.rotation = value;
    return this;
  }

  angle(value) { // angle is alias for rotaion
    // convert the incoming degrees to radians
    let radians = value * (Math.PI / 180);
    this.config.rotation = radians;
    return this;
  }

  // Physical properties
  mass(value) {
    this.config.mass = value;
    return this;
  }

  density(value) {
    this.config.density = value;
    return this;
  }

  restitution(value) {
    this.config.restitution = value;
    return this;
  }

  // Health and scoring
  health(value) {
    this.config.health = value;
    return this;
  }

  score(value) {
    this.config.score = value;
    return this;
  }

  lifetime(value) {
    this.config.lifetime = value;
    return this;
  }

  // Dimensions
  size(width, height, depth) {

    if (typeof height === 'undefined') {
      height = width;
    }

    this.config.size = { width, height };
    if (typeof depth !== 'undefined') { // 2d games may not have a depth, we may want to default to 0
      this.config.size.depth = depth;
    } else {
      this.config.size.depth = height;
    }
    return this;
  }

  width(value) {
    this.config.size.width = value;
    return this;
  }

  height(value) {
    this.config.size.height = value;
    return this;
  }

  depth(value) {
    this.config.size.depth = value;
    return this;
  }

  radius(value) {
    this.config.radius = value;
    return this;
  }

  // Styling and appearance
  shape(value) {
    this.config.shape = value;
    return this;
  }

  color(value) {
    this.config.color = ensureColorInt(value); // converts string and hex color to int
    return this;
  }

  texture(value) {
    this.config.texture = value;
    return this;
  }

  style(value) {
    this.config.style = value;
    return this;
  }

  // Behavior and capabilities
  maxSpeed(value) {
    this.config.maxSpeed = value;
    return this;
  }

  owner(value) {
    this.config.owner = value;
    return this;
  }

  hasInventory(value = true) {
    this.config.hasInventory = value;
    return this;
  }

  isSensor(value = true) {
    this.config.isSensor = value;
    return this;
  }

  isStatic(value = true) {
    this.config.isStatic = value;
    return this;
  }

  _addEventHandler(eventName, handler) {
    // Check if the event already has a composite function with handlers
    if (typeof this.config[eventName] === 'function' && Array.isArray(this.config[eventName].handlers)) {
      if (typeof handler === 'undefined') {
        throw new Error(`Handler for ${eventName} event is undefined`);
      }
      this.config[eventName].handlers.push(handler); // Add to existing handlers
    } else {
      if (typeof handler === 'boolean') {
        this.config[eventName] = handler;
      }
      if (typeof handler === 'function') {
        // Otherwise, create a new composite function and handlers array
        const handlers = [handler];
        this.config[eventName] = (...args) => {
          try {
            handlers.forEach(function(h){
              if (typeof h === 'function') {
                h(...args);
              } else {
                console.warn("handler is not a function", h, args)
              }
            }); // Execute all handlers
          } catch (err) {
            console.error(`Error in event handler for ${eventName}:`, err);
          }
        };
        this.config[eventName].handlers = handlers; // Store handlers
      }
    }

    return this;
  }

  //
  // Public methods to add specific event handlers
  //
  // Pointer events
  pointerdown(handler) {
    return this._addEventHandler('pointerdown', handler);
  }
  pointerup(handler) {
    return this._addEventHandler('pointerup', handler);
  }
  pointermove(handler) {
    return this._addEventHandler('pointermove', handler);
  }
  pointerover(handler) {
    return this._addEventHandler('pointerover', handler);
  }
  pointerout(handler) {
    return this._addEventHandler('pointerout', handler);
  }
  pointerenter(handler) {
    return this._addEventHandler('pointerenter', handler);
  }
  pointerleave(handler) {
    return this._addEventHandler('pointerleave', handler);
  }

  // Collision events
  collisionStart(handler) {
    return this._addEventHandler('collisionStart', handler);
  }
  collisionActive(handler) {
    return this._addEventHandler('collisionActive', handler);
  }
  collisionEnd(handler) {
    return this._addEventHandler('collisionEnd', handler);
  }

  // Lifecycle events
  onDrop(handler) {
    return this._addEventHandler('onDrop', handler);
  }

  onUpdate(handler) {
    return this._addEventHandler('update', handler);
  }

  afterItemCollected(handler) {
    return this._addEventHandler('afterItemCollected', handler);
  }

  afterRemoveEntity(handler) {
    return this._addEventHandler('afterRemoveEntity', handler);
  }

  afterCreateEntity(handler) {
    return this._addEventHandler('afterCreateEntity', handler);
  }

  afterUpdateEntity(handler) {
    return this._addEventHandler('afterUpdateEntity', handler);
  }

  sutra(rules, config) {
    // TODO: This will overwrite Sutras as chain progresses left-to-right,
    // leaving only the last Sutra as active
    // TODO: merge rules existing sutra based on config ( default true )
    this.config.sutra = { rules, config };
    return this;
  }

  // TODO: better name for "exit" semantics
  exit(handler) {
    this.config.exit = handler;
    return this;
  }

  // Entity Flags - make this it's own system
  collectable(value = true) {
    this.config.collectable = value;
    return this;
  }

  // used for components like 'Input' or 'Button'
  value(value) {
    this.config.value = value;
    return this;
  }

  // Meta and Data
  meta(value) {
    if (typeof value === 'object' && value !== null) {
      if (typeof this.config.meta === 'object' && this.config.meta !== null) {
        this.config.meta = { ...this.config.meta, ...value };
      } else {
        this.config.meta = value;
      }
    }
    return this;
  }

  text(value) {
    this.config.text = value;
    return this;
  }

  // Positioning and movement
  position(x, y, z) {
    if (typeof x === 'number') {
      this.config.position.x = x;
    }
    if (typeof y === 'number') {
      this.config.position.y = y;
    }
    if (typeof z === 'number') {
      this.config.position.z = z;
    }
    return this;
  }

  // Sugar syntax for x,y,z positioning
  x(value) {
    this.config.position.x = value;
    return this;
  }
  y(value) {
    this.config.position.y = value;
    return this;
  }
  z(value) {
    this.config.position.z = value;
    return this;
  }

  items(value) {
    this.config.items = value;
    return this;
  }

  container(value) {
    this.config.container = value;
    return this;
  }

  origin(value) {
    // Map of origin positions to their relative offsets
    const origins = {
      'center': { x: 0.5, y: 0.5 },
      'top': { x: 0.5, y: 0 },
      'bottom': { x: 0.5, y: 1 },
      'left': { x: 0, y: 0.5 },
      'right': { x: 1, y: 0.5 },
      'top-left': { x: 0, y: 0 },
      'top-right': { x: 1, y: 0 },
      'bottom-left': { x: 0, y: 1 },
      'bottom-right': { x: 1, y: 1 }
    };
  
    const originOffset = origins[value];
    if (originOffset) {
      // Ensure the offset object exists
      if (typeof this.config.offset !== 'object' || this.config.offset === null) {
        this.config.offset = { x: 0, y: 0, z: 0 }; // Initialize with default values
      }
  
      // Adjust the existing offsets based on the origin
      // Assuming a default entity size to calculate the origin offset, adjust as needed
      const entitySize = this.config.size || { width: 16, height: 16, depth: 16 };
      const offsetX = entitySize.width * (originOffset.x - 0.5); // Subtracting 0.5 to center the origin
      const offsetY = entitySize.height * (originOffset.y - 0.5); // Subtracting 0.5 to center the origin
  
      // Add the calculated origin offsets to the existing offsets
      this.offset(this.config.offset.x + offsetX, this.config.offset.y + offsetY, this.config.offset.z);
    } else {
      console.warn(`Invalid origin value: '${value}'. Valid origins are center, top, bottom, left, right, top-left, top-right, bottom-left, bottom-right.`);
    }
  
    return this;
  }

  layout(globalOrigin, referenceDimensions) {
    // Default to screen size if referenceDimensions are not provided
    if (typeof referenceDimensions === 'undefined') {
      referenceDimensions = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      /*
      referenceDimensions = {
        width: game.width,
        height: game.height
      };
      */

    }
  
    // console.log("Reference Dimensions:", referenceDimensions);
  
    // Calculate the center of the screen in screen coordinates
    const screenCenter = {
      x: referenceDimensions.width / 2,
      y: referenceDimensions.height / 2
    };
  
    // Map of global origin positions to their function for calculating position
    // TODO: alias all pairs of top/bottom, left/right, center
    //       such that API is easy to use and understand
    const globalOrigins = {
      'center': () => ({ x: 0, y: 0 }), // Center of game coordinates
      'top-left': () => ({ x: -screenCenter.x, y: -screenCenter.y }),
      'top-center': () => ({ x: 0, y: -screenCenter.y }),
      'top-right': () => ({ x: screenCenter.x, y: -screenCenter.y }),
      'bottom-left': () => ({ x: -screenCenter.x, y: screenCenter.y }),
      'bottom-center': () => ({ x: 0, y: screenCenter.y }),
      'bottom-right': () => ({ x: screenCenter.x, y: screenCenter.y }),
      'center-left': () => ({ x: -screenCenter.x, y: 0 }),
      'center-right': () => ({ x: screenCenter.x, y: 0 })
    };
  
    const calculatePosition = globalOrigins[globalOrigin];
    if (calculatePosition) {
      // Calculate the position based on the global origin
      const position = calculatePosition();
  
      // calculate offset based on origin to keep relative center position
      if (globalOrigin === 'top-left') {
        //position.x = position.x + (this.config.size.width / 2);
        //position.y = position.y + (this.config.size.height / 2);
      }
      if (globalOrigin === 'top-center') {
        //position.y = position.y + (this.config.size.height / 2);
      }
      if (globalOrigin === 'top-right') {
        //position.x = position.x - (this.config.size.width / 2);
        //position.y = position.y + (this.config.size.height / 2);
      }

      if(globalOrigin === 'bottom-left') {
       // position.x = position.x + (this.config.size.width / 2);
       // position.y = position.y + (this.config.size.height / 2);
      }

      // Update the entity's position by converting screen space to game space
      this.position(position.x, position.y);
    } else {
      console.warn(`Invalid global origin value: '${globalOrigin}'. Valid global origins are center, top-left, top-center, top-right, bottom-left, bottom-center, bottom-right, center-left, center-right.`);
    }
  
    return this;
  }
  


  offset(x, y, z) {
    if (typeof this.config.offset !== 'object' || this.config.offset === null) {
      this.config.offset = {};
    }
    if (typeof x === 'number') {
      this.config.offset.x = x;
    }
    if (typeof y === 'number') {
      this.config.offset.y = y;
    }
    if (typeof z === 'number') {
      this.config.offset.z = z;
    }
    return this;
  }


  // Finalization
  build() {
    // Return a deep copy to prevent further modifications
    return this.config;
  }

  // Creates *exact* copies of the entity with the specified configuration
  clone(count) {
    this.config.clone = count;
    return this;
  }

  // Creates a copy of the entity with the specified configuration, but will apply
  // all "repeaters" with index and count arguments, allowing for dynamic modifications
  // separately, the offset.x and offset.y will add to the position
  repeat(count) {
    this.config.repeat = count;
    return this;
  }

  // TOOD: we should remove most of this, it should be in build
  // this will result in build sometimes returning array of objects
  // offset set / repeat / clone / etc
  createEntity() {
    const applyOffset = (config, index = 1) => {
      // Apply the offset to the position based on the index
      config.position.x += (config.offset.x) * index;
      config.position.y += (config.offset.y) * index;
      config.position.z += (config.offset.z) * index;
    };
  
    if (typeof this.config.clone === 'number') {
      let entities = [];
      for (let i = 0; i < this.config.clone; i++) {
        let clonedConfig = { ...this.config }; // Shallow copy for non-function properties
        applyOffset(clonedConfig); // No index needed for clones, as they are exact copies
        entities.push(this.game.createEntity(clonedConfig));
      }
      return entities;
    } else if (typeof this.config.repeat === 'number') {
      let entities = [];
      for (let i = 0; i < this.config.repeat; i++) {
        let entityConfig = { ...this.config }; // Shallow copy for non-function properties
        // TODO: return cloned offset, cannot mutate like this? double check, tests would be good
        applyOffset(entityConfig, i); // Apply offset based on the index for repeated entities
  
        if (typeof this.repeatModifiers === 'object' && this.repeatModifiers !== null) {
          for (let [prop, modifier] of Object.entries(this.repeatModifiers)) {
            if (typeof modifier === 'function') {
              entityConfig[prop] = modifier(i, this.config.repeat, entityConfig[prop]);
            }
          }
        }
        // Remove repeat-related properties to avoid infinite recursion and irrelevant data
        delete entityConfig.repeat;
        delete entityConfig.repeatModifiers;
        entities.push(this.game.createEntity(entityConfig));
      }
      return entities;
    } else {
      let singleConfig = { ...this.config }; // Shallow copy for non-function properties
      applyOffset(singleConfig); // Apply offset for a single entity
      let singleCreatedEntity = this.game.createEntity(singleConfig);
      // TOOD: remove this from EntityBuilder, place in createEntity()
      if (singleCreatedEntity.type === 'PLAYER' || singleCreatedEntity.type === 'Player') {
        // TODO: check to see if there are no other active players / if so set this one
        this.game.setPlayerId(singleCreatedEntity.id);
      }
      return singleCreatedEntity;
    }
  }

  repeaters(modifiers) {
    this.repeatModifiers = modifiers;
    return this;
  }

  mix(mixinConfig) {
    for (let key in mixinConfig) {
      let value = mixinConfig[key];
      if (typeof value === 'function') {
        // Check if a composite function already exists for this key
        if (typeof this.config[key] !== 'function') {
          // Define the composite function
          this.config[key] = (...handlerArgs) => {
            this.config[key].handlers.forEach(handler => handler(...handlerArgs));
          };
          // Initialize with an empty handlers array
          this.config[key].handlers = [];
        }
        // Add the new handler to the composite function's handlers array
        // TODO: this may not work as intended? add more entity mixin tests
        this.config[key].handlers.push(value);
      } else if (typeof value === 'object' && this.config[key] && typeof this.config[key] === 'object') {
        // For object types, merge the objects
        this.config[key] = { ...this.config[key], ...value };
      } else {
        // For color types, blend the colors
        if (key === 'color') {
          if (this.config[key] !== undefined) {
            const existingColor = ensureColorInt(this.config[key]);
            const newColor = ensureColorInt(value);
            value = blendColors(existingColor, newColor);
          }
        }
        // TODO we can add a merge / mix strategy for other types
        // For position we could average, hi-low, etc
        // For primitive types or new keys, simply overwrite/set the value
        this.config[key] = value;
      }
    }
    return this; // Enable chaining
  }
}

function blendColors(color1, color2) {
  const r = (((color1 >> 16) & 0xFF) + ((color2 >> 16) & 0xFF)) >> 1;
  const g = (((color1 >> 8) & 0xFF) + ((color2 >> 8) & 0xFF)) >> 1;
  const b = ((color1 & 0xFF) + (color2 & 0xFF)) >> 1;
  return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
}

/* TODO: refactor to store Map() of OG references for granular removals / updates

// Initialize a map to keep track of original handlers for each composite function
const originalHandlersMap = new Map();

_addEventHandler(eventName, handler) {
    // Check if the event already has a composite function with handlers
    if (typeof this.config[eventName] === 'function' && Array.isArray(this.config[eventName].handlers)) {
        if (typeof handler === 'undefined') {
            throw new Error(`Handler for ${eventName} event is undefined`);
        }
        this.config[eventName].handlers.push(handler); // Add to existing handlers
        // Update the map with the new set of handlers for the composite function
        originalHandlersMap.set(this.config[eventName], this.config[eventName].handlers.slice());
    } else {
        if (typeof handler === 'boolean') {
            this.config[eventName] = handler;
        }
        if (typeof handler === 'function') {
            // Otherwise, create a new composite function and handlers array
            const handlers = [handler];
            const compositeFunction = (...args) => {
                try {
                    handlers.forEach(function(h) {
                        if (typeof h === 'function') {
                            h(...args);
                        } else {
                            console.warn("handler is not a function", h, args);
                        }
                    }); // Execute all handlers
                } catch (err) {
                    console.error(`Error in event handler for ${eventName}:`, err);
                }
            };
            this.config[eventName] = compositeFunction;
            this.config[eventName].handlers = handlers; // Store handlers

            // Map the composite function to its original handlers
            originalHandlersMap.set(compositeFunction, handlers);
        }
    }

    return this;
}


_removeEventHandler(eventName, handler) {
    // Check if the event for the given name exists and has handlers
    if (typeof this.config[eventName] === 'function' && Array.isArray(this.config[eventName].handlers)) {
        // Retrieve the composite function for the eventName
        const compositeFunction = this.config[eventName];

        // Retrieve the original handlers from the map using the composite function
        const originalHandlers = originalHandlersMap.get(compositeFunction);

        if (originalHandlers) {
            // Find the index of the handler to be removed
            const index = originalHandlers.findIndex(h => h === handler);

            // If the handler is found, remove it from the array of original handlers
            if (index !== -1) {
                originalHandlers.splice(index, 1);

                // Update the handlers array in the config to reflect the removal
                this.config[eventName].handlers = originalHandlers.slice();

                // Update the map to reflect the new set of handlers
                originalHandlersMap.set(compositeFunction, this.config[eventName].handlers);

                // If after removal, there are no handlers left, consider cleaning up
                if (originalHandlers.length === 0) {
                    // Remove the composite function and clean up the map
                    delete this.config[eventName];
                    originalHandlersMap.delete(compositeFunction);
                }
            }
        }
    }
}

*/