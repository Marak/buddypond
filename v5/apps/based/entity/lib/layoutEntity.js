// TODO: needs to be able to attach by container/entity id or name, not just by name
export default function layoutEntity(container, entityId) {

  let containerEnt = this.game.findEntity(container); // Adjust this line to match how you access the boss entity

  if (!containerEnt) {
    throw new Error('Container not found: ' + container);
  }
  let containerPosition = containerEnt.position || { x: 0, y: 0, z: 0 };
  // console.log('found container ent to work with', containerEnt);

  let layoutType = 'none'; // 'none', 'grid', 'flex', 'stack', 'custom-function'
  let origin = 'center'; // 'center', 'bottom-right', 'top-right', 'bottom-left', 'center-left', 'center-right', 'top-center', 'bottom-center', 'top-left'

  // Legacy API, don't pollute style scope with new / unknown  properties
  if (containerEnt.style && containerEnt.style.layout) {
    layoutType = containerEnt.style.layout;
  }
  if (containerEnt.style && containerEnt.style.origin) {
    origin = containerEnt.style.origin;
  }

  // New API
  if (containerEnt.meta && containerEnt.meta.layout) {
    layoutType = containerEnt.meta.layout;
  }

  //
  // Add the current new entity id to the container items
  //
  if (!containerEnt.items) {
    containerEnt.items = [];
  }
  containerEnt.items.push(entityId); // Remark: We are not saving the associations here?

  // TODO: add better support for 1:1 flex mapping
  if (layoutType === 'flex') {
    const flexConfig = containerEnt.meta.flex || containerEnt.style.flex; // Assuming flex config is stored here
    const items = containerEnt.items.map(itemId => this.game.getEntity(itemId));
    applyFlexLayout.call(this, containerEnt, items, flexConfig);
  } else if (layoutType === 'grid') {
    const gridConfig = containerEnt.meta.grid || containerEnt.style.grid; // Assuming grid config is stored here
    const items = containerEnt.items.map(itemId => this.game.getEntity(itemId));
    applyGridLayout.call(this, containerEnt, items, gridConfig);
  }

  //
  // Default / no layout indicates relative position from top left origin ( -1, -1 )
  // Remark: May want to add custom origins such as center ( 0, 0 ) or bottom right ( 1, 1 ), etc
  //
  if (layoutType === 'none') {
    // Retrieve the entity to be positioned
    let entity = this.game.getEntity(entityId);

    // Check if entity exists
    if (!entity) {
      console.error('Entity not found: ' + entityId);
      return;
    }

    // When the origin should be centered, calculate offsets to position the entity's center at the container's center
    let offsetX = entity.position.x; // Centered horizontally
    let offsetY = entity.position.y; // Centered vertically
    // If the origin is explicitly set to 'top-left', adjust offsets to position the top-left corner of the entity at the container's center
    // TODO: fix this and move to separate file / sub-system for layout / flex styles / etc
    if (origin === 'top-left') {
      offsetX = -entity.size.width / 2;
      offsetY = -entity.size.height / 2;
    } else {
      // For a centered origin, adjust so the entity's center aligns with the container's center
      offsetX -= entity.size.width / 2;
      offsetY -= entity.size.height / 2;
    }

    // Calculate the cumulative position of the container to account for nesting
    // TODO: traverse up the container hierarchy to get the cumulative position
    // let cumulativeContainerPosition = getCumulativePosition(containerEnt);
    let cumulativeContainerPosition = containerEnt.position;
    
    // Calculate the entity's new position relative to the cumulative container position
    let newPosition = {
      x: cumulativeContainerPosition.x + (origin === 'top-left' ? -entity.size.width / 2 : -entity.size.width / 2),
      y: cumulativeContainerPosition.y + (origin === 'top-left' ? -entity.size.height / 2 : -entity.size.height / 2),
      z: containerPosition.z // Assuming z-index remains constant or is managed elsewhere
    };


    newPosition.x = containerPosition.x + offsetX;
    newPosition.y = containerPosition.y + offsetY;

    // Update the entity's position
    this.game.updateEntity({ id: entityId, position: newPosition });

    // Log for debugging purposes
    // console.log(`Entity ${entityId} positioned at (${newPosition.x}, ${newPosition.y}, ${newPosition.z}) relative to container`);
  }


  //
  // Layout container items using grid layout algorithm
  //

  if (layoutType === 'grid') {

    let cols = containerEnt.meta.grid.columns || 1;
    let rows = containerEnt.meta.grid.rows || 1;

    if (containerEnt.style && containerEnt.style.grid) {
      cols = containerEnt.style.grid.columns || cols;
      rows = containerEnt.style.grid.rows || rows;
    }

    if (typeof cols !== 'number' || typeof rows !== 'number') {
      console.log('containerEnt.layout', containerEnt.layout);
      throw new Error('Grid layout requires cols and rows to be numbers');
    }

    //console.log("ahhhhhhhhhh", cols, rows)
    // get all the other items in the container
    let containerItems = containerEnt.items || [];

    // call game.getEntity() for each item to get its size and position
    // Remark: use components api to only fetch the necessary components ( instead of entire ent )
    containerItems = containerItems.map((itemId) => {
      return this.game.getEntity(itemId);
    });

    let containerSize = containerEnt.size;

    // Calculate the width and height for each grid cell
    let cellWidth = containerSize.width / cols;
    let cellHeight = containerSize.height / rows;
    //alert(containerSize.width)
    //alert(containerSize.height)

    // Loop through each item in the container
    containerItems.forEach((item, index) => {
      // Calculate the row and column for the current item based on its index
      let row = Math.floor(index / cols);
      let col = index % cols;

      // skip if item is not found
      if (!item) {
        // Remark: This should *not* happen, investigate why index is null value
        console.log('warning: item not found in container', index, item)
        return;
      }

      let paddingTop = 0;
      let paddingLeft = 0;
      // Set the starting position to the top-left corner of the container's bounding box
      let positionX = containerPosition.x - containerSize.width / 2 + paddingLeft;
      let positionY = containerPosition.y - containerSize.height / 2 + paddingTop;
      let positionZ = containerPosition.z;

      // Calculate the position for the current item, aligning the center of the entity with the center of the grid cell
      let itemPosition = {
        x: positionX + (col * cellWidth) + (cellWidth / 2), // Center of the grid cell
        y: positionY + (row * cellHeight) + (cellHeight / 2), // Center of the grid cell
        z: item.position.z // Assuming z-index remains constant or is managed elsewhere
      };

      // Update the entity's position using the game framework's method
      this.game.updateEntity({ id: item.id, position: itemPosition }, {
        skipAfterUpdateEntity: true
      });

      // console.log(`Item ${item.id} positioned at row ${row}, column ${col}`);
    });

    // console.log('adding item to container using grid layout algorithm');
  }

  //
  // Layout container items using stack layout algorithm
  //
  if (layoutType === 'stack') {
    // Define stack offset values
    let stackOffsetX = 0; // Horizontal offset for each stacked item
    let stackOffsetY = 5; // Vertical offset for each stacked item


    // Retrieve the entity to be positioned
    let entity = this.game.getEntity(entityId);

    // Check if entity exists
    if (!entity) {
      console.error('Entity not found: ' + entityId);
      return;
    }

    // TODO: we could add multiple ways to stack here by cardinal direction or custom function
    // default stack top to bottom using entity size
    stackOffsetY = entity.size.height + 5;


    // Determine the stack position based on the number of items already in the container
    let stackIndex = containerEnt.items.length - 1; // -1 because we've already added the new entityId to containerEnt.items

    // Calculate the entity's new position based on stack index and offsets
    let newPosition = {
      x: containerPosition.x + stackIndex * stackOffsetX,
      y: containerPosition.y + stackIndex * stackOffsetY,
      z: containerPosition.z // Assuming z-index remains constant or is managed elsewhere
    };

    // Update the entity's position
    this.game.updateEntity({ id: entityId, position: newPosition });

    // Log for debugging purposes
    console.log(`Entity ${entityId} stacked at index ${stackIndex} with position (${newPosition.x}, ${newPosition.y}, ${newPosition.z}) relative to container`);
  }

  //
  // Layout container items using custom function
  //
  if (typeof layoutType === 'function') {
    console.log('adding item to container using custom layout algorithm');
    throw new Error('Custom layout algorithm functions are yet implemented!')
  }

}

