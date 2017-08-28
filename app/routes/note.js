let router = global.variables.router
    Note = global.Note,
    User = global.User,
    passport = global.passport;

/**
 * @function create_note
 * @instance
 * @param {string} title Title (Option).
 * @param {string} content Content (Option).
 * @param {string} id Id of user (Required).
 * @example <caption>Requesting /v1/note/create with the following POST data.</caption>
 * {
 *  title: "",
 *  content: "",
 *  id: "599717c3f4c70605197d9ed8"
 * }
 */
router.post("/note/create", passport.authenticate("jwt", { session: false, failureRedirect: "/unauthorized" }), (req, res) => {
    var title = req.body.title,
        content = req.body.content,
        _id = req.body.id;

    if (
        global.isEmpty(_id)
    ) return global.errorHandler(res, 400, "Bad request.");

    User
    .findOne({
        _id
    })
    .then(user => {
        if (!user) return global.errorHandler(res, 404, "User does not exist.");

        new Note({
            user: _id,
            title: title || "",
            content: content || ""
        })
        .save();

        return global.successHandler(res, 200, "The note was created successfully.");
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
});

/**
 * @function get_note_by_id
 * @instance
 * @param {string} id Id of user (Required).
 * @example <caption>Requesting /v1/notes?id=599717c3f4c70605197d9ed8 with the following GET data.</caption>
 */
router.get("/notes", passport.authenticate("jwt", { session: false, failureRedirect: "/unauthorized" }), (req, res) => {
    var _id = req.param("id");

    if (
        global.isEmpty(_id)
    ) return global.errorHandler(res, 400, "Bad request.");

    User
    .findOne({
        _id
    })
    .then(user => {
        if (!user) return global.errorHandler(res, 404, "User does not exist.");
        
        Note
        .find({
            user: _id
        })
        .then(notes => {
            return global.successHandler(res, 201, notes);
        })
        .catch(error => {
            return global.errorHandler(res, 200, error);
        });
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
});

/**
 * @function delete_note
 * @instance
 * @param {string} id Id of note (Required).
 * @example <caption>Requesting /v1/note/delete with the following DELETE data.</caption>
 * {
 *  id: 59789c0db2638003d2712f95
 * }
 */
router.delete("/note/delete", passport.authenticate("jwt", { session: false, failureRedirect: "/unauthorized" }), (req, res) => {
    var _id = req.body.id;

    if (
        global.isEmpty(_id)
    ) return global.errorHandler(res, 400, "Bad request.");

    Note
    .remove({
        _id
    })
    .exec()
    .then(result => {
        return global.successHandler(res, 200, "The note was deleted successfully.");
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
})

/**
 * @function edit_note
 * @instance
 * @param {string} title Title (Option).
 * @param {string} content Content (Option).
 * @param {string} id Id of note (Required).
 * @example <caption>Requesting /v1/note/edit with the following PATCH data.</caption>
 * {
 *  title: "",
 *  content: "",
 *  id: "59789c0db2638003d2712f95"
 * }
 */
router.patch("/note/edit", passport.authenticate("jwt", { session: false, failureRedirect: "/unauthorized" }), (req, res) => {
    var _id = req.body.id,
        title = req.body.title,
        content = req.body.content;

    if (
        global.isEmpty(_id)
    ) return global.errorHandler(res, 400, "Bad request.");

    Note
    .findOneAndUpdate({
        _id
    }, {
        $set: {
            title: title || "",
            content: content || ""
        }
    })
    .then(note => {
        if (!note) return global.errorHandler(res, 404, "This note does not exist.");

        return global.successHandler(res, 200, "The record was updated successfully.");
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
});

module.exports = router;