var size = 75;
var points = [
    new Point(576 / 2, 576 / 6 -20),//a 0
    new Point(576 / 2, 5*576 / 6-20 ),//f 1
    new Point(576 / 4, 5*576 / 8-20 ),//d 2
    new Point(3* 576 / 4, 5*576 / 8-20 ),//e 3
    new Point(576 / 4, 3*576 / 8-20 ),//b 4 
    new Point(3* 576 / 4, 3*576 / 8-20 )//c 5

]

var edges = [
    new Edge(points[0], points[4]),
    new Edge(points[0], points[5]),
    new Edge(points[4], points[5]),
    new Edge(points[1], points[2]),
    new Edge(points[1], points[3]),
    new Edge(points[2], points[3]),
    new Edge(points[4], points[2]),
    new Edge(points[3], points[5]),
    new Edge(points[3], points[4]),
    new Edge(points[2], points[5])
]