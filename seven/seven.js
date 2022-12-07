import fs from "fs";
import { parseArgs } from "util";

export const seven = () => {
  const data = fs.readFileSync("./seven/7.txt", "utf8");
  const lines = data.split("\n").slice(1);

  const rootNode = {
    name: "/",
    type: "directory",
    children: [],
    parent: null,
    totalSize: 0,
  };

  createDirectory(rootNode, lines, 0);

  let res = {summ: 0};

  let sum = getSumSmallerThanLimit(rootNode, res, 100000);

  const spaceNeeded = 30000000;
  const spaceNow = 70000000 - sum;
  const spaceMissing = spaceNeeded - spaceNow;

  const potential = [];

  findToDelete(rootNode, spaceMissing, potential);

  const res2 = potential.sort((a, b) => a - b)[0];

  console.log(res.summ);
  console.log(res2);
};

const findToDelete = (node, needMore, potential) => {
    let sum = 0;

    if (!node.children) {
      return node.size;
    };
  
    node.children.forEach((n) => {
      sum += findToDelete(n, needMore, potential);
    });
  
    if(sum >= needMore) potential.push(sum);
  
    return sum; 
}

const getSumSmallerThanLimit = (node, res, limit) => {
    let sum = 0;

  if (!node.children) {
    return node.size;
  };

  node.children.forEach((n) => {
    sum += getSumSmallerThanLimit(n, res, limit);
  });

  if(sum <= limit) res.summ += sum;

  return sum;
};

const createDirectory = (currentNode, lines, idx) => {

  if (idx >= lines.length) return;
  
  const tokens = lines[idx].split(" ");

  if (lines[idx].startsWith("$ cd ..")) {
    createDirectory(currentNode.parent, lines, idx + 1);

    return;
  }

  if (lines[idx].startsWith("$ cd")) {
    let findDirectory = currentNode.children.find((c) => c.name === tokens[2]);

    if (!findDirectory) {
      const newDirectory = {
        name: tokens[2],
        type: "directory",
        children: [],
        parent: currentNode,
        totalSize: 0,
      };

      findDirectory = newDirectory;

      currentNode.children.push(findDirectory);
    }
    
    createDirectory(findDirectory, lines, idx + 1);

    return;
  }

  if (lines[idx].startsWith("$ ls")) {
    createDirectory(currentNode, lines, idx + 1);

    return;
  }

  if (lines[idx].startsWith("dir")) {

    const newDirectory = {
      name: tokens[1],
      type: "directory",
      children: [],
      parent: currentNode,
      totalSize: 0,
    };

    currentNode.children.push(newDirectory);

    createDirectory(currentNode, lines, idx + 1);

    return;
  }

  const newFile = {
    name: tokens[1],
    type: "file",
    size: +tokens[0],
    parent: currentNode,
  };

  currentNode.children.push(newFile);

  createDirectory(currentNode, lines, idx + 1);

  return;
};
