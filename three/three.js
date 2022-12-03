import fs from "fs";

export const three = () => {
    const data = fs.readFileSync("three/3.txt", "utf8");

    const array = data.split("\n");

    const res = array.reduce((a, line) => {
        const first = line.slice(0, line.length / 2);
        const second = line.slice(line.length / 2, line.length);

        const same = first.split("").find(x => {
            return second.includes(x);
        });

        return a += getPrio(same);
    },0);

    // two

    
    const groups = array.reduce((a, line, idx) => {
        if (idx % 3 === 0) {
            a.push([]);
        }
        a[a.length - 1].push(line);
        return a;
    }, []);


    console.log(findSame(groups[0]));

    const res2 = groups.reduce((a, group) => {
        const same = findSame(group);

        return a += getPrio(same);
    },0);

    console.log(res2)
};

const isCapital = (char) => {
    const code = char.charCodeAt(0);
    return code >= 65 && code <= 90;
}

const getPrio = (char) => {
    if (isCapital(char)) {
        return char.charCodeAt(0) - 65 + 27;
    }
    return char.charCodeAt(0) - 96;
}

const findSame = (arr) => {
    const mp = new Map();

    arr.forEach(g => {
        const unique = new Set(g.split(""));
        unique.forEach(c => {
            mp.set(c, mp.get(c) + 1 || 1);
        });
    })
    

    return [...mp.entries()].find(x => x[1] === 3)[0];
}