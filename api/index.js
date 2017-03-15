module.exports = (router) => {

    // passing around the `app` object to sub-objects    
    require('./themes')(router);

}