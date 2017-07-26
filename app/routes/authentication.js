let router = global.variables.router,
    User = global.User,
    passport = global.passport;

router.all("/", (req, res) => {
    if (
        !req.user
    )  return global.errorHandler(res, 401, "Unauthorized.");

    return global.successHandler(res, 200, "Signed in.");
});

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
    return res.redirect("/");
});

/**
 * @function register
 * @instance
 * @param {string} email Email (Required).
 * @param {string} password Password (Required).
 * @param {string} name User's name (Required).
 * @example <caption>Requesting /register with the following POST data.</caption>
 * {
 *  email: 'abc@gmail.com',
 *  password: '1',
 *  name: 'Abc'
 * }
 */
router.post("/register", (req, res) => {
    var email = req.body.email,
        password = req.body.password,
        name = req.body.name;

    if (
        global.isEmpty(email, null) || 
        global.isEmpty(password, null) || 
        global.isEmpty(name, null)
    ) return global.errorHandler(res, 400, "Bad request.");

    new User({
        email,
        password,
        name
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
    console.log(req.session);
    return res.redirect("/");
});

/**
 * @function get_info
 * @instance
 * @param {string} email Email of user (Required).
 * @example <caption>Requesting /info?email=abc@gmail.com with the following GET data.</caption>
 */
router.get("/info", (req, res) => {
    var email = req.param("email");

    if (
        !req.user
    ) return res.redirect("/");

    if (
        global.isEmpty(email, null)
    ) return global.errorHandler(res, 400, "Bad request.");

    User
    .findOne({
        email
    }, ["email", "name", "cards"])
    .then(user => {
        if (!user) return global.errorHandler(res, 404, "This email does not exist.");

        return global.successHandler(res, 201, user);
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
});

/**
 * @function edit_info
 * @instance
 * @param {string} name Name of user (Required).
 * @param {string} email Email of user (Required).
 * @example <caption>Requesting /info with the following PUT data.</caption>
 * {
 *  title: "",
 *  content: "",
 *  id: "59789c0db2638003d2712f95"
 * }
 */
router.put("/info", (req, res) => {
    var email = req.body.email,
        name = req.body.name;

    if (
        !req.user
    ) return res.redirect("/");

    if (
        global.isEmpty(email, null) || 
        global.isEmpty(name, null)
    ) return global.errorHandler(res, 400, "Bad request.");

    User
    .findOneAndUpdate({
        email
    }, {
        $set: {
            name
        }
    })
    .then(user => {
        if (!user) return global.errorHandler(res, 404, "This email does not exist.");

        return global.successHandler(res, 200, "Your info was updated successfully.");
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
});

router.get("/fail", (req, res) => {
    return global.errorHandler(res, 200, "Something went wrong.");
});

module.exports = router;