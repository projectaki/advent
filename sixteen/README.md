Part 1:

Recursive approach.

First I tried with tail-recursion. The idea was to recursively exhaust all possibilites, and keep track of the largest possible value. 

This wasn't fast enough, so I needed a new approach. I tried to use DP, and cache results, but I couldn't do this with my tail-recursive approach, so I redid the same logic but instead of tail recursion, I implemented it the opposite way, this way I could cache results of already searched sub-paths.

This gave me a fast solution. I used the current minutes, the current valve and the opened valves concatenated as a cache key.

Part 2:

My initial idea is to use the same approach, but accomodate the new requirements.

