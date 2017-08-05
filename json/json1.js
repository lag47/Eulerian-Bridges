var points = [
    new Point(576 / 6, 576 / 2 - 100),
    new Point(576 / 2, 576 / 2 - 100),
    new Point(576 / 6 * 5, 576 / 2 - 100),
    new Point(576 / 6 * 5, 576 / 2 + 100),
    new Point(576 / 6, 576 / 2 + 100)
]

var edges = [
    new Edge(points[0], points[1]),
    new Edge(points[1], points[2]),
    new Edge(points[2], points[3]),
    new Edge(points[4], points[0]),
    new Edge(points[4], points[1]),
    new Edge(points[3], points[1])
]