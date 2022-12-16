import fs from "fs";

export const fifteen = () => {
  const input = fs.readFileSync("fifteen/15.txt", "utf-8");
  const lines = input.split("\n").map((line) =>
    line
      .split(" ")
      .filter((_, idx) => idx === 2 || idx === 3 || idx === 8 || idx === 9)
      .map((x) => x.split("=")[1])
      .map((x, idx) => {
        if (idx !== 3) {
          return +x.slice(0, -1);
        } else {
          return +x;
        }
      })
  );

  let minX, maxX;

  const sensorMap = [];
  const beaconSet = new Set();

  for (const line of lines) {
    const [x, y, bX, bY] = line;

    beaconSet.add(getKeyFromCoords(bX, bY));

    const manhattanDistance = getManhattanDistance(x, y, bX, bY);

    sensorMap.push([x, y, manhattanDistance]);
  }

  for(const [x, y, r] of sensorMap) {
      const [min, max] = getBoundsFromCoordAndDistance(x, y, r);

      if (minX === undefined || min < minX) minX = min;
      if (maxX === undefined || max > maxX) maxX = max;
  }

  const y = 2000000;

  let counter = 0;

  for(let x = minX; x <= maxX; x++) {
      if (beaconSet.has(getKeyFromCoords(x, y))) continue;

      let possible = true;
      for(let [sX, sY, sR] of sensorMap) {
          const manhattanDistance = getManhattanDistance(x, y, sX, sY);

          if (manhattanDistance <= sR) {
              possible = false;
              break;
          }
      }

      if (!possible) counter++;
  }

  console.log(counter);

  //part two

  const range = 4000000;

  let y2 = 0;
  let x = 0;

  while (y <= range) {
    let possible = true;

    for (let [sX, sY, sR] of sensorMap) {
      const manhattanDistance = getManhattanDistance(x, y2, sX, sY);

      if (manhattanDistance <= sR) {
        possible = false;

        const newX = x + getSkipVal(x, y2, sX, sY, sR) + 1;

        if (newX >= range) {
          y2 += 1;
          x = 0;
        } else {
          x = newX;
        }
        break;
      }
    }

    if (possible) {
      console.log(x * 4000000 + y2);
      break;
    }
  }
};

const getManhattanDistance = (x1, y1, x2, y2) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

const getBoundsFromCoordAndDistance = (x, y, distance) => {
    return [x - distance, x + distance];
}

const getKeyFromCoords = (x, y) => {
  return `${x},${y}`;
};

const getSkipVal = (x1, y1, x2, y2, radius) => {
  const verticalDist = Math.abs(y1 - y2);

  const initialDistance = radius * 2 + 1;

  const distOnThisLevel = initialDistance - verticalDist * 2;

  const inlineRadius = Math.floor(distOnThisLevel / 2);

  const endOfInterval = x2 + inlineRadius;

  const skipVal = endOfInterval - x1;

  return skipVal;
};
