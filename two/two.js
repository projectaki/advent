import fs from "fs";

export const two = () => {
    const data = fs.readFileSync("two/2.txt", "utf8");

    const score = {
        "X": 1,
        "Y": 2,
        "Z": 3,
    }

    const mapping = {
        "A": "X",
        "B": "Y",
        "C": "Z",
    }

    const roundScore = {
        "AX": 3,
        "AY": 6,
        "AZ": 0,
        "BX": 0,
        "BY": 3,
        "BZ": 6,
        "CX": 6,
        "CY": 0,
        "CZ": 3,
    }

    const list = data.split("\n");

    const joinedList = list.map((item) => item.split(" ").join(""));

    const res = joinedList.reduce((a,c) => {
        const [first, second] = c.split("");
        const firstScore = score[second];
        const secondScore = roundScore[c];

        const total = firstScore + secondScore + a;
        return total;
    }, 0);

   // console.log(res)

    //two
    const score2 = {
        "A": 1,
        "B": 2,
        "C": 3,
    }

    const map2 = {
        "AW": "B",
        "AL": "C",
        "AD": "A",
        "BW": "C",
        "BL": "A",
        "BD": "B",
        "CW": "A",
        "CL": "B",
        "CD": "C",
    }

    const res2 = joinedList.reduce((a,c) => {
        const [first, second] = c.split("");
        if(second === "X") {
            const str = first + 'L';
            const yourPick = map2[str];
            const score = score2[yourPick];
            console.log(str,yourPick, score)

            return a + score + 0;
        }
        else if (second === "Y") {
            const str = first + 'D';
            const yourPick = map2[str];
            const score = score2[yourPick];

            return a + score + 3;
        }
        else if (second === "Z") {
            const str = first + 'W';
            const yourPick = map2[str];
            const score = score2[yourPick];

            return a + score + 6;
        }
    }, 0);

    console.log(res2)

};