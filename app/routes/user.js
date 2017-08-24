let router = global.variables.router,
    User = global.User,
    passport = global.passport;

/**
 * @function get_info
 * @instance
 * @param {string} id Id of user (Required).
 * @example <caption>Requesting /info?id=599717c3f4c70605197d9ed8 with the following GET data.</caption>
 */
router.get("/user/info", passport.authenticate("jwt", { session: false }), (req, res) => {
    var _id = req.param("id");

    if (
        global.isEmpty(_id)
    ) return global.errorHandler(res, 400, "Bad request.");

    User
    .findOne({
        _id
    }, ["avatar", "email", "name", "cards"])
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
 * @param {string} id Id of user (Required).
 * @example <caption>Requesting /info with the following PATCH data.</caption>
 * {
 *  name: "Dang Khoa",
 *  id: "59789c0db2638003d2712f95"
 * }
 */
router.patch("/user/info", passport.authenticate("jwt", { session: false }), (req, res) => {
    var _id = req.body.id,
        name = req.body.name,
        avatar = req.body.avatar;
        

    if (
        global.isEmpty(_id)
    ) return global.errorHandler(res, 400, "Bad request.");

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

        return global.successHandler(res, 200, "Your info was updated successfully.");
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
});

module.exports = router;