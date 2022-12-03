import fs from "fs";

export const two = () => {
    const data = fs.readFileSync("three/3.txt", "utf8");
    console.log(data);
};