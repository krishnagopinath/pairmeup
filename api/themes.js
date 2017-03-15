const getThemes = (req, res) => {
    res.json([
        'Pokemon',
        'JavaScript'
    ]);
}

module.exports = (router) => {
    router.get('/themes', getThemes);
}