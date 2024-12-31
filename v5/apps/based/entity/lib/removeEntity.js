// TODO: double check that all components values are being cleared on removal of ent
export default function removeEntity(entityId, removeFromGameData = true) {

  let ent = this.game.entities.get(entityId);

  if (!ent) {
    return;
  }

  let _afterRemoveEntity;

  if (typeof ent.afterRemoveEntity === 'function') {
    _afterRemoveEntity = ent.afterRemoveEntity;
  }

  let canBeRemoved = this.game.lifecycle.triggerHook('before.removeEntity', ent);

  if (canBeRemoved === false) {
    return;
  }

  if (ent && this.game.systems.graphics && ent.graphics) {
    // Is this best done here? or in the graphics plugin?
    this.game.systems.graphics.removeGraphic(entityId);
  }
  if (ent) {
    this.game.components.destroyed.set(entityId, true);

    // check to see if any timers exist, if so clear them all
    if (this.game.components.timers.get(entityId)) {
      let timers = this.game.components.timers.get(entityId);
      for (let timerId in timers.timers) {
        timers.removeTimer(timerId);
      }
    }

    // update the entity with the destroyed state
    let updatedEntity = this.game.getEntity(entityId);
    this.game.entities.set(entityId, updatedEntity);

    if (updatedEntity) {
      // actually remove the entity from the game world
      // will be set to false for field of view related removals
      if (removeFromGameData) {
        if (this.game.systems.rbush) {
          this.game.systems.rbush.removeEntity(updatedEntity);
        }
        delete this.game.deferredEntities[entityId];
      }
    }

  }

  if (_afterRemoveEntity) {
    _afterRemoveEntity(ent);
  }
  this.game.lifecycle.triggerHook('after.removeEntity', ent);

}