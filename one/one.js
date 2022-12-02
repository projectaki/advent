import fs from "fs";

export const one = () => {
  const data = fs.readFileSync("one/1.txt", "utf8");

  const groups = data.split("\n\n");

  const properGroups = groups.map((group) => group.split("\n"));

  const sums = properGroups.map((x) =>
    x.reduce((acc, curr) => (acc += +curr), 0)
  );

  const res = sums.reduce((acc, curr) => {
    if (curr > acc) {
      return curr;
    }
    return acc;
  }, 0);

  const res2 = sums
    .sort((a, b) => a - b)
    .reverse()
    .slice(0, 3)
    .reduce((acc, curr) => (acc += curr), 0);

  console.log(res2);
};
