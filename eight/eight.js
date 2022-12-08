import fs from "fs";

export const eight = () => {
  const input = fs.readFileSync("./eight/8.txt", "utf8");

  const lines = input.split("\n");

  const grid = lines.map((line) => line.split(""));

  let counter = (lines.length - 2) * 2 + lines[0].length * 2;

  for (let i = 1; i < grid.length - 1; i++) {
    for (let j = 1; j < grid[0].length - 1; j++) {
      if (isVisible(grid, i, j)) counter++;
    }
  }

  let max = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const res = getVisibilityScore(grid, i, j);
      if (res > max) max = res;
    }
  }

  console.log(max);
};

const isVisible = (grid, i, j) => {
  const currentValue = grid[i][j];
  let isVisibleRight = true;
  let isVisibleLeft = true;
  let isVisibleUp = true;
  let isVisibleDown = true;

  for (let k = j + 1; k < grid[0].length; k++) {
    if (grid[i][k] >= currentValue) {
      isVisibleRight = false;
      break;
    }
  }
  for (let k = 0; k < j; k++) {
    if (grid[i][k] >= currentValue) {
      isVisibleLeft = false;
      break;
    }
  }
  for (let k = 0; k < i; k++) {
    if (grid[k][j] >= currentValue) {
      isVisibleUp = false;
      break;
    }
  }
  for (let k = i + 1; k < grid.length; k++) {
    if (grid[k][j] >= currentValue) {
      isVisibleDown = false;
      break;
    }
  }

  return isVisibleRight || isVisibleLeft || isVisibleUp || isVisibleDown;
};

const getVisibilityScore = (grid, i, j) => {
  const currentValue = grid[i][j];
  let score = 1;

  if (j < grid[0].length - 1) {
    let temp = 0;
    for (let k = j + 1; k < grid[0].length; k++) {
      temp++;
      if (grid[i][k] >= currentValue) {
        break;
      }
    }

    score *= temp;
  }

  if (j > 0) {
    let temp = 0;
    for (let k = j - 1; k >= 0; k--) {
      temp++;
      if (grid[i][k] >= currentValue) {
        break;
      }
    }

    score *= temp;
  }

  if (i > 0) {
    let temp = 0;
    for (let k = i - 1; k >= 0; k--) {
      temp++;

      if (grid[k][j] >= currentValue) {
        break;
      }
    }

    score *= temp;
  }

  if (i < grid.length - 1) {
    let temp = 0;
    for (let k = i + 1; k < grid.length; k++) {
      temp++;
      if (grid[k][j] >= currentValue) {
        break;
      }
    }

    score *= temp;
  }

  return score;
};
