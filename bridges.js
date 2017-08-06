/* MoMath Math Square Behavior
 *
 *        Title: Bridges
 *  Description: Players have to cross all bridges on the map and return home on
 *               a few different Eulerian cycles.
 * Scheduler ID: 
 *    Framework: P5
 *       Author: Navid Mamoon <navidmx@gmail.com> and Lucas Silver <lag4777@gmail.com>
 *      Created: 2017-07
 *       Status: works
 */

import P5Behavior from 'p5beh';

const pb = new P5Behavior();

//Size of the islands
var size = 75;
var level = 0;
var map = [];
var fish = [];
var gameStarted, transition, win, lost = false;
var c, col, img, connectedEdges, deletedEdges;
var active = new Point(1000, 1000);

//Initial islands and bridges for the game (Level 0)
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

//Store white particles in the water
var particles = [];

//Pick a random starting point for the first island
var start = points[Math.floor(Math.random() * points.length)];

pb.preload = function (p) {};

pb.setup = function (p) {
    //Highlight the starting point
    start.status = "next";
    //Load image water
    img = this.loadImage("./images/water.png");
    //Add white moving particles in the water
    for (var i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
};

pb.draw = function (floor, p) {
    this.image(img, 0, 0);
    drawFish();
    for (i = 0; i < fish.length; i++){
        this.noStroke();
        c = ("rgba(255, 132, 132, .5)");
        this.fill(c);
        this.ellipse(fish[i].x, fish[i].y, 20, 10);
        if (!fish[i].hit){
            this.triangle(fish[i].x - 10, fish[i].y, fish[i].x - 15, fish[i].y - 5, fish[i].x - 15, fish[i].y + 5);
            fish[i].x = fish[i].x + fish[i].speed;
        } else {
            this.triangle(fish[i].x + 10, fish[i].y, fish[i].x + 15, fish[i].y - 5, fish[i].x + 15, fish[i].y + 5);
            fish[i].x = fish[i].x - fish[i].speed;
        }
    }
    for (let u of floor.users) {
        //Draw tiny ripple on user's feet (if they're on the water)
        this.noFill();
        this.strokeWeight(2);
        this.stroke("#7dacb7");
        this.ellipse(u.x, u.y, 15);
        this.stroke("#c6ecf9");
        this.ellipse(u.x, u.y, 25);
        this.stroke("#d0dee7");
        this.strokeWeight(1);
        this.ellipse(u.x, u.y, 35);
        //If a player touches a fish, the fish will run away
        for (i = 0; i < fish.length; i++){
            if (u.x > fish[i].x - 20 && u.x < fish[i].x + 20 && u.y > fish[i].y - 10 && fish[i].y + 10){
                fish[i].hit = true;
                fish[i].speed = fish[i].speed + 3;
            }
        }
        checkStatus(u);
    }
    //Draw adorable fish on random intervals
    checkWin();
    //Loss function
    connectedEdges = 0;
    deletedEdges = 0;
    if (!win && gameStarted) {
        for (var i = 0; i < edges.length; i++) {
            if (edges[i].node1 == active || edges[i].node2 == active) {
                connectedEdges++;
            }
        }
        //If there are no bridges connected to island and game wasn't won, mark a loss
        if (connectedEdges == 0) {
            lost = true;
            hardReset();
            setTimeout(function () {
                lost = false;
            }, 2000);
        }
    }
    //Draw water particles
    for (var i = 0; i < particles.length; i++) {
        this.noStroke();
        this.fill(255, this.random(200, 255), 255);
        this.ellipse(particles[i].x, particles[i].y, 4);
        particles[i].update();
    }
    //Loop through bridges, draw depending on status
    for (var i = 0; i < edges.length; i++) {
        if (edges[i].status == "default") {
            this.strokeWeight(30);
            this.stroke(50);
            this.line(edges[i].node1.x, edges[i].node1.y, edges[i].node2.x, edges[i].node2.y);
            this.strokeWeight(20);
            this.stroke("#843815");
            this.line(edges[i].node1.x, edges[i].node1.y, edges[i].node2.x, edges[i].node2.y);
        } else if (edges[i].status == "outline") {
            this.strokeWeight(30);
            this.stroke(225);
            this.line(edges[i].node1.x, edges[i].node1.y, edges[i].node2.x, edges[i].node2.y);
            this.strokeWeight(20);
            this.stroke("#843815");
            this.line(edges[i].node1.x, edges[i].node1.y, edges[i].node2.x, edges[i].node2.y);
        } else if (edges[i].status == "crossed") {
            this.strokeWeight(20);
            this.stroke("#e6b800");
            this.line(edges[i].node1.x, edges[i].node1.y, edges[i].node2.x, edges[i].node2.y);
        }
    }
    //Loop through bridges, draw depending on status
    for (var i = 0; i < points.length; i++) {
        //Inactive point (green outline)
        if (points[i].status == "inactive") {
            col = "green";
        }
        //Active point (point you're currently on, white outline)
        else if (points[i].status == "active") {
            col = "#ffffff";
        }
        //Next point (points you can access, gold outline)
        else if (points[i].status == "next") {
            col = "#f2b015";
        }
        //Draw all island shapes
        this.stroke(col);
        this.strokeWeight(5);
        this.fill("green");
        this.ellipse(points[i].x, points[i].y, size);
        //Draw trees and rocks for regular islands
        this.noStroke();
        this.fill("#535353");
        this.ellipse(points[i].x + points[i].stoneX, points[i].y + points[i].stoneY, size / 5);
        this.fill("#105f16");
        this.ellipse(points[i].x + points[i].treeX, points[i].y + points[i].treeY, size / 3);
        this.fill("#0e5213");
        this.ellipse(points[i].x + points[i].treeX, points[i].y + points[i].treeY, size / 4.5);
        //Draw house for starting island
        this.noStroke();
        this.fill("#d89d15");
        this.triangle(start.x - 20, start.y - 20, start.x - 20, start.y + 20, start.x, start.y);
        this.fill("#ce9717");
        this.triangle(start.x + 20, start.y + 20, start.x + 20, start.y - 20, start.x, start.y);
        this.fill("#be8b14");
        this.triangle(start.x - 20, start.y - 20, start.x + 20, start.y - 20, start.x, start.y);
        this.fill("#eab504");
        this.triangle(start.x - 20, start.y + 20, start.x + 20, start.y + 20, start.x, start.y);
        //Shading to add depth to the house
        this.fill("#ebab17");
        this.triangle(start.x - 10, start.y - 10, start.x - 10, start.y + 10, start.x, start.y);
        this.fill("#edad1a");
        this.triangle(start.x + 10, start.y + 10, start.x + 10, start.y - 10, start.x, start.y);
        this.fill("#dba117");
        this.triangle(start.x - 10, start.y - 10, start.x + 10, start.y - 10, start.x, start.y);
        this.fill("#ffc400");
        this.triangle(start.x - 10, start.y + 10, start.x + 10, start.y + 10, start.x, start.y);
    }
    //If the game is on level 0, show help text
    if (points[3].x == (576 / 6 * 5)){
        this.noStroke();
        this.fill("#fff");
        this.textAlign(this.CENTER);
        this.textSize(28);
        this.text("Explore the islands and return home,", 576/2, 50);
        this.text("crossing every bridge only once!", 576/2, 85);
    }
    //If the player has won, display check mark and move to next level
    if (win) {
        this.stroke("#10bc10");
        this.strokeWeight(20);
        this.line(576 / 2 - 50, 576 / 2 - 25, 576 / 2, 576 / 2 + 25);
        this.line(576 / 2, 576 / 2 + 25, 576 / 2 + 100, 576 / 2 - 75);
        //Green border
        this.line(0, 0, 576, 0);
        this.line(576, 0, 576, 576);
        this.line(576, 576, 0, 576);
        this.line(0, 576, 0, 0);
        transition = true;
        setTimeout(function () {
            win = false;
            transition = false;
        }, 2000);
        gameStarted = false;
    }
    //If the player has lost, display a red cross
    if (lost) {
        this.stroke("#b21414");
        this.strokeWeight(20);
        this.line(576 / 2 - 50, 576 / 2 - 50, 576 / 2 + 50, 576 / 2 + 50);
        this.line(576 / 2 - 50, 576 / 2 + 50, 576 / 2 + 50, 576 / 2 - 50);
        //Red border
        this.line(0, 0, 576, 0);
        this.line(576, 0, 576, 576);
        this.line(576, 576, 0, 576);
        this.line(0, 576, 0, 0);
    }
    this.fill(128, 128, 128, 128);
    this.noStroke();
    pb.drawSensors(floor.sensors);
};

function checkStatus(u) {
    for (var i = 0; i < points.length; i++) {
        //Check if user is on a point that is marked "next"
        if (u.x > points[i].x - size / 2 && u.x < points[i].x + size / 2 && u.y > points[i].y - size / 2 && u.y < points[i].y + size / 2 && points[i].status == "next") {
            resetPoints();
            map.push(points[i]);
            active = points[i];
            //If so, mark that point as active
            points[i].status = "active";
            gameStarted = true;
        }
    }
    for (var i = 0; i < edges.length; i++) {
        //Sets all edges to default
        if (edges[i].status != "crossed") {
            edges[i].status = "default";
        }
        if (edges[i].node1.status == "active" || edges[i].node2.status == "active") {
            //Make the edge invisible after it has just been crossed
            if (edges[i].node1 == map[map.length - 2] && edges[i].node2 == map[map.length - 1]) {
                edges[i].cross();
            } else if (edges[i].node2 == map[map.length - 2] && edges[i].node1 == map[map.length - 1]) {
                edges[i].cross();
            }
            //If either point on an edge is active, set to outline
            if (edges[i].status != "crossed") {
                edges[i].status = "outline";
            }
            //Set the point that is NOT active to next
            if (edges[i].node1.status == "active") {
                edges[i].node2.status = "next";
            } else if (edges[i].node2.status == "active") {
                edges[i].node1.status = "next";
            }
        }
    }
}

function checkWin() {
    if (!transition) {
        win = true;
        for (var i = 0; i < edges.length; i++) {
            win = win && (edges[i].status == "crossed");
        }
    }
    if (win && !transition) {
        resetGame();
    }
}

//Set all islands to inactive
function resetPoints() {
    for (var i = 0; i < points.length; i++) {
        points[i].status = "inactive";
    }
}

function resetGame() {
    //Level 1 setup
    else if (level == 1) {
        points = [
            new Point(576 / 2, 576 / 6 - 20),
            new Point(576 / 2, 5 * 576 / 6 - 20),
            new Point(576 / 4, 5 * 576 / 8 - 20),
            new Point(3 * 576 / 4, 5 * 576 / 8 - 20),
            new Point(576 / 4, 3 * 576 / 8 - 20),
            new Point(3 * 576 / 4, 3 * 576 / 8 - 20)
        ]
        edges = [
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
    }
    //Level 2 setup
    else if (level == 2) {
        points = [
            new Point(576 / 8, 3 * 576 / 8), //a 0
            new Point(3 * 576 / 8, 3 * 576 / 8), //b 1
            new Point(5 * 576 / 8, 3 * 576 / 8), //c 2
            new Point(7 * 576 / 8, 3 * 576 / 8), //d 3
            new Point(576 / 8, 5 * 576 / 8), //e 4
            new Point(3 * 576 / 8, 5 * 576 / 8), //f 5
            new Point(5 * 576 / 8, 5 * 576 / 8), //g 6
            new Point(7 * 576 / 8, 5 * 576 / 8), //h 7
            new Point(3 * 576 / 8, 576 / 8), //8
            new Point(3 * 576 / 8, 7 * 576 / 8), //9
            new Point(5 * 576 / 8, 576 / 8), //10
            new Point(5 * 576 / 8, 7 * 576 / 8) //11
        ]
        edges = [
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
            new Edge(points[8], points[1]),
            new Edge(points[5], points[9]),
            new Edge(points[2], points[10]),
            new Edge(points[6], points[11]),
            new Edge(points[8], points[10]),
            new Edge(points[9], points[11])
        ]
    },
    //Level 3 setup
    else if (level == 3) {
        points = [
            new Point(576 / 6, 576 / 2 - 200), //0
            new Point(576 / 2, 576 / 2 - 200), //1
            new Point(576 / 6 * 5, 576 / 2 - 200), //2
            new Point(576 / 2, 576 / 2), //3
            new Point(576 / 6, 576 / 2 + 200), //4
            new Point(576 / 2, 576 / 2 + 200), //5
            new Point(576 / 6 * 5, 576 / 2 + 200), //6
        ]
        edges = [
            new Edge(points[0], points[1]),
            new Edge(points[1], points[2]),
            new Edge(points[2], points[6]),
            new Edge(points[6], points[5]),
            new Edge(points[5], points[4]),
            new Edge(points[4], points[0]),
            new Edge(points[0], points[3]),
            new Edge(points[3], points[2]),
            new Edge(points[0], points[5]),
            new Edge(points[2], points[5])
        ]
    },
    //Level 4 setup
    else if (level == 4) {
        points = [
            new Point(576 / 2, 576 / 2 - 200), //0
            new Point(576 / 2 + 230, 576 / 2 + 200), //1
            new Point(576 / 2 - 230, 576 / 2 + 200), //2
            new Point(576 / 2 - 57, 576 / 2 + 25), //3
            new Point(576 / 2 + 57, 576 / 2 + 25), //4
            new Point(576 / 2, 576 / 2 + 125) //5
        ]
        edges = [
            new Edge(points[0], points[1]),
            new Edge(points[1], points[2]),
            new Edge(points[2], points[0]),
            new Edge(points[0], points[4]),
            new Edge(points[4], points[1]),
            new Edge(points[1], points[5]),
            new Edge(points[5], points[2]),
            new Edge(points[2], points[3]),
            new Edge(points[3], points[0]),
            new Edge(points[3], points[4]),
            new Edge(points[4], points[5]),
            new Edge(points[5], points[3])
        ]
    },
    //Level 5 setup
    else if (level == 5) {
        points = [
            new Point(576 / 2, 576 / 2),
            new Point(576 / 8, 576 / 2),
            new Point(7*576 / 8, 576 / 2),
            new Point(5* 576 / 16, 576 / 8),
            new Point(11* 576 / 16, 576 / 8),
            new Point(5* 576 / 16, 7*576 / 8),
            new Point(11* 576 / 16, 7*576 / 8)
        ]
        edges = [
            new Edge(points[0],points[1]),
            new Edge(points[0],points[2]),
            new Edge(points[0],points[4]),
            new Edge(points[0],points[5]),
            new Edge(points[0],points[6]),
            new Edge(points[0],points[3]),
            new Edge(points[3],points[1]),
            new Edge(points[4],points[2]),
            new Edge(points[5],points[6])
        ]
    }
    //Call a new random level
    level = newLevel(level);
    start = points[Math.floor(Math.random() * points.length)];
    start.status = "next";
    gameStarted = true;
}

function hardReset() {
    //In the event of a loss, hard reset the game back to level 0
    level = 0;
    points = [
        new Point(576 / 6, 576 / 2 - 100),
        new Point(576 / 2, 576 / 2 - 100),
        new Point(576 / 6 * 5, 576 / 2 - 100),
        new Point(576 / 6 * 5, 576 / 2 + 100),
        new Point(576 / 6, 576 / 2 + 100)
    ]
    edges = [
        new Edge(points[0], points[1]),
        new Edge(points[1], points[2]),
        new Edge(points[2], points[3]),
        new Edge(points[4], points[0]),
        new Edge(points[4], points[1]),
        new Edge(points[3], points[1])
    ]
    start = points[0];
    start.status = "next";
    gameStarted = false;
}

//Call a new random level, checking to make sure it doesn't repeat the current level
function newLevel(currentLevel) {
    //If you wish to update amount of levels, increase here
    var rand = Math.floor(Math.random() * 6);
    if (rand == currentLevel) {
        newLevel(currentLevel);
    } else {
        return rand;
    }
}

//Draws random fish for kids to play with
function drawFish(){
    //Increase chance of fish being drawn by decreasing the 100
    var chance = Math.floor(Math.random()*100);
    if (chance == 1){
        fish.push(new Fish());
    }
}

//Create a new island at a given x and y, with a random tree and stone
function Point(x, y) {
    this.x = x;
    this.y = y;
    this.status = "inactive";
    this.treeX = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 15);
    this.treeY = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 15);
    this.stoneX = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 15);
    this.stoneY = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 15);
}

//Create a new bridge between two given points
function Edge(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
    this.status = "default";
    //Mark a bridge as crossed, setting it to contain far away invisible points
    this.cross = function () {
        this.node1 = new Point(1000, 1000);
        this.node2 = new Point(1000, 1000);
        this.status = "crossed";
    }
}

//Create small white particles to add animation to the water
function Particle() {
    this.x = (Math.random() * 576);
    this.y = (Math.random() * 576);
    this.update = function () {
        this.x = this.x + (Math.random() < 0.5 ? -1 : 1) * .3;
        this.y = this.y + (Math.random() < 0.5 ? -1 : 1) * .3;
    }
}

//Create small little fish for kids to watch and even interact with
function Fish() {
    this.x = -10;
    this.y = Math.floor(Math.random()*576);
    this.speed = 5 + Math.floor(Math.random()*3)
    this.hit = false;
}

export const behavior = {
    title: "Eulerian Bridges",
    init: pb.init.bind(pb),
    frameRate: 'sensors',
    render: pb.render.bind(pb),
    numGhosts: 0
};

export default behavior
