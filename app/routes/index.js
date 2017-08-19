let router = global.variables.router,
    cache = require("apicache").middleware;

router.all("/", cache("5 minutes"), (req, res) => {
    return global.renderHandler(res, 200, "index");
});

module.exports = router;