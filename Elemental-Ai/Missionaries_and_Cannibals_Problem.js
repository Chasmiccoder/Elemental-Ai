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
    }

    return newState;
}