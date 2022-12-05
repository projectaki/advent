import fs from 'fs';

export const five = () => {
    const data = fs.readFileSync('five/5.txt', 'utf8');
    const parsed = data.split('\n');
    
    const moves = parsed.map(x => {
        const tokens = x.split(' ');
        const num = tokens[1];
        const from = tokens[3];
        const to = tokens[5];
        return [num, from, to];
    });

    const stacks = [['S', 'L', 'W'],['J','T','N','Q'],['S','C','H','F','J'],['T','R','M','W','N','G','B'],['T','R','L','S','D','H', 'Q', 'B'],['M','J','B','V','F','H','R','L'],['D','W','R','N','J', 'M'],['B','Z','T','F','H', 'N', 'D', 'J'],['H','L','Q', 'N', 'B','F', 'T']];
    const stacks2 = [['S', 'L', 'W'],['J','T','N','Q'],['S','C','H','F','J'],['T','R','M','W','N','G','B'],['T','R','L','S','D','H', 'Q', 'B'],['M','J','B','V','F','H','R','L'],['D','W','R','N','J', 'M'],['B','Z','T','F','H', 'N', 'D', 'J'],['H','L','Q', 'N', 'B','F', 'T']];

    moves.forEach(([num, from, to]) => {
        moveToStack(stacks, from - 1, to - 1, num);
    });

    const res1 = stacks.reduce((a, b) => a += b.at(-1),"");

   // console.log(res1);

    console.log(stacks)

    moves.forEach(([num, from, to]) => {
        moveToStackBatch(stacks2, from - 1, to - 1, num);
    });

    const res2 = stacks2.reduce((a, b) => a += b.at(-1),"");

    console.log(res2);
};

const moveToStack = (stacks, fromIdx, toIdx, num) => {
    for(let i = 0; i < num; i++){
        const val = stacks[fromIdx].pop();
        
        stacks[toIdx].push(val);
    }
};

const moveToStackBatch = (stacks, fromIdx, toIdx, num) => {
    const temp = [];

    for(let i = 0; i < num; i++){
        const val = stacks[fromIdx].pop();
        temp.unshift(val);
    }

    stacks[toIdx] = [...stacks[toIdx],...temp];
};
