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

    // works
    deleteNode(nodeID) {
        // first deletes the edges in other nodes that are connected to the node to be deleted
        // then deletes the node to be deleted

        let N = Object.keys(this.#nodes).length;

        for( let i = 0; i < N; i++ ) {
            // console.log("SKLFNLNS");
            for ( let j = 0; j < this.#nodes[i].edges.length; j++ ) {
                // console.log("BROK: ", this.#nodes[i].edges[j] )
                if ( this.#nodes[i].edges[j] == nodeID ) {
                    // console.log("IS IT EVEN");
                    // delete this.#nodes[i].edges[j];
                    // console.log( this.#nodes[i].edges );
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

// Keeps track of the states added while generating the graph
var statesAdded = [];
statesAdded.push( [0,0] );

var numberOfMoves = 6;
var nodeID = 0;
var capacity = [4,3];

function makeMove(state, move) {
    newState = [...state]; // making a copy of the state

    console.log("ENTERING ", move);
    console.log("Old State:", state);

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

    // NOTE THIS IS WRONG getting [2,3]->[2,1], [3,3] -> [3,2]
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

    // NOTE THIS IS WRONG getting [2,3]->[2,1]
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

    console.log("NEW STATE AFTER MOVE:", newState);

    return newState;
}

function isExplored(newState) {
    for ( let i = 0; i < statesAdded.length; i++ ) {
        
        if ( statesAdded[i][0] === newState[0] && statesAdded[i][1] === newState[1] ) {
            return true;
        }
    }
    return false;
}

// untested (Working now)
function shortestDistance(graph, sourceNodeID, destinationNodeID, n) {
    // Returns the distance between the source and destination node in a given graph
    // done via BFS
    // n = Total number of nodes

    // let visited = Array(nodeID).fill(false);
    // let distance = Array(nodeID).fill(0);

    let visited = [];
    let distance = [];

    // console.log("VALUE OF N:", n);
    
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

// untested
function smartExplore(graph, state, stateID, newState) {
    /*
    same task as isExplored(), but the problem is that if the graph is like this:
      [0,0]
        |
      [4,0]
        |
      [4,3]
        \
        [0,3]

    Then, when control comes back to [0,0], it won't generate the branch [0,3] since it has already
    been generated in the branch with [4,0]. The problem with this is that [0,0] -> [0,3] is a 1 step
    move, but in this case the generated graph will take the path, [0,0] -> [4,0] -> [4,3] -> [0,3]
    which has a great Path Cost.

    In isExplored(), we returned true if the new state had already been traversed, and in generateGraph(),
    we didn't add that state if it had already been traversed. As a result of this, our tree has only 1 branch,
    which will reach the needed solution, but not efficiently

    In smartExplore(), we will find the distance from the initial root node to the new state, and if
    this distance is lesser than the shortest distance from the root node to the same state which had
    been generated before, then we will add the new state to the tree (since we found a shorter alternative)

    NOTE
    Later on, we can delete the branch with the longer route to the new State, but for now we'll just 
    generate the entire solution space. (This may not be needed)

    */


    nodeID += 1; // change variable name to newStateID
    graph.addNode(nodeID, newState);

    // nodeID = ID of the new state, stateID = ID of the parent state
    graph.addEdge(stateID, nodeID);

    
    if ( isExplored(newState) ) {

        // Distance from root node to old state (root node has ID = 0)
        depthOldState = shortestDistance(graph,0, stateID, nodeID);

        // Distance from root node to new state
        depthNewState = shortestDistance(graph,0, nodeID, nodeID);

        // graph.displayGraph(); // HERE
        console.log("old state:", state);
        console.log("new state:", newState);
        console.log("Depth old state:", depthOldState);
        console.log("Depth new state:", depthNewState);


        // we have no improvement, remove this node to prevent the generation of a Cost Inefficient Branch
        if ( depthNewState >= depthOldState ) {
            // console.log("BEFORE:");
            // graph.displayGraph();
            graph.deleteNode(nodeID);
            // console.log("After:");
            // graph.displayGraph();
            nodeID -= 1;
            return;
        }
        
    }

    statesAdded.push( newState );

    // graph.displayGraph();

    // If control reaches here, we've added a new node to the state space tree
    // Now we need to call generateGraph() from the new node added to generate further nodes
    generateGraph(graph, newState, nodeID);

}


// start this by calling generateGraph(graph, [0,0])
// Generates the required solution tree / the entire state space starting from the intial state [0,0] 
function generateGraph(graph, state, stateID) {

    for ( let i = 0; i < numberOfMoves; i++ ) {

        let newState = makeMove(state, i);
        // console.log(newState);

        // temporary measure
        if ( !(newState[0] == 0 && newState[1] == 0) ) {
            // console.log(newState);
            smartExplore(graph, state, stateID, newState);
        }
        


        /*
        if ( !isExplored(newState) ) {
            
            nodeID += 1;
            graph.addNode(nodeID, newState);
            // graph.addEdge(state, newState); // THIS IS NOT WORKING
            // nodeID = ID of the new state, stateID = ID of the parent state
            graph.addEdge(stateID, nodeID);
            statesAdded.push( newState );

            generateGraph(graph, newState, nodeID);
              
        }
        */
    }
    // while(statesAdded.length) { // refresh statesAdded array (remove all elements)
    //     statesAdded.pop();
    // }
    // graph.displayGraph();
}



generateGraph(graph, [0,0], 0);
graph.displayGraph();








console.log("Reached the end");







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






