/*

CBS3004 - Artificial Intelligence, Mid Term Examination

Problem Statement -
===================
Use the A* Search Algorithm on the graph to find a path from node A to node B. 
Each edge is labelled by the cost to traverse that edge. Each node is labelled by a capital letter. 
Also, we are given a heuristic function h as follows:

h(A) = 5, 
h(B)  = 0, 
h(C) = 1, 
h(D) = 6, 
h(E ) = 2

Variable Information -
======================


Searching Algorithm Deployed
=============================

    A* Search


---------------------------------------------
Author - Aryaman Kolhe, 22nd October, 2021
This code is Licensed under the MIT Licence
---------------------------------------------
*/

class Graph {
    #nodes;
    #n; // number of nodes

    constructor() {
        this.#nodes = {};
        this.#n = 0;
    }

    addNode(node, heuristic_cost) {
        this.#nodes[node] = {
            heuristic_cost: heuristic_cost,
            current_cost: 0,
            edges:[], //format edges[i] = [p,q] where p is destination node and q is cost
        };
        this.#n += 1;
    }
    
    addEdge(source, destination, cost, directedGraph = true) {
        // if either node does not exist
        if ( !this.#nodes[source] || !this.#nodes[destination] ) {
            return false;
        }

        let didAdd1 = false;
        let didAdd2 = false;

        // Add an edge from the source to the destination
        if ( !this.#nodes[source].edges.includes(destination) ) {
            this.#nodes[source].edges.push([destination, cost]);

            didAdd1 = true;
        }

        // Add an edge from destination to source if the graph is undirected
        if ( !directedGraph ) {
            if ( !this.#nodes[destination].edges.includes(source) ) {
                this.#nodes[destination].edges.push(source);
                didAdd2 = true;
            }
        }
        
        return didAdd1 || didAdd2; // if a change was made to the graph, return true
    }

    displayGraph() {
        console.log(this.#nodes);
    }

    aStarSearch(startNode, goalNode) {
        let STEPS = 0;
        let PATH = [];

        // Distances from the start node to all other nodes
        var distances = [];

        for (var i = 0; i < graph.#n; i++) distances[i] = Number.MAX_VALUE;

        distances[startNode] = 0;

        //This contains the priorities with which to visit the nodes, calculated using the heuristic.
        var priorities = [];

        //Initializing with a priority of "Infinity"
        for (var i = 0; i < graph.#n; i++) priorities[i] = Number.MAX_VALUE;

        priorities[startNode] = graph.#nodes[0]["heuristic_cost"]; 

        var visited = []; 

        while (true) {
            STEPS++;

            // Find the node with the currently lowest priority
            var lowestPriority = Number.MAX_VALUE;
            var lowestPriorityIndex = -1;
            for (var i = 0; i < priorities.length; i++) {
                if (priorities[i] < lowestPriority && !visited[i]) {
                    lowestPriority = priorities[i];
                    lowestPriorityIndex = i;
                }
            }

            if (lowestPriorityIndex === -1) {
                return -1;
            } else if (lowestPriorityIndex === goalNode) {
                let solution = {
                    steps:STEPS,
                    path: PATH,
                    cost:distances[lowestPriorityIndex]
                };
                return solution;
            }
            for(var i = 0; i < graph.#nodes[lowestPriorityIndex].edges.length; i++) {

                let neighborCost = graph.#nodes[lowestPriorityIndex].edges[i][1];

                if( neighborCost !== 0 && !visited[i] ) {
                    if( distances[lowestPriorityIndex] + neighborCost < distances[i] ) {
                        distances[i] = distances[lowestPriorityIndex] + neighborCost;

                        priorities[i] = distances[i] + graph.#nodes[i]["heuristic_cost"];

                    }
                }
            }

            visited[lowestPriorityIndex] = true;
        }
    }
}

function solve() {

    let start = 0; // A
    let goal = 1; // B

    let solution_A_star = graph.aStarSearch(start, goal);

    console.log("Steps Taken:", solution_A_star["steps"]);
    console.log("\nSolution Path via A Star Search: ", solution_A_star["path"]);

    let pathDict = {0:'A', 1:'B', 2:'C', 3:'D', '4': 'E'};

    for ( let i = 0; i < solution_A_star["path"].length; i++ ) {
        console.log( pathDict[ solution_A_star["path"][i] ] );
    }

    console.log("Solution Cost: ", solution_A_star["cost"]);

    var layouter = new Layout(graphDraw);
    layouter.layout();

    var renderer = new Renderer('#paper', graphDraw, 600, 600);
    renderer.draw();
}

// globals:
var Dracula = require('graphdracula');

var Graph2 = Dracula.Graph
var Renderer = Dracula.Renderer.Raphael
var Layout = Dracula.Layout.Spring

// Graph to be drawn (Dracula object)
var graphDraw = new Graph2();

// Graph involved in actual computation. My Graph Object
let graph = new Graph();

// Generating the State Space graph and feeding in the heuristics
// A = 0, B = 1, C = 2, D = 3, E = 4
graph.addNode(0,5);
graph.addNode(1,0);
graph.addNode(2,1);
graph.addNode(3,6);
graph.addNode(4,2);

// For visual representation of state space
graphDraw.addNode( "A" );
graphDraw.addNode( "B" );
graphDraw.addNode( "C" );
graphDraw.addNode( "D" );
graphDraw.addNode( "E" );

graphDraw.addEdge( "A", "D", {style: {label: "1",}} );
graphDraw.addEdge( "A", "B", {style: {label: "7",}} );
graphDraw.addEdge( "A", "E", {style: {label: "3",}} );
graphDraw.addEdge( "E", "B", {style: {label: "4",}} );
graphDraw.addEdge( "E", "C", {style: {label: "2",}} );
graphDraw.addEdge( "D", "C", {style: {label: "5",}} );
graphDraw.addEdge( "C", "B", {style: {label: "1",}} );


// source, destination, cost
graph.addEdge(0,1,7);
graph.addEdge(0,4,3);
graph.addEdge(0,2,1);
graph.addEdge(4,1,4);
graph.addEdge(4,2,2);
graph.addEdge(2,1,1);
graph.addEdge(3,2,5);


console.log("State Space Graph:");
graph.displayGraph();

console.log("\n\n");
document.getElementById("solveID").addEventListener("click", solve);
console.log("\nReached the end");