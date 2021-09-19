// node basics
// file keeps track of logs

var url = 'http://mylogger.io/log';
// endpoint


function logFunc(message) {
    // send an HTTP request 
    console.log(message);
}



module.exports.log = logFunc;
// module.exports.endPoint = url;






