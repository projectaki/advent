import fs from "fs";

export const four = () => {
    const data = fs.readFileSync("four/4.txt", "utf8");

    const arr = data.split("\n") ;
    console.log(arr)

     const res1 = arr.reduce((a,b) => {
        const [lLow, lHigh] = b.split(',')[0].split("-").map(x => parseInt(x));
        const [rLow, rHigh] = b.split(',')[1].split("-").map(x => parseInt(x));

        console.log(lLow, lHigh, rLow, rHigh)

        if(lLow <= rLow && lHigh >= rHigh) {
            return a + 1;
        }
        if(rLow <= lLow && rHigh >= lHigh) {
            return a + 1;
        }

        return a;
    },0);

    console.log(res1)

    const res2 = arr.reduce((a,b) => {
        const [lLow, lHigh] = b.split(',')[0].split("-").map(x => parseInt(x));
        const [rLow, rHigh] = b.split(',')[1].split("-").map(x => parseInt(x));

        const dict = new Set();

        for(let i = lLow; i <= lHigh; i++) {
            dict.add(i);
        }

        for(let i = rLow; i <= rHigh; i++) {
            if(dict.has(i)) {
                return a + 1;
            }
        }

        return a;
    },0);

    console.log(res2)
}