function applyFlexLayout(container, items, layoutConfig) {
  const { flexDirection = 'row', justifyContent = 'flex-start', alignItems = 'center' } = layoutConfig;
  const isRow = flexDirection.includes('row');
  const mainSize = isRow ? 'width' : 'height';
  const crossSize = isRow ? 'height' : 'width';
  const mainStart = isRow ? 'x' : 'y';
  const crossStart = isRow ? 'y' : 'x';

  let mainAxisCurrentPosition = 0;
  let crossAxisPosition = 0; // This can be adjusted for alignItems other than 'center'

  for (const item of items) {
    // Position each item along the main axis
    item.position[mainStart] = mainAxisCurrentPosition;
    // Adjust main axis position for the next item
    mainAxisCurrentPosition += item.size[mainSize];

    // Align items along the cross axis
    switch (alignItems) {
      case 'flex-start':
        item.position[crossStart] = 0;
        break;
      case 'flex-end':
        item.position[crossStart] = container.size[crossSize] - item.size[crossSize];
        break;
      case 'center':
      default:
        item.position[crossStart] = (container.size[crossSize] - item.size[crossSize]) / 2;
        break;
    }

    // Update the entity's position in the game
    this.game.updateEntity({ id: item.id, position: item.position });
  }
}

function applyGridLayout(container, items, layoutConfig) {
  const { gridTemplateColumns = '1fr', gridTemplateRows = '1fr' } = layoutConfig;
  const cols = gridTemplateColumns.split(' ').length; // Simplified assumption
  const rows = Math.ceil(items.length / cols);

  const cellWidth = container.size.width / cols;
  const cellHeight = container.size.height / rows;

  items.forEach((item, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    item.position.x = col * cellWidth;
    item.position.y = row * cellHeight;

    // Update the entity's position in the game
    this.game.updateEntity({ id: item.id, position: item.position });
  });
}


// Function to calculate the cumulative position of a container
function getCumulativePosition(container) {
  let position = { x: container.position.x, y: container.position.y, z: container.position.z };

  if (!container.container) {
    return position;
  }
  let parentContainer = game.getEntityByName(container.container); // Assuming there's a way to access the parent container

  if (parentContainer) {
    position.x += parentContainer.position.x;
    position.y += parentContainer.position.y;
    // Assuming z-index remains constant or is managed elsewhere, so not accumulating z
    parentContainer = parentContainer.parent; // Move up to the next parent container
  }

  return position;
}
