const getThemes = (req, res) => {
    res.json([
        { 'name': 'Pokemon', 'icon': 'http://www.pngmart.com/files/2/Pikachu-PNG-File.png' },
        { 'name': 'JavaScript', 'icon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/480px-JavaScript-logo.png' }
    ]);
}

module.exports = (router) => {
    router.get('/themes', getThemes);
}