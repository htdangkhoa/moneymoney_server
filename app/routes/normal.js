let router = global.variables.router,
    cache = require("apicache").middleware;

router.all("/", (req, res) => {
    return global.renderHandler(res, 200, "index");
});

router.get("/unauthorized", (req, res) => {
    return global.errorHandler(res, 401, "Unauthorized")
})

module.exports = router;