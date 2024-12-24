// TODO: add events

class SystemsManager {
  constructor(game) {
    this.game = game;
    this.systems = new Map();
  }

  addSystem(systemId, system) {
    if (this.systems.has(systemId)) {
      // throw new Error(`System with name ${systemId} already exists!`);
      console.log(`Loading ${systemId} from memory...`);
      return;
    }

    /*
        All Plugins are event emitters feature ( DISABLED )
        // Remark: Defaulting all Plugins to event emitters is disabled for now by default
        // This is disabled for performance reasons, some of these methods are high frequency
        // and there is wildcard search logic enabled by default? It's a bit much on performance for all enabled
        // In the future we can add a config option per Plugin and per Plugin method to enable/disable this
        // This will enable all plugin methods as emitted events

        // eventEmitter.bindClass(system, systemId)

    */

    // All Plugins have Lifecycle Hooks feature ( ENABLED DEFAULT )
    // Remark: See: ./Game/Lifecyle.js for Mantra Lifecycle Hooks
    // register the system methods as Lifecycle hooks
    if (this.game.config.addLifecycleHooksToAllPlugins) {

      const allProps = Object.getOwnPropertyNames(Object.getPrototypeOf(system));

      for (const propName of allProps) {
        const originalMethod = system[propName];
        if (typeof originalMethod === 'function' && propName === 'fireBullet') {
          // Found the method
          // console.log(`Method ${propName} found.`);
      
          // Initialize hooks if they don't already exist
          this.game.lifecycle.hooks[`before.${systemId}.${propName}`] = this.game.lifecycle.hooks[`before.${systemId}.${propName}`] || [];
          this.game.lifecycle.hooks[`after.${systemId}.${propName}`] = this.game.lifecycle.hooks[`after.${systemId}.${propName}`] || [];
      
          // Wrap the original method in a function that includes the lifecycle hooks
          system[propName] = function(arg1 = {}, arg2 = {}, arg3 = {}) {
            // Trigger the 'before' hook with up to three arguments
            this.game.lifecycle.triggerHook(`before.${systemId}.${propName}`, arg1, arg2, arg3);
      
            // Call the original method with up to three arguments
            const result = originalMethod.call(this, arg1, arg2, arg3);
      
            // Trigger the 'after' hook with up to three arguments
            this.game.lifecycle.triggerHook(`after.${systemId}.${propName}`, arg1, arg2, arg3);
      
            // Return the original method's result
            return result;
          }.bind(system); // Ensure 'this' within the wrapped function refers to the system object
        }
      }
    }

    // binds system to local instance Map
    this.systems.set(systemId, system);
    // binds system to game.systems scope for convenience
    this.game.systems[systemId] = system;
    //console.log(`system[${systemId}] = new ${system.name}()`);
    //console.log(`game.use(new ${system.name}())`);
  }

  removeSystem(systemId) {
    if (!this.systems.has(systemId)) {
      //throw new Error(`System with name ${systemId} does not exist!`);
      console.log(`Warning: System with name ${systemId} does not exist!`)
      return;
    }
    // call the system.unload method if it exists
    const system = this.systems.get(systemId);
    if (typeof system.unload === "function") {
      system.unload();
    }
    this.systems.delete(systemId);


    // Remark: Special scope used for plugins, we can probably remove this or rename it
    if (this.game._plugins[systemId]) {
      delete this.game._plugins[systemId];
    }

    // we may want to remove the extra game.systems scope? or reference directly to the map?
    delete this.game.systems[systemId];
  }

  getSystem(systemId) {
    if (this.systems.has(systemId)) {
      return this.systems.get(systemId);
    }
    throw new Error(`System with name ${systemId} does not exist! Perhaps try running "game.use(new plugins.${systemId}())" first?`);
  }

  update(deltaTime) {
    for (const [_, system] of this.systems) {
      if (typeof system.update === "function") {

        // check to see if the game is paused, if not, skip updates for systems without flag
        if (this.game.paused) {
          continue;
        }
        system.update(deltaTime);
      }
    }
  }

  // Remark: Render control is being handled by graphics and each adapter
  // TODO: Add test coverage and formalize rendering through this method, it is required for helpers developers customizerendering
  render() {
    /*
    const renderSystem = this.systems.get('render');
    if (renderSystem && typeof renderSystem.render === "function") {
      renderSystem.render();
    }
    */
  }

}

export default SystemsManager;