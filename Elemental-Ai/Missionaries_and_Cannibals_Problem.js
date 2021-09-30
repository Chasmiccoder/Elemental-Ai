/*

Problem Statement -
===================

Transport 3 Missionaries and 3 Cannibals from Left to Right


State Space Graph Generation -
=============================

Generate all possible states from the root state ( initial state = [0,0] )
The total number of nodes in the graph is finite and small since we'll not explore nodes
more than once.

    1) First generate a list of all possible states

    2) Then generate a new state by making a legal move 
    Once the move is made, check if the new state exists in the graph

    3) If the new state is present in the graph, just add an edge between the parent node and the new state's node
    (if such a node is node is not present)

    4) If the new state is not present in the graph, generate a new node and add the corresponding edge

    5) Call generateGraph() recursively until all the states have been obtained

    6) Keep track of the states to be added
    After adding a new node (state) to the state space graph, remove it from the list that tracks the states to be added
    If at any point this list becomes empty, then we've generated all possible states
    After function execution, the list contains all the impossible states


Possible Operations -
=====================

???


Variable Information -
======================

states - [M,C,B]
An array of 3 elements
M = Number of Missionaries on the Left Hand Side {0,1,2,3}
C = Number of Cannibals on the Left Hand Side {0,1,2,3}
B = Where the boat currently is {'Left Bank', 'Right Bank'}

Searching Algorithms -
======================

    1) BFS


---------------------------------------------
Author - Aryaman Kolhe
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

    addNode(node, state_) {
        this.#nodes[node] = {
            state: state_,
            edges:[],
        };
        this.#n += 1;
    }
    
    addEdge(source, destination, directedGraph = true) {
        // if either node does not exist
        if ( !this.#nodes[source] || !this.#nodes[destination] ) {
            return false;
        }

        let didAdd1 = false;
        let didAdd2 = false;

        // Add an edge from the source to the destination
        if ( !this.#nodes[source].edges.includes(destination) ) {
            this.#nodes[source].edges.push(destination);
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

    deleteNode(nodeID) {
        /*
        First deletes the edges in other nodes that are connected to the node to be deleted
        then deletes the node to be deleted
        */

        for( let i = 0; i < this.#n; i++ ) {
            
            for ( let j = 0; j < this.#nodes[i].edges.length; j++ ) {
                
                if ( this.#nodes[i].edges[j] == nodeID ) {
                    this.#nodes[i].edges.splice(j,1);
                }
            }
        }
        delete this.#nodes[nodeID];
        this.#n -= 1;
    }

    getEdges(node) {
        return this.#nodes[node].edges;
    }

    /**
     * 
     * Returns the node ID of the state.
     * Returns -1 if the state is not found.
     * 
     * @param {Array} state
     * @returns {Number} nodeID of state
     */
    isStatePresent(state) {
        
        for ( let i = 0; i < this.#n; i++ ) {
            
            // If the state is present in the graph (specific to the Missionaries and Cannibals problem)
            if ( this.#nodes[i].state[0] == state[0] && this.#nodes[i].state[1] == state[1] && this.#nodes[i].state[2] == state[2] ) {
                return i;
            }
        }
        return -1;
    }

    // getStateFromNodeID(nodeID) {}


    /**
     * Searches for the destination node from the source node via BFS.
     * Updates the graph dynamically as the search is performed.
     * 
     * @param {Number} source 
     * @param {Number} destination 
     * @returns {Array} Path and number of steps taken
     * 
     */
    bfs(source, destination) {
        let queue = [];
        let visited   = new Array(this.#n);
        let distances = new Array(this.#n);
        let parents   = new Array(this.#n);

        // steps is the number of nodes BFS visited in order to reach the destination node (excluding the source node)
        // it is a measure of how effective the particular searching algorithm is for that problem
        let steps = 0;

        visited.fill(false);

        queue.push(source);
        visited[source] = true;

        graphDraw.addNode( JSON.stringify([0,0]) );

        parents[source] = -1;
        while( queue.length != 0 ) {
            let v = queue.shift();

            let numNeighbors = this.#nodes[v].edges.length;
            for ( let i = 0; i < numNeighbors; i++ ) {
                let u = this.#nodes[v].edges[i];

                if ( visited[u] == false ) {
                    visited[u] = true;
                
                    graphDraw.addNode( JSON.stringify(this.#nodes[u].state) );
                    graphDraw.addEdge( JSON.stringify(this.#nodes[u].state), 
                               JSON.stringify(this.#nodes[v].state), 
                               {
                                   style: {
                                        stroke: '#bfa',
                                        fill: '#56f',
                                       // label: 'Label'
                                   }
                               } );
   
                    steps++;
                    queue.push(u);
                    distances[u] = distances[v] + 1;
                    parents[u] = v;
                }
            }
        }

        if ( visited[destination] == false ) {
            console.log("No path!\n");
            return {};
        }
        else {
            let path = [];
            for ( let v = destination; v != -1; v = parents[v] ) {
                path.push(v);
            }
            path.reverse();
            return {"path" : path, "steps" : steps};
        }
    }

    dfs(source, destination, visited = {} ) {
        if ( visited[source] ) {
            return false;
        }

        if ( source === destination ) {
            return true;
        }

        visited[source] = true;

        const neighbors = this.#nodes[source].edges;

        for ( let i = 0; i < neighbors.length; i++ ) {
            if ( this.dfs(neighbors[i], destination, visited) ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Solves the Water Jug problem using Breadth First Search
     * Returns the path taken to reach the final state along with
     * the number of steps it took BFS to reach the final state
     * 
     * @param {Array} finalState 
     * @return {Number} Solution
     */
    solveBFS(finalState) {
        let source = 0;
        let destination = this.isStatePresent(finalState);

        if ( destination == -1 ) {
            console.log("It is not possible to reach this state!");
            return -1;
        }

        return this.bfs(source, destination);
    }


    /**
     * Solves the Water Jug problem using Depth First Search
     * Returns the path taken to reach the final state along with
     * the number of steps it took DFS to reach the final state
     * 
     * @param {Array} finalState 
     * @return {Number} Solution
     */
    solveDFS(finalState) {
        
    }
}


// optimize this function, make it smaller and generalize it for N Missionaries and M Cannibals
function makeMove(state, move) {
    // making a copy of the original state
    let newState = [...state];
    let rightBank = [capacity[0]-newState[0], capacity[1]-newState[1]]

    // Move one Missionary from Left to Right if the boat is at the Left Bank and if the new state is legal
    if ( move == 0 ) {
        if ( newState[2] == "Left Bank" && newState[0] - 1 >= newState[1] && rightBank[0] + 1 >= rightBank[1] ) {
            newState[0] -= 1;
            newState[2] = "Right Bank";
        }
    }

    // Move one Cannibal from the Left to Right
    if ( move == 1 ) {
        if ( newState[2] == "Left Bank" && newState[0] >= newState[1] - 1 && rightBank[0] >= rightBank[1] + 1 ) {
            newState[1] -= 1;
            newState[2] = "Right Bank";
        }
    }

    // Move two Missionaries from the Left to Right
    if ( move == 2 ) {
        if ( newState[2] == "Left Bank" && newState[0] - 2 >= newState[1] && rightBank[0] + 2 >= rightBank[1] ) {
            newState[0] -= 2;
            newState[2] = "Right Bank";
        }
    }

    // Move two Cannibals from the Left to Right
    if ( move == 3 ) {
        if ( newState[2] == "Left Bank" && newState[0] >= newState[1] - 2 && rightBank[0] >= rightBank[1] + 2 ) {
            newState[1] -= 2;
            newState[2] = "Right Bank";
        }
    }

    // Move one Missionary and one Cannibal from the Left to Right
    if ( move == 4 ) {
        // the extra conditions are mathematically not needed if the current state is legal, but putting it there just in case
        if ( newState[2] == "Left Bank" && newState[0] - 1 >= newState[1] - 1 && rightBank[0] + 1 >= rightBank[1] + 1 ) {
            newState[0] -= 1;
            newState[1] -= 1;
            newState[2] = "Right Bank";
        }
    }

    // Move one Missionary from Right to Left
    if ( move == 5 ) {
        if ( newState[2] == "Right Bank" && newState[0] + 1 >= newState[1] && rightBank[0] - 1 >= rightBank[1] ) {
            newState[0] += 1;
            newState[2] = "Left Bank";
        }
    }

    // Move one Cannibal from Right to Left
    if ( move == 6 ) {
        if ( newState[2] == "Right Bank" && newState[0] >= newState[1] + 1 && rightBank[0] >= rightBank[1] - 1 ) {
            newState[1] += 1;
            newState[2] = "Left Bank";
        }
    }

    // Move two Missionaries from Right to Left
    if ( move == 7 ) {
        if ( newState[2] == "Right Bank" && newState[0] + 2 >= newState[1] && rightBank[0] - 2 >= rightBank[1] ) {
            newState[0] += 2;
            newState[2] = "Left Bank";
        }
    }

    // Move two Cannibals from Right to Left
    if ( move == 6 ) {
        if ( newState[2] == "Right Bank" && newState[0] >= newState[1] + 2 && rightBank[0] >= rightBank[1] - 2 ) {
            newState[1] += 2;
            newState[2] = "Left Bank";
        }
    }

    // Move one Missionary and one Cannibal from Right to Left
    if ( move == 7 ) {
        // the extra conditions are mathematically not needed if the current state is legal, but putting it there just in case
        if ( newState[2] == "Right Bank" && newState[0] + 1 >= newState[1] + 1 && rightBank[0] - 1 >= rightBank[1] - 1 ) {
            newState[0] += 1;
            newState[1] += 1;
            newState[2] = "Left Bank";
        }
    }

    else {
        console.log( "Exit at makeMove()\nCurrent State:" );
        console.log( state );
        console.log( "Move Number:" );
        console.log( move );
    }

    return newState;
}

function generateAllStates(capacity) {
    /*
    Possible states:
    <i,j,L> <i,j,R> for all i,j = 0,1,2,3
    */

    let array = [];
    for( let i = 0; i <= capacity[0]; i++ ) {
        for ( let j = 0; j <= capacity[1]; j++ ) {
            let newStateL = [i,j, "Left Bank"];
            let newStateR = [i,j, "Right Bank"];

            array.push(newStateL);
            array.push(newStateR);
        }
    }

    return array;
}

/** 
 * Deletes an element from an array of states by value
 * 
*/
function deleteState(list, state) {
    
    for ( let i = 0; i < list.length; i++ ) {
        if ( list[i][0] == state[0] && list[i][1] == state[1] && list[i][2] == state[2] ) {
            list.splice(i, 1);
        }
    }
}


/**
 * Generates the required solution state space graph starting from the intial state [0,0]
 * Function terminates when all states that can be generated have been generated and all possible
 * paths have been recorded in the graph
 * 
 * @param {*} graph 
 * @param {*} state 
 * @param {*} stateID 
 * @returns 
 */
 function generateGraph(graph, state, stateID) {

    // if all possible states have been generated, exit the function
    if ( statesToBeAdded.length == 0 ) {
        return;
    }

    for ( let i = 0; i < numberOfMoves; i++ ) {

        let newState = makeMove(state, i);

        // don't consider the newly generated state if it is the same as the previous one
        // { remove first condition of [0,0] }
        if ( state[0] == newState[0] && state[1] == newState[1] && state[2] == newState[2] ) {
            continue;
        }

        let newNodeID = graph.isStatePresent(newState);
        
        // if the generated state is already in the graph, just add an edge between the parent and the found state
        if ( newNodeID != -1 ) {

            // addEdge() adds an edge only if the edge is not present. If it was not present, didAdd becomes false
            // else it is true
            
            let didAdd = graph.addEdge(stateID, newNodeID);

            // this key condition helps terminate all the recursive calls
            if ( didAdd == true ) {
                generateGraph(graph, newState, newNodeID);
            }
        }
        
        // node not found, generate a new one
        else {
            nodeID += 1;
            graph.addNode(nodeID, newState);

            graph.addEdge(stateID, nodeID);
            deleteState(statesToBeAdded, newState);
            
            generateGraph(graph, newState, nodeID);
        }
    }
}


function justSolveIt() {

    let finalState = [0,0,"Right Bank"];

    let solutionBFS = graph.solveBFS(finalState);

    console.log("Steps BFS:", solutionBFS["steps"]);
    console.log("\nSolution Path BFS: ", solutionBFS["path"]);

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
graph.addNode(0, [3,3,"Left Bank"]);


var nodeID = 0;
var numberOfMoves = 8;

// Here, capacity is an array of two elements [Total_M, Total_C]
// where Total_M is the total number of Missionaries and Total_C is the total number of Cannibals
var capacity = [3,3];


// contains all possible states that need to be present in the tree.
var statesToBeAdded = generateAllStates(capacity);

deleteState(statesToBeAdded, [0,0,"Left Bank"]);

console.log("States to be Added: ", statesToBeAdded);

generateGraph(graph, [3,3,"Left Bank"], 0);

console.log("State Space Graph:");
graph.displayGraph();

// It turns out that some states just cannot be reached. They'll be present in statesToBeAdded
console.log("Impossible States:", statesToBeAdded);
console.log("\n\n");

document.getElementById("solveID").addEventListener("click", justSolveIt);

console.log("\nReached the end");

