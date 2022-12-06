import fs from 'fs';

export const six = () => {
    const data = fs.readFileSync('./six/6.txt', 'utf8');

    for (let i = 3; i < data.length; i++) {
        if (noRepeating(data, i, 4)) {
            console.log(i + 1);
            break;
        }
    }

    for (let i = 3; i < data.length; i++) {
        if (noRepeating(data, i, 14)) {
            console.log(i + 1);
            break;
        }
    }
}

const noRepeating = (str, idx, count) => {
    const substring = str.substring(idx - (count - 1), idx + 1);
    const s = new Set(substring.split(''));

    return s.size === substring.length;
}