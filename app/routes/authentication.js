let router = global.variables.router,
    User = global.User,
    passport = global.passport;

router.get("/", (req, res) => {
    console.log(req.user);

    if (req.user) {
        return res.send("Signed in.")
    }

    return res.send("Please sign in.")
})

/**
 * @function sign_in
 * @instance
 * @param {string} email Email (Required).
 * @param {string} password Password (Required).
 * @example <caption>Requesting /sign_in with the following POST data.</caption>
 * {
 *  email: 'abc@gmail.com',
 *  password: '1'
 * }
 */
router.post("/sign_in", passport.authenticate("local", { failureRedirect: "/fail" }), (req, res) => {
    res.redirect("/");
})

/**
 * @function register
 * @instance
 * @param {string} email Email (Required).
 * @param {string} password Password (Required).
 * @example <caption>Requesting /register with the following POST data.</caption>
 * {
 *  email: 'abc@gmail.com',
 *  password: '1'
 * }
 */
router.post("/register", (req, res) => {
    new User({
        email: req.body.email,
        password: req.body.password
    })
    .save((error, result) => {
        if (error && error.code === 11000) {
            return global.errorHandler(res, 302, "Email already exist.");
        }

        return global.successHandler(res, 200, "Register success.");
    });
});

/**
 * Delete session after signed in.
 * @function sign_out
 * @instance
 */
router.post("/sign_out", (req, res) => {
    req.logout();
    req.session.destroy();
    console.log(req.session)
    return res.redirect("/");
})

router.get("/fail", (req, res) => {
    return res.send("FAIL.")
})

module.exports = router;