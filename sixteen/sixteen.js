import fs from "fs";

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

  const rec2 = (minutes, meValve, eleValve, valveMap, isOpenMap, dict) => {
    const xkey = `${minutes}-${meValve}-${eleValve}-${JSON.stringify(
      isOpenMap
    )}`;

    if (dict[xkey]) {
      return dict[xkey];
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

    if (Object.values(isOpenMap).every((x) => x)) {
      const prev = rec2(
        minutes + 1,
        meValve,
        eleValve,
        valveMap,
        isOpenMap,
        dict
      );

      return prev + localPressure;
    }

    let max = 0;

    const [meRate, tunnelsMe] = valveMap.get(meValve);
    const [eleRate, tunnelsEle] = valveMap.get(eleValve);

    const isMeOpen = isOpenMap[meValve];
    const isEleOpen = isOpenMap[eleValve];

    if (meValve !== eleValve && !isMeOpen && !isEleOpen && (meRate !== 0 && eleRate !== 0)) {
      const isOpenMapWithOpenedValve = {
        ...isOpenMap,
        [meValve]: true,
        [eleValve]: true,
      };

      const sum1 =
        rec2(
          minutes + 1,
          meValve,
          eleValve,
          valveMap,
          isOpenMapWithOpenedValve,
          dict
        ) + localPressure;

      max = Math.max(max, sum1);
    }

    if (!isMeOpen && meRate !== 0) {
      for (let tEle of tunnelsEle) {
        const isOpenMapWithOpenedValve = { ...isOpenMap, [meValve]: true };

        const sum1 =
          rec2(
            minutes + 1,
            meValve,
            tEle,
            valveMap,
            isOpenMapWithOpenedValve,
            dict
          ) + localPressure;

        max = Math.max(max, sum1);
      }
    }

    if (!isEleOpen && eleRate !== 0) {
      for (let tMe of tunnelsMe) {
        const isOpenMapWithOpenedValve = { ...isOpenMap, [eleValve]: true };
        const sum2 =
          rec2(
            minutes + 1,
            tMe,
            eleValve,
            valveMap,
            isOpenMapWithOpenedValve,
            dict
          ) + localPressure;

        max = Math.max(max, sum2);
      }
    }

    for (let tMe of tunnelsMe) {
      for (let tEle of tunnelsEle) {
        const isOpenMapWithClosedValve = { ...isOpenMap };
        const sum3 =
          rec2(
            minutes + 1,
            tMe,
            tEle,
            valveMap,
            isOpenMapWithClosedValve,
            dict
          ) + localPressure;

        max = Math.max(max, sum3);
      }
    }

    const key = `${minutes}-${meValve}-${eleValve}-${JSON.stringify(
      isOpenMap
    )}`;

    dict[key] = max;

    return max;
  };

  const res = rec2(0, "AA", "AA", valveMap, isOpenMap, {});

  console.log(res);
};
