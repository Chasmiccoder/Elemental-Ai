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

        if ( !this.#nodes[destination].includes(source) ) {
            this.#nodes[destination].edges.push(source);
        }

    }

    showNodes() {
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

graph.addNode(1, [0,0]);

// Keeps track of the states added while generating the graph
statesAdded = [];
statesAdded.push( [0,0] );

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






