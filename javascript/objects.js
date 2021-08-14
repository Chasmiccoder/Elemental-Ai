// Basics of objects in JS

let alien = {
    name: 'Jeff',
    tech: 'JS',
    'this also works': 10,
};

alien['town'] = 'Bengaluru';
alien.dingo = 'Gringo';

console.log(typeof alien); // object

console.log(alien);

console.log(alien['name']);
console.log(alien.name);
console.log(alien.town);
console.log(alien.dingo);
console.log(alien['this also works']); // can't use dot operator here

let input = 'name'; // taken from user
console.log(alien[input]); // can't use dot operator


alien = {
    name: 'Vaibhav',
    tech: 'JS',
    laptop: {
        cpu: 'i7',
        ram: 4,
        brand: 'Dell',
    }
};

console.log( alien );
console.log( alien.laptop.brand );

// Print the length of brand if such a key exists
console.log( alien.laptop.brand?.length );

// deleting laptop
delete alien.laptop;
console.log(alien);

