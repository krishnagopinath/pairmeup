const express = require('express');

const app = express();
const apiRouter = express.Router();

process.env.PORT = process.env.PORT || 5000;

let staticAssets = null;

// start webpack-dev-server
if(process.env.NODE_ENV !== 'production') {
    console.log('starting webpack-dev-server..');
    // add some patchwork for the devserver to start!
    require('./webpack.middleware')(app);
    staticAssets = express.static(__dirname + '/client');
} else if(process.env.NODE_ENV === 'production') {
    // serve static assets from the dist folder!
    staticAssets = express.static(__dirname + '/dist')
}

// Attach body parser middleware to parse request body
require('./utils/body-parser')(app);

// pass the router around 
require('./api/index')(apiRouter);

// attach the router after all the routes have been hatched on to it
app.use('/api', apiRouter);

// start the server
app.use(staticAssets);

app.listen(process.env.PORT, function(){
  console.log(`Running on port ${process.env.PORT}`);
});


