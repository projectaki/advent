import fs from "fs";

export const eleven = () => {
  const data = fs.readFileSync("./eleven/11.txt", "utf8");

  const monkeyInspectMap = new Map();
  const monkeyInventoryMap = new Map();

  const monkeyMetadata = data
    .split("\n\n")
    .map((x) =>
      x
        .split("\n")
        .map((x) => [...x.trim()].join(""))
        .map((x, idx) => {
          if (idx === 0) {
            return x.split(" ")[1][0];
          } else if (idx === 1) {
            return x.split(" ").slice(2).join("").split(",");
          } else if (idx === 2) {
            return x.split(" ").slice(1).join("").split("=")[1];
          } else if (idx === 3) {
            return [x.split(" ")[1], x.split(" ")[3]];
          } else if (idx === 4) {
            return [x.split(" ")[1].slice(0, -1), x.split(" ")[5]];
          } else {
            return [x.split(" ")[1].slice(0, -1), x.split(" ")[5]];
          }
        })
    )
    .map((x) => {
      let cb;
      const worryExpression = x[2].split(/[*|+]/);

      if (x[2].includes("*"))
        cb = (old) =>
          old * (isNaN(+worryExpression[1]) ? old : +worryExpression[1]);
      else
        cb = (old) =>
          old + (isNaN(+worryExpression[1]) ? old : +worryExpression[1]);

      return {
        id: +x[0],
        initialItems: x[1].map((x) => +x),
        worryCb: cb,
        test: (val) => (val % +x[3][1] === 0 ? +x[4][1] : +x[5][1]),
        div: +x[3][1],
      };
    });

  let currentIndex = 0;
  let round = 0;

  let ceiling = monkeyMetadata.reduce((acc, monkey) => (acc *= monkey.div), 1);

  while (round < 10000) {
    const currentMonkey = monkeyMetadata[currentIndex % monkeyMetadata.length];

    if (round === 0) {
      const inventory = monkeyInventoryMap.get(currentMonkey.id);
      if (inventory) {
        monkeyInventoryMap.set(currentMonkey.id, [
          ...currentMonkey.initialItems,
          ...inventory,
        ]);
      } else {
        monkeyInventoryMap.set(currentMonkey.id, currentMonkey.initialItems);
      }
    }

    const inventory = monkeyInventoryMap.get(currentMonkey.id);
    monkeyInventoryMap.set(currentMonkey.id, []);

    for (let score of inventory) {
      monkeyInspectMap.set(
        currentMonkey.id,
        (monkeyInspectMap.get(currentMonkey.id) || 0) + 1
      );

      const newScore = currentMonkey.worryCb(score);

      const monkeyId = currentMonkey.test(newScore);

      const monkeyInventory = monkeyInventoryMap.get(monkeyId);

      if (monkeyInventory && monkeyInventory.length > 0) {
        const newInventory = [...monkeyInventory, newScore % ceiling];

        monkeyInventoryMap.set(monkeyId, newInventory);
      } else {
        monkeyInventoryMap.set(monkeyId, [newScore % ceiling]);
      }
    }

    if (++currentIndex % monkeyMetadata.length === 0) {
      round++;
    }
  }

  console.log([...monkeyInspectMap.values()].sort((a, b) => b - a).slice(0, 2).reduce((a, b) => a * b, 1));
};
