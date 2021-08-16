class Graph {
    #nodes;
    // private object nodes

    constructor() {
        this.#nodes = {};
    }

    addNode(node) {
        this.#nodes[node] = [];
    }

    addEdge(source, destination) {
        // if either node does not exist
        if ( !this.#nodes[source] || !this.#nodes[destination] ) {
            return false;
        }

        if ( !this.#nodes[source].includes(destination) ) {
            this.#nodes[source].push(destination);
        }

        if ( !this.#nodes[destination].includes(source) ) {
            this.#nodes[destination].push(source);
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
            let neighbor = this.#nodes[current];
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
        const neighbors = this.#nodes[source];

        for ( let i = 0; i < neighbors.length; i++ ) {
            if ( this.dfs(neighbors[i], destination, visited) ) {
                return true;
            }
        }

        return false;
    }
}
