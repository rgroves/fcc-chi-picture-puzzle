"use strict";

// Get a refernce to the node that contains the puzzle.
let puzzle = document.getElementById("puzzle");

// Get a reference to a collection of all of the cells in the puzzle grid.
let allCells = puzzle.querySelectorAll("div[data-cell-number]");

// Get a reference to a collection of all of the tiles within the puzzle grid.
let allTiles = puzzle.querySelectorAll("div.tile");

// Get a reference to the open tile.
let openTile = puzzle.querySelector("div.tile-open");

// Get the computed styles so that the grid column count and row count can be
// retrieved from the CSS property values that indicate how many rows and
// columns the grid should contain.
let rootStyles = window.getComputedStyle(document.documentElement);

let gridColumns = rootStyles.getPropertyValue("--grid-column-count");
gridColumns = Number(gridColumns);

let gridRows = rootStyles.getPropertyValue("--grid-row-count");
gridRows = Number(gridRows);

// Calculate the total number of tiles in the puzzle grid (rows times columns).
let tileCount = gridRows * gridColumns;

//==============================================================================
// Helper function to get a specific tile by it's tile number.
//==============================================================================
function getTile(tileNumber) {
  return allTiles[tileNumber - 1];
}

//==============================================================================
// Helper function to get a specific cell by it's cell number.
//==============================================================================
function getCell(cellNumber) {
  return allCells[cellNumber - 1];
}

//==============================================================================
// Helper function to move tile into the cell referenced by cell number.
//==============================================================================
function moveTileIntoCellAtPosition(tile, cellNumber) {
  let targetCell = getCell(cellNumber);

  if (targetCell.firstElementChild) {
    targetCell.replaceChild(tile, targetCell.firstElementChild);
  } else {
    targetCell.appendChild(tile);
  }
}

//==============================================================================
// This function determines which cell numbers are to be considered valid moves
// based upon the current location (cell number) of where the open tile resides.
//==============================================================================
function getValidMoves(openTileCellNumber) {
  // The candidates array will hold the cell numbers that are considered to be
  // valid possible moves a player can make—meaning only tiles that reside in a
  // cell whose cell number ends up in this array should be considered
  // "slideable tiles" that a player can click on to make a move.
  let candidates = [];

  // As long as the current location of the open tile is not a cell in the top
  // row, consider the cell above to be valid. Note that cell numbers in the top
  // row will range from 1 to the value stored in gridColumns.
  if (openTileCellNumber > gridColumns) {
    // Add the cell number located above the current open tile cell to the
    // valid moves candidate list.
    candidates.push(openTileCellNumber - gridColumns);
  }

  // As long as the current location of the open tile is not a cell in the
  // bottom row, consider the cell below to be valid. Note that cell numbers in
  // the bottom row will range from (tileCount - gridColumns + 1) to tileCount.
  if (openTileCellNumber < tileCount - gridColumns + 1) {
    // Add the cell number located below the current open tile cell to the
    // valid moves candidate list.
    candidates.push(openTileCellNumber + gridColumns);
  }

  // As long as the current location of the open tile is not a cell in the
  // rightmost column, consider the cell to the right to be valid. Note that
  // cell numbers in the right column will be evenly divisible by gridColumns.
  if (openTileCellNumber % gridColumns !== 0) {
    // Add the cell number located to the right of the current open tile cell to
    // the valid moves candidate list.
    candidates.push(openTileCellNumber + 1);
  }

  // As long as the current location of the open tile is not a cell in the
  // leftmost column, consider the cell to the left to be valid. Note that
  // cell numbers in the left column will have a remainder of 1 if divied by
  // gridColumns.
  if (openTileCellNumber % gridColumns !== 1) {
    // Add the cell number located to the left of the current open tile cell to
    // the valid moves candidate list.
    candidates.push(openTileCellNumber - 1);
  }

  // Return the candidate list of cell numbers that are valid possible moves.
  return candidates;
}

//==============================================================================
// This function performs the movement of a tile when a player clicks on it.
//==============================================================================
function puzzleClickHandler(event) {
  // Save a reference to the clicked element.
  let targetTile = event.target;

  // Adjust for if the tile's hint was clicked instead of the tile itself.
  if (
    targetTile.tagName === "SPAN" &&
    targetTile.classList.contains("tile-hint")
  ) {
    // Make the target tile the parent element, which should be the tile
    // the clicked hint belongs to.
    targetTile = targetTile.parentElement;
  }

  // If what was clicked was not a valid tile or if the open tile was clicked,
  // ignore click and exit.
  if (!targetTile.classList.contains("tile") || targetTile === openTile) {
    return;
  }

  // Get the number of the cell where the clicked tile resides.
  let fromCellNumber = targetTile.parentElement.dataset.cellNumber;
  fromCellNumber = Number(fromCellNumber);

  // Get the number of the cell where the open tile resides.
  let openTileCellNumber = openTile.parentElement.dataset.cellNumber;
  openTileCellNumber = Number(openTileCellNumber);

  // Generate the list of valid moves.
  let validMoves = getValidMoves(openTileCellNumber);

  // Move the tile only if the tile that was clicked was in a cell with a cell
  // number in the list of valid moves.
  if (validMoves.includes(fromCellNumber)) {
    moveTileIntoCellAtPosition(targetTile, openTileCellNumber);
    moveTileIntoCellAtPosition(openTile, fromCellNumber);
  }
}

//==============================================================================
// This function will return an array of randomly shuffled tile numbers to be
// used to place tiles within the puzzle grid cells.
//==============================================================================
function generateShuffledTileOrder(totalGridCells) {
  // The tileOrder array will contain a number for each non-open tile.
  // The ordered elements in this array will map to the cell numbers in the
  // puzzle grid. This means the value at index 0 will be the tile number that
  // should be placed in cell number 1. The value at index 1 is the tile number
  // that should be placed in cell number 2, and so on for all values in the
  // array.
  let tileOrder = [];

  // Decrement the total cell count by one to account for the one open tile
  // that will remain in the lower right corner of the puzzle grid and should
  // not be shuffled around.
  let numberOfTiles = totalGridCells - 1;

  // Fill the array with the tile numbers 1 through numberOfTiles.
  for (let i = 1; i <= numberOfTiles; i++) {
    tileOrder.push(i);
  }

  // Perform a "weak" shuffle by sorting the array and using a compare callback
  // function that generates a random number between -0.5 and +0.499 in order to
  // force the sort to use a "random" order.
  tileOrder.sort((a, b) => Math.random() - 0.5);

  return tileOrder;
}

//==============================================================================
// This function makes the puzzle playable by shuffling the tile order and
// wiring up the click handler which allows the player to move tiles.
//==============================================================================
function initializePuzzle() {
  // Place tiles in a random order.
  let tileOrder = generateShuffledTileOrder(tileCount);

  tileOrder.forEach((tileNumber, idx) => {
    let cellNumber = idx + 1;
    let tile = getTile(tileNumber);

    moveTileIntoCellAtPosition(tile, cellNumber);
  });

  // The open tile is not being randomized and should always start in the last
  // cell (which will have a cell number equal to the number of puzzle tiles).
  moveTileIntoCellAtPosition(openTile, tileCount);

  // Setup click handler for tiles.
  puzzle.addEventListener("click", puzzleClickHandler);
}

//==============================================================================
// Call the function that gets the puzzle ready and makes the game playable.
//==============================================================================
// Initialize the puzzle.
initializePuzzle();
