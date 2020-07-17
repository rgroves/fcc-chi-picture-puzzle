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

  moveTileIntoCellAtPosition(targetTile, openTileCellNumber);
  moveTileIntoCellAtPosition(openTile, fromCellNumber);
}

puzzle.addEventListener("click", puzzleClickHandler);
