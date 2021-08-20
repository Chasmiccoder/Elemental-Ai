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



State Space Tree Generation -
=============================

New searching / exploring logic. First generate a list of all possible states
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

        // states is an array of 2 elements with the number of litres of water in each of the two jugs

    }

    addEdge(source, destination) {
        // if either node does not exist
        if ( !this.#nodes[source] || !this.#nodes[destination] ) {
            return false;
        }
        
        if ( !this.#nodes[source].edges.includes(destination) ) {
            this.#nodes[source].edges.push(destination);
        }

        if ( !this.#nodes[destination].edges.includes(source) ) {
            this.#nodes[destination].edges.push(source);
        }
    }

    displayGraph() {
        console.log(this.#nodes);
    }

    deleteNode(nodeID) {
        // first deletes the edges in other nodes that are connected to the node to be deleted
        // then deletes the node to be deleted

        let N = Object.keys(this.#nodes).length;

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


    bfs(source, destination) {
        const queue = [source];
        const visited = {};

        while ( queue.length ) {
            let current = queue.shift();
            if ( visited[current] ) {
                continue;
            }

            if ( current === destination ) {
                return true;
            }

            visited[current] = true;
            let neighbor = this.#nodes[current].edges;
            for ( let i = 0; i < neighbor.length; i++ ) {
                queue.push(neighbor[i]);
            }
        }

        return false;
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

/*
function isExplored(newState) {
    for ( let i = 0; i < statesAdded.length; i++ ) {
        
        if ( statesAdded[i][0] === newState[0] && statesAdded[i][1] === newState[1] ) {
            return true;
        }
    }
    return false;
}

// might not need this function rip
function shortestDistance(graph, sourceNodeID, destinationNodeID, n) {
    // Returns the distance between the source and destination node in a given graph
    // done via BFS
    // n = Total number of nodes

    let visited = [];
    let distance = [];
    
    for ( let i = 0; i <= n; i++ ) {
        visited.push(false);
        distance.push(0);
    }
    
    // use array as queue with push() and shift() functions
    let queue = [];
    
    distance[sourceNodeID] = 0;

    queue.push(sourceNodeID);
    visited[sourceNodeID] = true;

    while ( queue.length != 0 ) {
        let x = queue.shift(); // dequeue 

        let edgesOfX = graph.getEdges(x);

        for ( let i = 0; i < edgesOfX.length; i++ ) {

            if ( visited[ edgesOfX[i] ] ) {
                continue;
            }

            distance[ edgesOfX[i] ] = distance[ x ] + 1;
            queue.push( edgesOfX[i] );
            visited[ edgesOfX[i] ] = true;
        }
    }

    return distance[destinationNodeID];
}
*/


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

function alreadyInBranch(pathList, state) {
    /*
    Returns true if the state is present in the pathList
    Later, change this function to a more generalized one
    */
    for ( let i = 0; i < pathList.length; i++ ) {
        if ( pathList[i][0] == state[0] && pathList[i][1] == state[1] ) {
            return true;
        }
    }
    return false;
}


// start this by calling generateGraph(graph, [0,0])
// Generates the required solution tree / the entire state space starting from the intial state [0,0] 
function generateGraph(graph, state, stateID, pathList) {

    for ( let i = 0; i < numberOfMoves; i++ ) {

        let newState = makeMove(state, i);

        // don't consider the newly generated state if it is the same as the previous one
        // { remove first condition of [0,0] }
        if ( (newState[0] == 0 && newState[1] == 0) || (state[0] == newState[0] && state[1] == newState[1]) ) {
            continue;
        }

        /*
        Each branch must have a unique state.
        For example, for tree: 
                  0
                /  \
              1     2
             / \   / \
            3  4  5   6
           /
          1

        Here after state 1, we got state 3, then we got state 1 again.
        This happens because one move is Empty Jug A, and right after that, move Fill Jug A takes place
        and we get an infinite loop.
        To break this loop, each path will contain a path list. A path is defined as the set of 
        nodes from the root node to the node under consideration (newState's node). If we add a node
        to the graph, we'll update the path list. If in a future recursive call, newState is equal to
        some state that exists in the path list, then we'll not consider it / we'll not add it

        */
        if ( alreadyInBranch(pathList, newState) ) {
            continue;
        }

        if ( statesToBeAdded.length != 0 ) {
            nodeID += 1;
            graph.addNode(nodeID, newState);
            graph.addEdge(stateID, nodeID);
            console.log("Before num: ", statesToBeAdded.length);
            deleteState(statesToBeAdded, newState);
            console.log("After num: ", statesToBeAdded.length);
            console.log("State added:", newState);
            console.log("STATES to be added:", statesToBeAdded);
            console.log("Graph " );
            graph.displayGraph();
            generateGraph(graph, newState, nodeID);
        }
        else {
            console.log("REACHED:");
        }
    }
}








/*

Main
====


*/


/*
Test graph

    0
   1  2
   3
   4


let g =  new Graph();
g.addNode(0, [0,0]);
g.addNode(1, [0,3]);
g.addNode(2, [4,0]);
g.addNode(3, [0,4]);
g.addNode(4, [2,2]);

g.addEdge(0,1);
g.addEdge(0,2);
g.addEdge(3,1);
g.addEdge(3,4);

let result = shortestDistance(g, 0,4,5);

console.log("RESULT: ", result);

result = shortestDistance(g,0,2,5);
console.log("RESULT: ", result);
*/


let graph = new Graph();

graph.addNode(0, [0,0]);

var numberOfMoves = 6;
var nodeID = 0;
var capacity = [4,3];

// contains all possible states that need to be present in the tree.
var statesToBeAdded = generateAllStates(capacity);


deleteState(statesToBeAdded, [0,0]);

console.log("KSKFSNFKSNF", statesToBeAdded);


// initial path list is has only the root node
pathList = [[0,0]];

generateGraph(graph, [0,0], 0);
graph.displayGraph();
console.log("Reached the end");



