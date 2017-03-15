// server.js takes care of setting up the environment and passes the router object to the API

const express = require('express');

const app = express();
const apiRouter = express.Router();

process.env.PORT = process.env.PORT || 5000;

// start webpack-dev-server
if(process.env.NODE_ENV !== 'production') {
    // add some patchwork for the devserver to start!
    require('./webpack/webpack.middleware')(app);
}

// Attach body parser middleware to parse request body
require('./utils/body-parser')(app);

// pass the router around 
require('./api/index')(apiRouter);

// attach the router after all the routes have been hatched on to it
app.use('/api', apiRouter);

// start the server
app.use(express.static(__dirname + '/client'));

app.listen(process.env.PORT, function(){
  console.log(`Running on port ${process.env.PORT}`);
});


