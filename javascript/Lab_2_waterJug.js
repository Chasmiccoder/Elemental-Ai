/*
Idea:
Generate all possible states from the root state ( initial state = [0,0] )
The total number of nodes in the graph is finite and small since we'll not explore nodes
more than once

*/

class Graph {
    #nodes;

    constructor() {
        this.#nodes = {};
    }

    addNode(node, state_) {
        // this.#nodes[node] = [];

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


let graph = new Graph();

graph.addNode(0, [0,0]);

// Keeps track of the states added while generating the graph
var statesAdded = [];
statesAdded.push( [0,0] );

var numberOfMoves = 6;
var nodeID = 0;
var capacity = [4,3];

function makeMove(state, move) {
    newState = [...state]; // making a copy of the state

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
                newState[1] = newState[1];
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
                newState[0] = newState[0];
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


function isValidState(newState) {
    // may not be needed since all moves create valid states by definition
    return true;
}

function isExplored(newState) {
    for ( let i = 0; i < statesAdded.length; i++ ) {
        
        if ( statesAdded[i][0] === newState[0] && statesAdded[i][1] === newState[1] ) {
            return true;
        } 
    }
    return false;
}


// start this by calling generateGraph(graph, [0,0])
// Generates the required solution tree / the entire state space starting from the intial state [0,0] 
function generateGraph(graph, state) {

    for ( let i = 0; i < numberOfMoves; i++ ) {

        let newState = makeMove(state, i);

        if ( !isExplored(newState) ) {
            
            nodeID += 1;
            graph.addNode(nodeID, newState);
            graph.addEdge(state, newState); // THIS IS NOT WORKING
            statesAdded.push( newState );

            generateGraph(graph, newState);
        }
    }
}



generateGraph(graph, [0,0]);
graph.displayGraph();







/*
Possible Operations:
Empty Jug A
Empty Jug B
Fill Jug A
Fill Jug B

Pour Contents of A in B: if (amount of water in B < capacity of B) and A can fully fill B and still have water leftover 
Pour Contents of A in B: if (amount of water in B < capacity of B) and A can fill B until A runs out of water (B still has some empty space)

Pour Contents of B in A: if (amount of water in A < capacity of A) and B can fully fill A and still have water leftover 
Pour Contents of B in A: if (amount of water in A < capacity of A) and B can fill A until B runs out of water (A still has some empty space)

*/


// need to use recursion to generate the graph
// We don't need a graph explicitly to solve the problem, but will need one for the visualization


/*
define previous state
define set of all moves
make a move on previous state. Check if the obtained state is legal.
If legal, officially make the move and recursively solve. Then move on to the next move
If not legal, don't make that move, go to the next one


*/






