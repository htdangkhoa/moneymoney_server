let router = global.variables.router,
    User = global.User,
    passport = global.passport,
    crypto = global.variables.crypto,
    jwt = global.variables.jwt;

/**
 * @function get_info
 * @instance
 * @param {string} id Id of user (Required).
 * @example <caption>Requesting /info?id=599717c3f4c70605197d9ed8 with the following GET data.</caption>
 */
router.get("/user/info", passport.authenticate("jwt", { session: false, failureRedirect: "/unauthorized" }), (req, res) => {
    var _id = req.param("id");

    if (
        global.isEmpty(_id)
    ) return global.errorHandler(res, 400, "Bad request.");

    User
    .findOne({
        _id
    }, ["avatar", "email", "name"])
    .then(user => {
        if (!user) return global.errorHandler(res, 404, "User does not exist.");

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
 * @param {string} avatar Avatar of user (Required).
 * @param {string} password New passwordof user (Option)
 * @param {string} id Id of user (Required).
 * @example <caption>Requesting /info with the following PATCH data.</caption>
 * {
 *  name: "Dang Khoa",
 *  avatar: <base64_string>,
 *  password: '1',
 *  id: "59789c0db2638003d2712f95"
 * }
 */
router.patch("/user/info", passport.authenticate("jwt", { session: false, failureRedirect: "/unauthorized" }), (req, res) => {
    var _id = req.body.id,
        name = req.body.name,
        avatar = req.body.avatar,
        old_password = req.body.old_password,
        new_password = req.body.new_password;

    if (
        global.isEmpty(_id)
    ) return global.errorHandler(res, 400, "Bad request.");

    if (global.isEmpty(new_password)) {
        User
        .findOneAndUpdate({
            _id
        }, {
            $set: {
                name,
                avatar
            }
        })
        .then(user => {
            if (!user) return global.errorHandler(res, 404, "User does not exist.");
    
            return global.successHandler(res, 200, {
                message: "Your info was updated successfully.",
                token: ""
            });
        })
        .catch(error => {
            return global.errorHandler(res, 200, error);
        });
    }else {
        User
        .findOne({
            _id
        })
        .then(user => {
            if (!user) return global.errorHandler(res, 404, "User does not exist.");

            user.comparePassword(old_password, (err, isMatch) => {
                if (err) return global.errorHandler(res, 200, err);

                if (!isMatch) return global.errorHandler(res, 200, "Old password is not correct.");

                user.name = name;
                user.avatar = avatar;
                user.password = new_password;
                user.save();

                var data = {
                    email: user.email,
                    password: new_password
                }
                var payload = crypto.encrypt(JSON.stringify(data));
                var token = jwt.sign(payload, crypto.secret);
                console.log(token)
        
                return global.successHandler(res, 200, {
                    message: "Your info was updated successfully.",
                    token
                });
            });
        })
        .catch(error => {
            return global.errorHandler(res, 200, error);
        });
    }
});

module.exports = router;