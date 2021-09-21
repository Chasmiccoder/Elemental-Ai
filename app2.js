// basics of node js
// https://www.youtube.com/watch?v=TlB_eWDSMt4

function sayHello1(name) {
    console.log("Hello " + name);
}

// sayHello("Mosh");

// ------------------------------

console.log(); // global


// setTimeout();
// clearTimeout();
// setInterval();
// clearInterval();




// console.log(global.message); // undefined (out of scope)

// In node JS we have global instead of window


var sayHello = function() {
     
}
// in node, all vars and functions defined in a file have their own scope (private)
// they are not available outside that module
// To use a function outside its module, we need to export it and make it public.

// console.log(module);



const logger = require('./logger');
console.log(logger); // { log: [Function: logFunc] }


logger.log('message'); // message

 




