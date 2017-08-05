var size = 50;
var points = [
    new Point(576 / 8, 3*576 / 8-30),//a 0
    new Point(3*576 / 8, 3*576 / 8-30 ),//b 1
    new Point(5*576 / 8, 3*576 / 8-30 ),//c 2
    new Point(7* 576 / 8, 3*576 / 8-30 ),//d 3
    new Point(576 / 8, 5*576 / 8-30),//e 4
    new Point(3*576 / 8, 5*576 / 8-30 ),//f 5
    new Point(5*576 / 8, 5*576 / 8-30 ),//g 6
    new Point(7* 576 / 8, 5*576 / 8-30 ),//h 7
    
    new Point(3*576 / 8, 576 / 8-30 ),//8
    //new Point(3*576 / 8, 5*576 / 8-30 ),
    new Point(3*576 / 8, 7*576 / 8-30 ),//9
    new Point(5*576 / 8, 576 / 8-30 ),//10
    //new Point(5*576 / 8, 5*576 / 8-30 ),
    new Point(5*576 / 8, 7*576 / 8-30 )//11


]

var edges = [
    new Edge(points[0], points[1]),
    new Edge(points[1], points[2]),
    new Edge(points[2], points[3]),
    new Edge(points[4], points[5]),
    new Edge(points[5], points[6]),
    new Edge(points[6], points[7]),
    new Edge(points[0], points[4]),
    new Edge(points[1], points[5]),
    new Edge(points[2], points[6]),
    new Edge(points[3], points[7]),
    new Edge(points[8],points[1]),
    new Edge(points[5],points[9]),
    new Edge(points[2],points[10]),
    new Edge(points[6],points[11]),
    new Edge(points[8],points[10]),
    new Edge(points[9],points[11])
]