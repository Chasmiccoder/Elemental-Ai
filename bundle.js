/*
// Graph Dracula Demo
var Dracula = require('graphdracula')

var Graph = Dracula.Graph
var Renderer = Dracula.Renderer.Raphael
var Layout = Dracula.Layout.Spring

var graph = new Graph()

graph.addEdge('Banana', 'Apple')
graph.addEdge('Apple', 'Kiwi')
graph.addEdge('Apple', 'Dragonfruit')
graph.addEdge('Dragonfruit', 'Banana')
graph.addEdge('Kiwi', 'Banana')

var layout = new Layout(graph)
var renderer = new Renderer('#paper', graph, 400, 300)
renderer.draw()

console.log("BRO working");

// module.exports = function (n) { return n * 111 }
*/

const { stringify } = require("uuid");

// from Lab2 Water Jug Problem Approach 3:
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

        // let N = Object.keys(this.#nodes).length; // number of nodes in the graph


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
        
        // let N = Object.keys(this.#nodes).length; // number of nodes in the graph
        for ( let i = 0; i < this.#n; i++ ) {
            
            // If the state is present in the graph
            if ( this.#nodes[i].state[0] == state[0] && this.#nodes[i].state[1] == state[1] ) {
                return i;
            }
        }
        return -1;
    }

    // getStateFromNodeID(nodeID) {

    // }


    /**
     * Searches for the destination node from the source node via BFS.
     * Updates the graph dynamically as the search is performed.
     * 
     * @param {Number} source 
     * @param {Number} destination 
     * @returns {Array} Path and number of steps taken
     * 
     */
    async bfs(source, destination) {
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

        await new Promise(r => setTimeout(r, 2000));
        // sleep(5000).then(() => {
        //     renderer.draw();
        // });
        renderer.draw();
       

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
                               JSON.stringify(this.#nodes[v].state) );
                    
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

// For the animation
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// optimize this function, make it smaller and generalize it for n jugs (right now supports only 2 jugs)
function makeMove(state, move) {
    // making a copy of the original state
    newState = [...state]; 

    // Empty Jug A
    if ( move == 0 ) {
        newState[0] = 0;
    }
    // Empty Jug B
    else if ( move == 1 ) {
        newState[1] = 0;
    }
    // Fill Jug A
    else if ( move == 2 ) {
        newState[0] = capacity[0];
    }
    // Fill Jug B
    else if ( move == 3 ) {
        newState[1] = capacity[1];
    }

    // Pour Contents of A in B
    // Case 1 - A can fully fill B. A may or may not have water left
    // Case 2 - A will fill B until it runs out of water. B may or may not be full
    else if ( move == 4 ) {

        // if Jug B is not full
        if ( newState[1] < capacity[1] ) {

            // case 1
            if ( capacity[1] - newState[1] < newState[0] ) {
                // A = A - (3-B), B = 3
                newState[0] -= capacity[1] - newState[1];
                newState[1] = capacity[1];
            }
            
            // case 2
            else {
                // B = B + A, A = 0
                newState[1] += newState[0];
                newState[0] = 0;
            }
        }
        
    }

    // Pour Contents of B in A
    // Case 1 - B can fully fill A. B may or may not have water left
    // Case 2 - B will fill A until it runs out of water. A may or may not be full
    else if ( move == 5 ) {

        // if Jug A is not full
        if ( newState[0] < capacity[0] ) {

            // case 1
            if ( capacity[0] - newState[0] < newState[1] ) {
                // B = B - (4-A), A = 4
                newState[1] -= capacity[0] - newState[0];
                newState[0] = capacity[0];
            }
            
            // case 2
            else {
                // A = A + B, B = 0
                newState[0] += newState[1];
                newState[1] = 0;
            }
        }
    }

    else {
        console.log( "Exit at makeMove()\nCurrent State:" );
        console.log( state );
        console.log( "Move Number:" );
        console.log( move );
        //Use process.exit(0); in nodeJS. Learn NodeJS
        // Put this whole thing in 1 line
    }

    return newState;
}

function generateAllStates(capacity) {
    /*
    Number of possible states for jugs of capacity 4 and 3 is:
    (4+1) * (3+1)
    */

    let array = [];
    for( let i = 0; i <= capacity[0]; i++ ) {
        for ( let j = 0; j <= capacity[1]; j++ ) {
            let newState = [i,j];
            array.push(newState);
        }
    }

    return array;
}

/** 
 * Function explanation
*/
function deleteState(list, state) {
    /*
    Deletes an element from an array, by value
    Deletes a state from a list of states
    */
    
    for ( let i = 0; i < list.length; i++ ) {
        if ( list[i][0] === state[0] && list[i][1] == state[1] ) {
            list.splice(i, 1);
        }
    }
}


// start this by calling generateGraph(graph, [0,0])
// Generates the required solution tree / the entire state space starting from the intial state [0,0] 
function generateGraph(graph, state, stateID) {
    /*
    Function terminates when all states that can be generated have been generated and all possible
    paths have been recorded in the graph
    */

    // if all possible states have been generated, exit the function
    if ( statesToBeAdded.length == 0 ) {
        return;
    }

    for ( let i = 0; i < numberOfMoves; i++ ) {

        let newState = makeMove(state, i);

        // don't consider the newly generated state if it is the same as the previous one
        // { remove first condition of [0,0] }
        if ( state[0] == newState[0] && state[1] == newState[1] ) {
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

    console.log("Executed my boii!!");
    // alert("Reached, my boi");
    
    // Final states
    let finalState = [2,0];

    let solutionBFS = graph.solveBFS(finalState);

    console.log("Steps BFS:", solutionBFS["steps"]);
    console.log("\nSolution Path BFS: ", solutionBFS["path"]);

    
    // renderer.draw()

    console.log("BRO working");

    // let solutionDFS = graph.solveDFS(finalState);

}


// globals:
var Dracula = require('graphdracula')

var Graph2 = Dracula.Graph
var Renderer = Dracula.Renderer.Raphael
var Layout = Dracula.Layout.Spring

// Graph to be drawn (Dracula object)
var graphDraw = new Graph2();

// Graph involved in actual computation. My Graph Object
let graph = new Graph();
graph.addNode(0, [0,0]);

var numberOfMoves = 6;
var nodeID = 0;
var capacity = [4,3];

// contains all possible states that need to be present in the tree.
var statesToBeAdded = generateAllStates(capacity);


deleteState(statesToBeAdded, [0,0]);

console.log("States to be Added: ", statesToBeAdded);

generateGraph(graph, [0,0], 0);

console.log("State Space Graph:");
graph.displayGraph();

// It turns out that some states just cannot be reached. They'll be present in statesToBeAdded
console.log("Impossible States:", statesToBeAdded);
console.log("\n\n");

var layout = new Layout(graphDraw);
var renderer = new Renderer('#paper', graphDraw, 400, 300);

document.getElementById("solveID").addEventListener("click", justSolveIt);











console.log("\nReached the end");
