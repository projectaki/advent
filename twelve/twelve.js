import fs from "fs";

export const twelve = () => {
  const data = fs.readFileSync("./twelve/12.txt", "utf8");

  let start,end;

  const lines = data.split("\n").map((line, i) => line.split("").map((x, j) => {
    if(x === "S") {
        start = [i, j];
        return 0;
    };
    if(x === "E") {
        end = [i, j];
        return 25;
    };

    return x.charCodeAt(0) - 97;
  }));

  let shortest = Number.MAX_SAFE_INTEGER;

  const width = lines[0].length;
  const height = lines.length;

  for(let i = 0; i < height; i++) {
    for(let j = 0; j < width; j++) {
      if(lines[i][j] === 0) {
        const visited = new Array(height).fill(0).map(() => new Array(width).fill(false));
      
        const queue = [];
      
        queue.push([i, j, 0]);
        visited[i][j] = true;
        
        while(queue.length > 0) {
          const [x, y, dist] = queue.shift();
          
          if(x === end[0] && y === end[1]) {
              if(dist < shortest) {
                shortest = dist;
              }
              break;
          }
      
          const neightbours = getNeightbours(x, y, width, height, lines, visited);
      
          for(const [nx, ny] of neightbours) {
            queue.push([nx, ny, dist + 1]);
          }
        }
      }
    }
  }

  console.log(shortest);
};

const getNeightbours = (x, y, w, h, grid, visited) => {
    const neightbours = [];

    if(y > 0 && grid[x][y - 1] - grid[x][y] <= 1 && !visited[x][ y - 1]) {
      visited[x][y - 1] = true;
      neightbours.push([x, y - 1]);
    } 
    if(y < w - 1 && grid[x][y + 1] - grid[x][y] <= 1 && !visited[x][ y + 1]){
      visited[x][y + 1] = true;
      neightbours.push([x, y + 1]);
    } 
    if(x > 0 && grid[x - 1][y] - grid[x][y] <= 1&& !visited[x - 1][ y]){
      visited[x - 1][y] = true;
      neightbours.push([x - 1, y]);
    } 
    if(x < h - 1 && grid[x + 1][y] - grid[x][y] <= 1 && !visited[x + 1][ y]) {
      visited[x + 1][y] = true;
      neightbours.push([x + 1, y]);
    } 
    
    return neightbours;
}