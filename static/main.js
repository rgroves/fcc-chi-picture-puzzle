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
