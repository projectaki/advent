import fs from "fs";

export const nine = () => {
  const data = fs.readFileSync("nine/9.txt", "utf8");

  const lines = data.split("\n");

  const H = [0, 0];
  const T = [0, 0];

  const unique = new Set();

  lines.forEach((l) => {
    const [dir, count] = l.split(" ");

    for (let i = 0; i < count; i++) {
      updateHeadPosition(H, dir);
      updateTailPosition(H, T);
      unique.add(`${T[0]},${T[1]}`);
    }
  });

  console.log(unique.size);

  //part two

  const knots = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];

  const unique2 = new Set();

  for (let line of lines) {
    const [dir, count] = line.split(" ");
    for (let i = 0; i < count; i++) {
      updateHeadPosition(knots[0], dir);
      for (let k = 0; k < knots.length - 1; k++) {
        updateTailPosition(knots[k], knots[k + 1]);
        if (k === knots.length - 2)
          unique2.add(`${knots[k + 1][0]},${knots[k + 1][1]}`);
      }
    }
  }
  console.log(unique2.size);
};

const updateHeadPosition = (head, dir) => {
  if (dir === "R") {
    head[0] += 1;
  } else if (dir === "L") {
    head[0] -= 1;
  } else if (dir === "U") {
    head[1] += 1;
  } else if (dir === "D") {
    head[1] -= 1;
  }
};

const updateTailPosition = (head, tail) => {
  const [hx, hy] = head;
  const [tx, ty] = tail;

  const areTouching = ([hx, hy], [tx, ty]) =>
    Math.abs(hx - tx) <= 1 && Math.abs(hy - ty) <= 1;

  const isInSameCol = ([hx], [tx]) => hx === tx;

  const isInSameRow = ([_, hy], [__, ty]) => hy === ty;

  if (areTouching(head, tail)) return;

  const stepCloserX = tx + (hx - tx < 0 ? -1 : 1);
  const stepCloserY = ty + (hy - ty < 0 ? -1 : 1);

  if (isInSameCol(head, tail)) {
    tail[0] = tx;
    tail[1] = stepCloserY;
  } else if (isInSameRow(head, tail)) {
    tail[0] = stepCloserX;
    tail[1] = ty;
  } else {
    tail[0] = stepCloserX;
    tail[1] = stepCloserY;
  }
};
