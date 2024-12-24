import EntityClass from './EntityClass.js';
import Component from './Component.js';

export default class Entity {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.bp.components = {};
        this.bp.addComponent = this.addComponent.bind(this);
        this.bp.getComponent = this.getComponent.bind(this);

        let _entity = new EntityClass(bp, options);
        _entity.init(bp);
        console.log('Entity created', _entity);


        return this;
    }

    async init() {


        return 'loaded entity';
    }

    addComponent(entityId, componentType, data) {

        if (!this.bp.components[componentType]) {
          this.bp.components[componentType] = new Component(componentType, this.bp);
        }
        // Initialize an empty map for the actionRateLimiter component
        // TODO: remove this hard-coded check for actionRateLimiter
        if (componentType === 'actionRateLimiter') {
          data = new Map();
        }
    
        if (data == null) {
          return;
        }
    
        this.bp.components[componentType].set(entityId, data);
      }

      getComponent(entityId, componentType) {
        if (this.bp.components.hasOwnProperty(componentType)) {
          return this.bp.components[componentType].get(entityId);
        }
        return null;
      }
    
    
}
