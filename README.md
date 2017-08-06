# MoMath Hackathon 2017: Eulerian Bridges!

- Math Square behavior
- Navid Mamoon (navidmx@gmail.com) and Lucas Silver (lag4777@gmail.com)

## The Math

This interactive display challenges participants to identify the Eulerian Cycle in a graph. The Eulerian Cycle problem (a famous example being the Seven Bridges of Königsberg) asks whether it is possible to follow a trail through the graph that starts and ends at the same graph vertex, crossing every edge only once. In order for a graph to be a Eulerian Cycle, each vertex must be of an even degree.

## The Submission

This submission displays an interactive, colorful graph with islands representing points and bridges representing lines that connect these points. Starting with a designated starting island (the player's "home"), you must try to cross each edge (a "bridge") to reach one of the indicated adjacent nodes. As you cross a bridge, it disappears. In the end you either find an Eulerian Cycle and move on to the next randomly selected map, or you end up trapped and are informed that you "lost," resetting the game.

## Additional Notes

We believe that concealing a fundamental graph theory as a basic puzzle with cute visuals can engage people in a way that is accessible even to children. Thus, we framed it with the simple story "cross every bridge and get back home!" and made use of visually appealing colors, familiar islands, trees, rocks, etc.
Because we expect it to be used by young children, it is also prepared to deal with multiple players running across the Math Square. It only reacts if someone walks onto a valid "next" node, and even has random fish appearing that kids can interact with, and make "run away" by stepping on them.
Similarly to most of MoMath's exhibits, we believe this program successfully packages a classic well-known mathematics puzzle with an intriguing and altogether fun to play game!

---

Behavior file: bridges.js
Background Image: water.png (should be placed in /images)
