export default function getEntity(entityId) {
    
  if (typeof entityId === 'string') {
    entityId = parseInt(entityId); // for now, this can be removed when we switch Component.js to use Maps
  }

  if (!this.bp.entities.has(entityId)) {
    return null;
  }

  const entity = {};

  // Iterate over all registered components and fetch their data if available
  for (const componentType in this.bp.components) {
    let componentData = this.bp.getComponent(entityId, componentType);
    if (typeof componentData !== 'undefined' && componentData !== null) {
      entity[componentType] = componentData;
    }
  }

  if (Object.keys(entity).length === 0) {
    return null;
  }

  entity.id = entityId;

  return entity;

}