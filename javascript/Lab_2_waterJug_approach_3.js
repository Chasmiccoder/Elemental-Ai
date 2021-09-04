/*
Concept -
=========
Generate all possible states from the root state ( initial state = [0,0] )
The total number of nodes in the graph is finite and small since we'll not explore nodes
more than once


Possible Operations -
=====================
Empty Jug A
Empty Jug B
Fill Jug A
Fill Jug B

Pour Contents of A in B: if (amount of water in B < capacity of B) and A can fully fill B and still have water leftover 
Pour Contents of A in B: if (amount of water in B < capacity of B) and A can fill B until A runs out of water (B still has some empty space)

Pour Contents of B in A: if (amount of water in A < capacity of A) and B can fully fill A and still have water leftover 
Pour Contents of B in A: if (amount of water in A < capacity of A) and B can fill A until B runs out of water (A still has some empty space)



State Space Graph Generation -
=============================

New searching / exploring logic. First generate a list of all possible states.
Then generate a new state by making a move. Once the move is made, check if the new state exists in the graph.

If the new state is present in the graph, just add an edge between the parent node and the new state's node
(if such a node is node is not present). If the connection between the parent node and the new state
is already there, then do ???

If the new state is not present in the graph, generate a new node and add the corresponding edge.
Call generateGraph() until all the states have been obtained.
Con of this apprach: If a particular state is not possible, we'll end up in an infinite loop.
Think of a way to prevent this.



In the newExplore() function check if the new state belongs to the list of states to be generated.
If it does, then return false, which means that we have to add the state.
If it doesn't then return true, because this state has already been added.
Keep generating the tree until statesToBeAdded becomes empty.

This new tree generation approach means that we won't need to find the shortest distance, 
and we won't need smartExplore


Notes -
=======

need to use recursion to generate the graph
We don't need a graph explicitly to solve the problem, but will need one for the visualization

define previous state
define set of all moves
make a move on previous state. Check if the obtained state is legal.
If legal, officially make the move and recursively solve. Then move on to the next move
If not legal, don't make that move, go to the next one


Variables
states - An array of 2 elements with the number of litres of water in each of the two jugs


Solving the Water Jug Problem
We'll first implement the specific searching algorithm. Then, as each node gets 'visited',
we'll update the graph to change the colour of the visited node.
At then end, we'll use the shortest path function to highlight the path that the user can take
to solve the problem.
At the right hand side display the number of nodes the algorithm had to visit in order to
reach the final state. This is a measure of how good the searching algo is for that particular problem

1) BFS





*/


class Graph {
    #nodes;

    constructor() {
        this.#nodes = {};
    }

    addNode(node, state_) {
        this.#nodes[node] = {
            state: state_,
            edges:[],
        };
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

        let N = Object.keys(this.#nodes).length; // number of nodes in the graph

        for( let i = 0; i < N; i++ ) {
            
            for ( let j = 0; j < this.#nodes[i].edges.length; j++ ) {
                
                if ( this.#nodes[i].edges[j] == nodeID ) {
                    
                    this.#nodes[i].edges.splice(j,1);
                }
            }
        }
        delete this.#nodes[nodeID];
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
        
        let N = Object.keys(this.#nodes).length; // number of nodes in the graph
        for ( let i = 0; i < N; i++ ) {
            
            // If the state is present in the graph
            if ( this.#nodes[i].state[0] == state[0] && this.#nodes[i].state[1] == state[1] ) {
                return i;
            }
        }
        return -1;
    }


    /**
     * Searches for the destination node from the source node via BFS.
     * Updates the graph dynamically as the search is performed.
     * 
     * @param {Number} source 
     * @param {Number} destination 
     * @returns {Number} Number of nodes visited to find the destination. -1 if not found
     */
    bfs(source, destination) {
        let found = false;
        const queue = [source];
        const visited = {};
        let steps = 1;

        while ( queue.length ) {
            let current = queue.shift();
            if ( visited[current] ) {
                continue;
            }

            if ( current === destination ) {
                found = true;
                break;
            }

            visited[current] = true;
            steps++;
            let neighbor = this.#nodes[current].edges;
            for ( let i = 0; i < neighbor.length; i++ ) {
                queue.push(neighbor[i]);
            }
        }

        if ( !found ) {
            return -1;
        }

        return steps;
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
     * Solves the Water Jug problem using BFS
     * 
     * @param {Array} finalState 
     * @return {Number} Number of Steps taken to reach the final state
     */
    solveBFS(finalState) {
        let path = [];
        
        let initialState = [0,0];

        let source = 0;
        let destination = this.isStatePresent(finalState);

        if ( destination == -1 ) {
            console.log("It is not possible to reach this state!");
            return -1;
        }

        let steps = this.bfs(source, destination);

        return steps;
    }
}


function makeMove(state, move) {
    // making a copy of the original state
    newState = [...state]; 

    // console.log("ENTERING ", move);
    // console.log("Old State:", state);

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








/*

Main
====


*/








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


// Final states
let finalState = [2,0]


graph.solveBFS(finalState);

graph.bfs()


console.log("Reached the end");






/*

Use shortest distance code from approach 2
*/

