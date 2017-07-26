let router = global.variables.router
    Note = global.Note,
    User = global.User;

/**
 * @function create_note
 * @instance
 * @param {string} title Title (Option).
 * @param {string} content Content (Option).
 * @param {string} email Email (Required).
 * @example <caption>Requesting /v1/note/create with the following POST data.</caption>
 * {
 *  title: "",
 *  content: "",
 *  email: "abc@gmail.com"
 * }
 */
router.post("/note/create", (req, res) => {
    var title = req.body.title,
        content = req.body.content,
        email = req.body.email;
    
    if (
        !req.user
    ) return res.redirect("/");

    if (
        global.isEmpty(email, null)
    ) return global.errorHandler(res, 400, "Bad request.");

    User
    .findOne({
        email
    })
    .then(user => {
        if (!user) return global.errorHandler(res, 404, "Email does not exist.");

        new Note({
            email,
            title,
            content
        })
        .save();

        return global.successHandler(res, 200, "The note was created successfully.");
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
});

/**
 * @function get_note_by_email
 * @instance
 * @param {string} email Email of card (Required).
 * @example <caption>Requesting /v1/notes?email=abc@gmail.com with the following GET data.</caption>
 */
router.get("/notes", (req, res) => {
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
    })
    .then(user => {
        if (!user) return global.errorHandler(res, 404, "Email does not exist.");
        
        Note
        .find({
            email
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

module.exports = router;