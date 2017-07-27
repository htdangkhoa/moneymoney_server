let User = global.User,
    router = global.variables.router,
    uuid = global.variables.uuid;

/**
 * @function create_card
 * @instance
 * @param {string} type [credit|normal|orther] (Required).
 * @param {string} balance Balance of user's card (Required).
 * @param {string} name Card holder (Required).
 * @param {string} exp Expiration of user's card [timestamp] (Required).
 * @param {string} number Card number (Required).
 * @param {string} cvv CVV of user's card (Required).
 * @param {string} note Note of card (Option).
 * @param {string} email email of user (Required).
 * @example <caption>Requesting /v1/card/create with the following POST data.</caption>
 * {
 *  type: credit,
 *  balance: 123456789,
 *  name: 'Huynh Tran Dang Khoa',
 *  exp: 1500879600,
 *  number: '4214-9458-0103-2509',
 *  cvv: 961,
 *  email: 'abc@gmail.com'
 * }
 */
router.post("/card/create", (req, res) => {
    var type = req.body.type,
        amount = req.body.amount,
        name = req.body.name,
        exp = req.body.exp,
        number = req.body.number,
        cvv = req.body.cvv,
        note = req.body.note,
        email = req.body.email;

    if (
        !req.user
    ) return res.redirect("/");
    
    if (
        global.variables.types_card.indexOf(type) === -1 ||
        isNaN(parseInt(amount)) ||
        global.isEmpty(name) ||
        global.isEmpty(exp) ||
        global.isEmpty(number) ||
        global.isEmpty(cvv) ||
        global.isEmpty(email)
    ) return global.errorHandler(res, 400, "Bad request.");

    User
    .findOne({
        email
    })
    .then(user => {
        if (!user) return global.errorHandler(res, 404, "Email does not exist.");

        user.cards.push({
            id: uuid.v4(),
            type,
            amount,
            name,
            exp,
            number,
            cvv,
            note
        });
        user.save();

        return global.successHandler(res, 201, "The card was created successfully.");
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    })
});

/**
 * @function get_cards
 * @instance
 * @param {string} email Email of user (Required).
 * @example <caption>Requesting /v1/cards?id=59761a77393efd07a1f77a1e with the following GET data.</caption>
 */
router.get("/cards", (req, res) => {
    var email = req.param("email");
    
    if (
        !req.user
    ) return res.redirect("/");

    if (
        global.isEmpty(email)
    ) return global.errorHandler(res, 400, "Bad request.");

    User
    .find({
        email
    }, ["cards"])
    .then(user => {
        if (user.length === 0) {
            return global.errorHandler(res, 404, "Email does not exist.");
        }

        return global.successHandler(res, 200, user);
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    })
})

module.exports = router;