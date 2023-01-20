const http = require('http');
const port = process.env.PORT || 3000
const app = require('./app');

console.log("Creation de serveur" )

const server = http.createServer(app)

server.listen(port);

console.log('listen on port ', port)