import fs from 'fs';

export const fourteen = () => {

    const input = fs.readFileSync('fourteen/14.txt', 'utf8').split('\n');

    const coords = input.map(l => l.split('->').map(s => s.trim()).map(s => s.split(',').map(x => +x)));

    let maxI;

    coords.forEach(row => {
        row.forEach(([x, y]) => {
            if (maxI === undefined || y > maxI) maxI = y;
        });
    });

    const width = 1000;
    const height = maxI + 1;

    const grid = getGridWithLines(height, width, coords);

    let counter1 = 0;

    while(moveSandRec(grid, 0, 500, height - 1))
    {
        counter1++;
    }
    console.log(counter1);

    // part two

    let grid2 = getGridWithLines(height, width, coords);
    
    grid2 = grid2.concat([[...Array(width)].map(x => '.')]).concat([[...Array(width)].map(x => '#')]);

    let counter2 = 0;

    while(moveSandRec(grid2, 0, 500, null))
    {
        counter2++;
    }
    console.log(counter2);
};

const getGridWithLines = (height, width, coords) => {
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

            drawLine(grid, first[1], first[0], second[1], second[0]);
        }
    });

    return grid;
}

const drawLine = (grid, i1, j1, i2, j2) => {
    if(i1 === i2) {
        let smaller = j1 < j2 ? j1 : j2;
        let larger = j1 < j2 ? j2 : j1;

        for(let i = smaller; i <= larger; i++) {
            grid[i1][i] = '#';
        }
    }
    else if(j1 === j2) {
        let smaller = i1 < i2 ? i1 : i2;
        let larger = i1 < i2 ? i2 : i1;

        for(let i = smaller; i <= larger; i++) {
            grid[i][j1] = '#';
        }
    }
}

const moveSandRec = (grid, i, j, cuck) => {
    const [nextI, nextJ] = [i + 1, j];

    if(i === cuck) {
        return false;
    }

    if(grid[nextI][nextJ] === '.') {
        return moveSandRec(grid, i + 1, j, cuck);
    }
    else {
        const leftPos = [nextI, nextJ - 1];
        const rightPos = [nextI, nextJ + 1];

        if(grid[leftPos[0]][leftPos[1]] === '.') {
            return moveSandRec(grid, i + 1, j - 1, cuck);
        }
        else if(grid[rightPos[0]][rightPos[1]] === '.') {
            return moveSandRec(grid, i + 1, j + 1, cuck);
        }
        else {
            if(grid[i][j] === 'x') return false;
            grid[i][j] = 'x';
            
            return true;
        }
    }
}