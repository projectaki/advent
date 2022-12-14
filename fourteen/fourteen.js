import fs from 'fs';

export const fourteen = () => {

    const input = fs.readFileSync('fourteen/14.txt', 'utf8').split('\n');

    const coords = input.map(l => l.split('->').map(s => s.trim()).map(s => s.split(',').map(x => +x)));

    let maxX, maxY, minX, minY = 0;

    coords.forEach(row => {
        row.forEach(([x, y]) => {
            if (maxX === undefined || x > maxX) maxX = x;
            if (maxY === undefined || y > maxY) maxY = y;
            if (minX === undefined || x < minX) minX = x;
        });
    });

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    console.log(width, height, minX, minY)

    const grid = [...Array(height)].map(e => Array(width));

    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            grid[i][j] = '.';
        }
    }

    coords.forEach(row => {
        for(let i = 1; i < row.length; i++) {
            const first = row[i - 1];
            const second = row[i];

            const xformedFirst = getGridCoords(first[0], first[1], minX);
            const xformedSecond = getGridCoords(second[0], second[1], minX);

            drawLine(grid,  xformedFirst[1], xformedFirst[0], xformedSecond[1], xformedSecond[0]);
        }
    });

    let counter = 0;

    while(moveSandRec(grid, 500, 0, minX, width, height))
    {
        counter++;
    }

    grid.forEach(r => console.log(r.join('')));
    console.log(counter);

};

const getGridCoords = (x, y, minX) => {
    return [x - minX, y];
}

const drawLine = (grid, x1, y1, x2, y2) => {
    if(x1 === x2) {
        let smaller = y1 < y2 ? y1 : y2;
        let larger = y1 < y2 ? y2 : y1;

        for(let i = smaller; i <= larger; i++) {
            grid[x1][i] = '#';
        }
    }
    else if(y1 === y2) {
        let smaller = x1 < x2 ? x1 : x2;
        let larger = x1 < x2 ? x2 : x1;

        for(let i = smaller; i <= larger; i++) {
            grid[i][y1] = '#';
        }
    }
}

const moveSandRec = (grid, x, y, minX, width, height) => {
    const pos = getGridCoords(x, y, minX);

    const nextPos = [pos[0], pos[1] + 1];

    if(nextPos[1] < 0 || nextPos[1] >= height || nextPos[0] < 0 || nextPos[0] >= width) {
        return false;
    }

    if(grid[nextPos[1]][nextPos[0]] === '.') {
        return moveSandRec(grid, x, y + 1, minX, width, height);
    }
    else {
        const leftPos = [pos[0] - 1, pos[1] + 1];
        const rightPos = [pos[0] + 1, pos[1] + 1];

        if(grid[leftPos[1]][leftPos[0]] === '.') {
            return moveSandRec(grid, x - 1, y + 1, minX, width, height);
        }
        else if(grid[leftPos[1]][leftPos[0]] === undefined) {
            return false;
        }
        else if(grid[rightPos[1]][rightPos[0]] === '.') {
            return moveSandRec(grid, x + 1, y + 1, minX, width, height);
        }
        else if(grid[rightPos[1]][rightPos[0]] === undefined) {
            return false;
        }
        else {
            if(grid[pos[1]][pos[0]] === 'x') return false;
            grid[pos[1]][pos[0]] = 'x';
            
            return true;
        }
    }
}