/*

Problem Statement -
===================

The fox, goose and bag of beans problem is described as follows: 
A farmer must transport a fox, goose and bag of beans from one side of a 
river to another using a boat which can only hold one item in addition to 
the farmer, subject to the constraints that the fox cannot be left alone 
with the goose, and the goose cannot be left alone with the beans. 

In this context, find a solution path by defining appropriate production 
rules and state space search using Depth First Search (avoid repeated states).


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




Variable Information -
======================

states - [ Fox, Goose, Beans, Farmer ]
An array of 4 elements
Positions of the characters can be {'Left', 'Right'}


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
            if ( this.#nodes[i].state[0] == state[0] && this.#nodes[i].state[1] == state[1] && this.#nodes[i].state[2] === state[2] && this.#nodes[i].state[3] === state[3] ) {
                return i;
            }
        }
        return -1;
    }

    getStateFromNodeID(nodeID) {
        return this.#nodes[nodeID].state;
    }

    // dfs(source, destination, visited = {} ) {
    dfs(source, destination) {
        // let path = new Array(this.#n);
        let path = [];

        // let s = new Array(this.#n); // stack
        let s = [];

        let explored = new Set();
        s.push(source);

        console.log("DFS Path:");
        let previous = 0;

        // explore the source node
        explored.add(source);

        // loop until the stack is empty
        while (s.length > 0) {
            let t = s.pop();

            // current node being visited
            console.log(t);
            graphDraw.addNode( JSON.stringify( this.#nodes[t].state) );

            if(previous != 0) {
                graphDraw.addEdge( JSON.stringify(this.#nodes[t].state), 
                               JSON.stringify(this.#nodes[previous].state), 
                               {
                                   style: {
                                        stroke: '#bfa',
                                        fill: '#56f',
                                   }
                               } );
            }
            

            if(t == destination) {
                return true;
            }

            // In the edges object, search for nodes this node is directly connected to and filter out the nodes that have already been explored.
            // Then mark each unexplored node as explored and push it to the Stack.
   
            this.#nodes[t].edges.filter(n => !explored.has(n)).forEach(n => {
                explored.add(n);
                s.push(n);
            })

            previous = t;
        }

        return false;
    }


    /**
     * Solves the problem using Depth First Search
     * Returns the path taken to reach the final state along with
     * the number of steps it took DFS to reach the final state
     * 
     * @param {Array} finalState 
     * @return {Number} Solution
     */
    solveDFS(finalState) {
        let source = 0;
        return this.dfs(source, finalState);
    }
}

// returns true if the state is valid, otherwise returns false
function stateIsValid(state) {
    
    // if the fox and goose are in the same bank, but if the farmer is not there,
    // then the state is invalid
    if(state[0] == state[1] && state[0] != state[3]) {
        return false;
    }

    // if the goose and the beans are at the same bank, but if the farmer is not there,
    // then the state is invalid
    else if(state[1] == state[2] && state[1] != state[3]) {
        return false;
    }

    return true;
}


function makeMove(state, move) {
    // making a copy of the original state
    let newState = [...state];

    // move the farmer only
    if(move == 0) {
        if(newState[3] == "Left") {
            newState[3] = "Right";
        } else {
            newState[3] = "Left";
        }
    }

    // if the farmer and the fox are in the same bank, move both of them
    else if(move == 1) {
        if(newState[0] == newState[3]) {
            if(newState[0] == "Left") {
                newState[0] = "Right";
                newState[3] = "Right";
            } else {
                newState[0] = "Left";
                newState[3] = "Left";
            }
        }
    }

    // if the farmer and the goose are in the same bank, move both of them
    else if(move == 2) {
        if(newState[1] == newState[3]) {
            if(newState[1] == "Left") {
                newState[1] = "Right";
                newState[3] = "Right";
            } else {
                newState[1] = "Left";
                newState[3] = "Left";
            }
        }
    }

    // if the farmer and the beans are on the same bank, move both of them
    else if(move == 3) {
        if(newState[2] == newState[3]) {
            if(newState[2] == "Left") {
                newState[2] = "Right";
                newState[3] = "Right";
            } else {
                newState[2] = "Left";
                newState[3] = "Left";
            }
        }
    }

    else {
        console.log( "Exit at makeMove()\nCurrent State:" );
        console.log( state );
        console.log( "Move Number:" );
        console.log( move );
    }

    // return the new state only if it's valid
    if(stateIsValid(newState)) {
        return newState;
    } else {
        return state;
    }
}

function generateAllStates() {
    /*
    Possible states:
    <Fox, Goose, Beans, Farmer> for all characters belonging to {'Left', 'Right'}
    Since the array has 4 values, the total number of possible
    states will be 2^4 = 16
    */

    let array = [];

    for(let i1 = 0; i1 < 2; i1++) {
        for(let i2 = 0; i2 < 2; i2++) {
            for(let i3 = 0; i3 < 2; i3++) {
                for(let i4 = 0; i4 < 2; i4++) {
                    let newState = [];
                    if(i1 == 0) {
                        newState.push("Left");
                    } else {
                        newState.push("Right");
                    }

                    if(i2 == 0) {
                        newState.push("Left");
                    } else {
                        newState.push("Right");
                    }

                    if(i3 == 0) {
                        newState.push("Left");
                    } else {
                        newState.push("Right");
                    }

                    if(i4 == 0) {
                        newState.push("Left");
                    } else {
                        newState.push("Right");
                    }

                    array.push(newState)
                }
            }
        }
    }

    return array;
}


// Deletes an element from an array of states by value 
function deleteState(list, state) {
    
    for ( let i = 0; i < list.length; i++ ) {
        if ( list[i][0] == state[0] && list[i][1] == state[1] && list[i][2] == state[2] && list[i][3] == state[3] ) {
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
        if ( state[0] == newState[0] && state[1] == newState[1] && state[2] == newState[2] && state[3] == newState[3] ) {
            continue;
        }

        let newNodeID = graph.isStatePresent(newState);
        
        // if the generated state is already in the graph, just add an edge between the parent and the found state
        if ( newNodeID != -1 ) {

            // addEdge() adds an edge only if the edge is not present. If it was not present, didAdd becomes false
            // else it is true
            let didAdd = graph.addEdge(stateID, newNodeID);
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

    let finalState = ["Right", "Right", "Right", "Right"]

    let solutionDFS = graph.solveDFS(finalState);

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
graph.addNode(0, ["Left","Left","Left","Left"]); // everyone starts at the left bank

var nodeID = 0;
var numberOfMoves = 4;

// contains all possible states that need to be present in the tree.
var statesToBeAdded = generateAllStates();

deleteState(statesToBeAdded, ["Left","Left","Left","Left"]);

console.log("States to be Added: ", statesToBeAdded);

generateGraph(graph, ["Left","Left","Left","Left"], 0);

console.log("State Space Graph:");
graph.displayGraph();

// It turns out that some states just cannot be reached. They'll be present in statesToBeAdded
console.log("Impossible States:", statesToBeAdded);
console.log("\n\n");

document.getElementById("solveID").addEventListener("click", justSolveIt);

console.log("\nReached the end");


