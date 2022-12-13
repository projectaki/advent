import fs from 'fs';

export const thirteen = () => {
    const input = fs.readFileSync('thirteen/13.txt', 'utf8');
    const lines = input.split('\n\n').map(line => line.split('\n').map(JSON.parse));

    const rec = (a, b) => {

        let left,right;

        if(Array.isArray(a) && Array.isArray(b)) {
            left = a;
            right = b;
        }

        else if(Array.isArray(a) && !Array.isArray(b)) {
            left = a;
            right = [b];
        }
        else if(!Array.isArray(a) && Array.isArray(b)) {
            left = [a];
            right = b;
        }

        else {
            if(a === b) return null;
            else if(a < b) return true;
            else return false;
        }

        for(let i = 0; i < left.length; i++) {
            if(right[i] === undefined) {
                return false;
            }

            const res = rec(left[i], right[i]);

            if(res === true || res === false) {
                return res;
            }
        }

        if(right.length > left.length) return true;

        return null;
    }

    const res = lines.reduce((acc, line, idx) => {
        const res = rec(line[0], line[1]);
        if(res) return acc += (idx + 1);
        else return acc;
    }, 0)

    console.log(res)

    const lines2 = input.split('\n').filter(line => line !== '').map(JSON.parse).concat([[[2]],[[6]]]);

    const res2 = lines2.sort((a,b) => rec(a,b) ? -1 : 1);

    const result = res2.reduce((acc, line, idx) => {
        if(line.length === 1 && Array.isArray(line[0]) && line[0].length === 1 && (line[0][0] === 2 || line[0][0] === 6)) {
            return acc *= (idx + 1);
        }
        else return acc;
    }, 1);

    console.log(result);
};