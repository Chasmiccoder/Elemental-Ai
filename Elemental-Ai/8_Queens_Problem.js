/*

Problem with our approach: WE SHOULD NOT BE PRECOMPUTING THE SOLUTION STATE SPACE.
We should infact 'discover' the state space with the searching algorithm employed


Problem Statement -
===================

Solve the 8 Queens Problem

There is an 8x8 grid (64 squares) and 8 Queens
Number of Possible Board Configurations = 64! / ((64-8)! * 8!) which is near 4.4 billion possible states
which may or may not be legal.
A state is legal if no two different queens can attack each other in 1 move.
It turns out that there are 92 distinct solutions.

Once a solution is obtained, we can get 8 more solutions (4 rotations, 4 reflections).
In reality we have only 12 solutions. 
(11 of these have 8 reflections and rotations, 1 of them has only 4 reflections and reflections(180 degree rotation gives same result) )


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


Searching Algorithms -
======================

    1) BFS


---------------------------------------------
Author - Aryaman Kolhe
This code is Licensed under the MIT Licence
---------------------------------------------
*/




