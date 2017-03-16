const {themes, themesInfo} = require('../db.js');

const getThemes = (req, res) => {
    res.json(themes);
}

const getThemeItems = (req, res) => {
    const {theme, levelSeed} = req.params;
    const themeData = [...themesInfo[theme]]; 

    const max = themeData.length;
    for(let i = 0; i< levelSeed; i++) {
        let currentItem = themeData[i]; 
        let randomIndex = Math.ceil(Math.random() * (max - i) + i);
        let randomItem = themeData[randomIndex];
        
        themeData[i] = randomItem;
        themeData[randomIndex] = currentItem;
    }

    const finalThemeItems = themeData.slice(0, levelSeed);

    res.json(finalThemeItems);
}

module.exports = (router) => {
    router.get('/themes', getThemes);
    router.get('/themes/:theme/:levelSeed', getThemeItems);
}