import fs from 'fs';

export const eleven = () => {
    const data = fs.readFileSync('./eleven/11.txt', 'utf8');

    const monkeyInspectMap = new Map();// monkey number, inspections
    const monkeyInventoryMap = new Map();// monkey number, inventory

    const blocks = data.split('\n\n').map(x => x.split('\n').map(x => [...x.trim()].join('')).map((x, idx) => {
        if (idx === 0) {
            return x.split(' ')[1][0];
        } else if(idx === 1) {
            return x.split(' ').slice(2).join('').split(',');
        }
        else if (idx === 2) {
            return x.split(' ').slice(1).join('').split('=')[1];
        }
        else if (idx === 3) {
            return [x.split(' ')[1], x.split(' ')[3]];
        }
        else if (idx === 4) {
            return [x.split(' ')[1].slice(0, -1), x.split(' ')[5]];
        }
        else {
            return [x.split(' ')[1].slice(0, -1), x.split(' ')[5]]
        }
    })).map((x) => {
        let cb;
        const worryExpression = x[2].split(/[*|+]/);

        if(x[2].includes('*')) {
            cb = (old) => {
                const res = old * (isNaN(+worryExpression[1]) ? old : +worryExpression[1]);
                return res;
            };
        }
        else {
            cb = (old) => {
                return old + (isNaN(+worryExpression[1]) ? old : +worryExpression[1]);
            };
        }

        return {
            id: +x[0],
            initialItems: x[1].map(x => +x),
            worryCb: cb,
            test: (val) => ((val) % +x[3][1]) === 0 ? +x[4][1] : +x[5][1],
            div: +x[3][1],
        }
    });

    let currentIndex = 0;
    let round = 0;

    while (round < 20) {
        const currentMonkey = blocks[currentIndex % blocks.length];

        if(round === 0) {
            const inventory = monkeyInventoryMap.get(currentMonkey.id);
            if(inventory) {
                monkeyInventoryMap.set(currentMonkey.id, [...currentMonkey.initialItems, ...inventory]);
            }
            else {
                monkeyInventoryMap.set(currentMonkey.id, currentMonkey.initialItems);
            }
        }

        const inventory = monkeyInventoryMap.get(currentMonkey.id);
        monkeyInventoryMap.set(currentMonkey.id, []);

        for (let score of inventory) {
            
            monkeyInspectMap.set(currentMonkey.id, (monkeyInspectMap.get(currentMonkey.id) || 0) + 1);

            const newScore = currentMonkey.worryCb(score);

            const monkeyId = currentMonkey.test(newScore);

            const monkeyInventory = monkeyInventoryMap.get(monkeyId);

            const toMonkey = blocks[monkeyId];

            if(monkeyInventory && monkeyInventory.length > 0) {
                const newInventory = [...monkeyInventory, Math.ceil(newScore / currentMonkey.div)];

                monkeyInventoryMap.set(monkeyId, newInventory);
            }
            else {
                monkeyInventoryMap.set(monkeyId, [Math.ceil(newScore / currentMonkey.div)]);
            }
            
        }
        
        if(++currentIndex % blocks.length === 0) {
            round++;
        }
    }

    console.log(monkeyInventoryMap)
    console.log(monkeyInspectMap.values());
    // console.log([...monkeyInspectMap.values()].sort((a, b) => b - a).slice(0, 2).reduce((a, b) => a * b, 1));
}


const getZeros = (val) => {
    let res = {c: 0};

    const rec = (val, res) => {
        if(val / 10 > 1) {
            res.c += 1;

            return rec(val / 10, res);
        }
        else {
            return val;
        }
    }

    const value = rec(val, res);

    return [value, res.c];
}