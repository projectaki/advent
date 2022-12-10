import fs from 'fs';

export const ten = () => {
    const data = fs.readFileSync('./ten/10.txt', 'utf8');

    const lines = data.split('\n');

    let res = {sum: 0};
    console.log('------');
    //rec(lines, 0, 1, 1, res, false);

    //console.log(res.sum);

    const grid = [];

    for(let i = 0; i < 6; i++) {
        grid.push([]);
        for(let j = 0; j < 40; j++) {
            grid[i].push('.');
        }
    }

    recPaint(lines, 0, 1, 1, grid, false);

    for(let i = 0; i < 6; i++) {
        console.log(grid[i].join(''));
    }

}

const rec = (lines, idx, cycle, currentValue, res, skipCycle) => {
    if (idx === lines.length) {
        return;
    }

    const [cmd, val] = lines[idx].split(' ');

    if(cycle === 20 || (cycle - 20) % 40 === 0) {
        const boost = (currentValue * cycle)
        res.sum += boost;
    }

    if(cmd === 'noop') {
        rec(lines, idx + 1, cycle + 1, currentValue, res, skipCycle);
    }
    else {
        if(skipCycle) {
            rec(lines, idx + 1, cycle + 1, currentValue + +val, res, false);
        }
        else {
            rec(lines, idx, cycle + 1, currentValue, res, true);
        }
    }
}

const recPaint = (lines, idx, cycle, currentValue, grid, skipCycle) => {
    if (idx === lines.length) {
        return;
    }
    
    const gridRow = Math.floor((cycle - 1) / 40);
    const sprite = [currentValue - 1, currentValue, currentValue + 1];
    const currentPixelPosition = (cycle - 1) % 40;

    if(sprite.includes(currentPixelPosition)) {
        grid[gridRow][currentPixelPosition] = '#';
    }

    const [cmd, val] = lines[idx].split(' ');

    if(cmd === 'noop') {
        recPaint(lines, idx + 1, cycle + 1, currentValue, grid, skipCycle);
    }
    else {
        if(skipCycle) {
            recPaint(lines, idx + 1, cycle + 1, currentValue + +val, grid, false);
        }
        else {
            recPaint(lines, idx, cycle + 1, currentValue, grid, true);
        }
    }
}