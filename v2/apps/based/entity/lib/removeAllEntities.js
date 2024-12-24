export default function removeAllEntities(options) {

  // curry arguments, legacy API
  let clearCurrentPlayer = false;
  let excludeByName = [];
  if (typeof options === 'boolean') {
    clearCurrentPlayer = options;
  }

  if (typeof options === 'object' && Array.isArray(options.excludeByName)) {
    excludeByName = options.excludeByName;
  }

  if (this.game.data.ents) {
    for (let eId in this.game.data.ents._) {
      let ent = this.game.data.ents._[eId];
      // Do not remove the current player if clearCurrentPlayer is false
      if (ent.id === this.game.currentPlayerId && !clearCurrentPlayer) {
        continue;
      }
      // Do not remove entities that are excluded by name
      if (excludeByName.includes(ent.name)) {
        continue;
      }
      if (ent && ent.yCraft && ent.yCraft.part && ent.yCraft.part.unload) {
        ent.yCraft.part.unload();
      }
      this.game.removeEntity(ent.id);
    }
  
    if (clearCurrentPlayer) {
      this.game.currentPlayerId = null;
    }

  }

}