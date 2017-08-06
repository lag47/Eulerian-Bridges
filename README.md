# MoMath Hackathon 2017: Eulerian Bridges!

- Math Square behavior
- Navid Mamoon (navidmx@gmail.com) and Lucas Silver (lag4777@gmail.com)

## The Math

This interactive display lets participants find an Eulerian Cycle in a Graph. The Eulerian Cycle problem (a famous example being the Seven Bridges of Konigsberg) asks whether it is possible to find a cycle through the graph that crosses every edge of the graph exactly once.

## The Submission

The Math Square displays a representation of a Graph, with nodes as islands and edges as bridges. Starting with a designated starting node, you try to cross edges to reach one of the adjacent nodes, which are indicated by the color gold. As you cross an edge, it disappears. In the end you either find an Eulerian Cycle or you end up trapped and informed that you "lost". We believe that framing a fundamental graph theory as a simple maze with cute visuals, including randomly appearing fish, can engage people with the problem in a way that is accessible even to children. Because we expect it to mostly be used by small children, it is prepared to deal with kids running randomly accross the Math Square. It only reacts if someone walks onto a valid "next" node.

## Additional Notes



---

Behavior file: bridges.js
Background Image: water.png (should be placed in /images)
