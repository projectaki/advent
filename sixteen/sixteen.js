import fs from "fs";
import { addAbortSignal } from "stream";

export const sixteen = () => {
  const data = fs.readFileSync("sixteen/16.txt", "utf8");
  const lines = data.split("\n").map((x) =>
    x
      .split(" ")
      .map((x) => {
        if (x.at(-1) === ",") {
          return x.slice(0, -1);
        } else return x;
      })
      .filter((_, idx) => {
        const idxs = [1, 4, 9, 10, 11];

        return idxs.includes(idx);
      })
      .map((_, idx) => {
        if (idx === 1) {
          return +_.split("=")[1].slice(0, -1);
        }

        return _;
      })
  );

  const valveMap = new Map();

  lines.forEach((l) => {
    const [valve, rate, ...tunnels] = l;

    valveMap.set(valve, [rate, tunnels]);
  });

  const isOpenMap = {};

  for (let k of valveMap.keys()) {
    isOpenMap[k] = false;
  }

  // const rec = (minutes, currentValve, valveMap, isOpenMap, dict) => {
  //     const xkey = `${minutes}-${currentValve}-${JSON.stringify(isOpenMap)}`;

  //     if (dict[xkey]) {
  //         return dict[xkey];
  //     }

  //     if (minutes >= 30) {
  //         return 0;
  //     }

  //     const [rate, tunnels] = valveMap.get(currentValve);

  //     let max = 0;

  //     for (let tunnel of tunnels) {

  //         const isOpenMapWithOpenedValve = {...isOpenMap, [currentValve]: true};
  //         const isOpenMapWithClosedValve = {...isOpenMap};

  //         let localPressure = 0;

  //         const keys = Object.keys(isOpenMap);

  //         for (let k of keys) {
  //             const val = isOpenMap[k];

  //             if (val) {
  //                 const rate = valveMap.get(k)[0];

  //                 localPressure += rate;
  //             }
  //         }

  //         let opened = 0;

  //         if(rate !== 0) {
  //             opened = rec(minutes + 2, tunnel, valveMap, isOpenMapWithOpenedValve, dict) + (2 * localPressure);
  //         }

  //         const closed = rec(minutes + 1, tunnel, valveMap, isOpenMapWithClosedValve, dict) + localPressure;

  //         max = Math.max(opened, closed, max);
  //     }

  //     const key = `${minutes}-${currentValve}-${JSON.stringify(isOpenMap)}`;

  //     dict[key] = max;

  //     return max;
  // }

  //const res = rec(0,'AA', valveMap, isOpenMap, {});

  const serialize = (isOpenMap) => {
    let res = "";

    for (let k of Object.keys(isOpenMap)) {
      res += isOpenMap[k] ? "1" : "0";
    }

    return res;
  };

  const rec2 = (minutes, meValve, eleValve, valveMap, isOpenMap, dict = {}) => {
    //console.log(minutes)
    const ser = serialize(isOpenMap);
    const xkey = `${minutes}-${meValve}-${eleValve}-${ser}`;
    const xkey2 = `${minutes}-${eleValve}-${meValve}-${ser}`;

    if (dict[xkey]) {
      return dict[xkey];
    }

    if (dict[xkey2]) {
      return dict[xkey2];
    }

    if (minutes === 26) {
      return 0;
    }

    let localPressure = 0;

    const keys = Object.keys(isOpenMap);

    for (let k of keys) {
      const val = isOpenMap[k];

      if (val) {
        const rate = valveMap.get(k)[0];

        localPressure += rate;
      }
    }

    if (Object.entries(isOpenMap).filter(([key, val]) => {
        const [rate, _] = valveMap.get(key);

        return rate !== 0;
    }).every(([key, val]) => val)) {
      const prev = rec2(
        minutes + 1,
        meValve,
        eleValve,
        valveMap,
        isOpenMap,
        dict
      );

      const res = prev + localPressure;

      dict[xkey] = res;

      return res;
    }

    let max = 0;

    const [meRate, tunnelsMe] = valveMap.get(meValve);
    const [eleRate, tunnelsEle] = valveMap.get(eleValve);

    const isMeOpen = isOpenMap[meValve];
    const isEleOpen = isOpenMap[eleValve];

    if (
      meValve !== eleValve &&
      !isMeOpen &&
      !isEleOpen &&
      meRate !== 0 &&
      eleRate !== 0
    ) {
      isOpenMap[meValve] = true;
      isOpenMap[eleValve] = true;

      const sum1 =
        rec2(minutes + 1, meValve, eleValve, valveMap, isOpenMap, dict) +
        localPressure;

      isOpenMap[meValve] = false;
      isOpenMap[eleValve] = false;

      max = Math.max(max, sum1);
    }

    if (!isMeOpen && meRate !== 0) {
      for (let tEle of tunnelsEle) {
        isOpenMap[meValve] = true;

        const sum1 =
          rec2(minutes + 1, meValve, tEle, valveMap, isOpenMap, dict) +
          localPressure;

        isOpenMap[meValve] = false;

        max = Math.max(max, sum1);
      }
    }

    if (!isEleOpen && eleRate !== 0) {
      for (let tMe of tunnelsMe) {
        isOpenMap[eleValve] = true;

        const sum2 =
          rec2(minutes + 1, tMe, eleValve, valveMap, isOpenMap, dict) +
          localPressure;

        isOpenMap[eleValve] = false;

        max = Math.max(max, sum2);
      }
    }

    const temp = [];

    for (let tMe of tunnelsMe) {
      for (let tEle of tunnelsEle) {
        if(!temp.some(([tMe2, tEle2]) => (tMe2 === tMe && tEle2 === tEle) || (tMe2 === tEle && tEle2 === tMe))) {
          temp.push([tMe, tEle]);
        }
      }
    }

    //if (true) {


      for (let [tMe, tEle] of temp) {
        const sum3 =
          rec2(minutes + 1, tMe, tEle, valveMap, isOpenMap, dict) +
          localPressure;

        max = Math.max(max, sum3);
      }
    //} 
    // else {
    //   for (let tMe of tunnelsMe) {
    //     for (let tEle of tunnelsEle) {
    //       const sum3 =
    //         rec2(minutes + 1, tMe, tEle, valveMap, isOpenMap, dict) +
    //         localPressure;

    //       max = Math.max(max, sum3);
    //     }
    //   }
    // }
    dict[xkey] = max;

    return max;
  };

  const start = Date.now();

  const res = rec2(0, "AA", "AA", valveMap, isOpenMap);
  console.log(res);
  console.log(Date.now() - start + "ms");
};

// aa, bb , cc
// aa, bb, cc

// aaaa, aabb, aacc, bbaa, bbbb, bbcc, ccaa, ccbb, cccc

// dd, ee, ff
