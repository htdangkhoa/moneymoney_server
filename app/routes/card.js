let User = global.User,
    Card = global.Card,
    router = global.variables.router,
    passport = global.passport;

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
 * @param {string} id Id of user (Required).
 * @example <caption>Requesting /v1/card/create with the following POST data.</caption>
 * {
 *  type: credit,
 *  balance: 123456789,
 *  name: 'Huynh Tran Dang Khoa',
 *  exp: 1500879600,
 *  number: '4214-9458-0103-2509',
 *  cvv: 961,
 *  id: '599717c3f4c70605197d9ed8'
 * }
 */
router.post("/card/create", passport.authenticate("jwt", { session: false, failureRedirect: "/unauthorized" }), (req, res) => {
    var user = req.body.id,
        image = req.body.image,
        type = req.body.type,
        balance = req.body.balance,
        name = req.body.name,
        exp = req.body.exp,
        number = req.body.number,
        cvv = req.body.cvv;

    if (
        global.isEmpty(user) || 
        global.isEmpty(type) ||
        isNaN(parseInt(balance)) ||
        global.isEmpty(name) ||
        global.isEmpty(exp) ||
        global.isEmpty(number)
    ) return global.errorHandler(res, 400, "Bad request.");

    User
    .findOne({
        _id: user
    })
    .then(user => {
        if (!user) return global.errorHandler(res, 404, "User does not exist.");

        new Card({
            user,
            image,
            type,
            balance,
            name,
            exp,
            number,
            cvv
        })
        .save((error, result) => {
            if (error && error.code === 11000) {
                return global.errorHandler(res, 200, "This card already exist.");
            }
    
            return global.successHandler(res, 200, "The card was created successfully.");
        });
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
});

/**
 * @function get_cards
 * @instance
 * @param {string} id Id of user (Required).
 * @example <caption>Requesting /v1/cards?id=599717c3f4c70605197d9ed8 with the following GET data.</caption>
 */
router.get("/cards", passport.authenticate("jwt", { session: false, failureRedirect: "/unauthorized" }), (req, res) => {
    var user = req.param("id");

    if (
        global.isEmpty(user)
    ) return global.errorHandler(res, 400, "Bad request.");

    Card
    .find({
        user
    })
    .then(result => {
        if (result.length === 0) return global.errorHandler(res, 200, "You have not got any cards yet.");

        return global.successHandler(res, 200, result);
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
});

/**
 * @function edit_card
 * @instance
 * @param {string} id_user Id of user (Required).
 * @param {string} id Card id (Required).
 * @param {string} type [credit|normal|orther] (Required).
 * @param {string} balance Balance of user's card (Required).
 * @param {string} name Card holder (Required).
 * @param {string} exp Expiration of user's card [timestamp] (Required).
 * @param {string} number Card number (Required).
 * @param {string} cvv CVV of user's card (Required).
 * @param {string} note Note of card (Option).
 * @example <caption>Requesting /v1/card/edit with the following PATCH data.</caption>
 * {
 *  id_user: '599717c3f4c70605197d9ed8',
 *  id: '4e480b6d-7cfa-4a05-9509-db524863738d',
 *  type: credit,
 *  balance: 123456789,
 *  name: 'Huynh Tran Dang Khoa',
 *  exp: 1500879600,
 *  number: '4214-9458-0103-2509',
 *  cvv: 961
 * }
 */
router.patch("/card/edit", passport.authenticate("jwt", { session: false, failureRedirect: "/unauthorized" }), (req, res) => {
    var _id = req.body.id,
        type = req.body.type,
        balance = req.body.balance,
        name = req.body.name,
        exp = req.body.exp,
        number = req.body.number,
        cvv = req.body.cvv;
    
    if (
        global.isEmpty(_id) || 
        global.isEmpty(type) ||
        isNaN(parseInt(balance)) ||
        global.isEmpty(name) ||
        global.isEmpty(exp) ||
        global.isEmpty(number)
    ) return global.errorHandler(res, 400, "Bad request.");

    Card
    .findOneAndUpdate({
        _id
    }, {
        $set: {
            type,
            balance,
            name,
            exp,
            number,
            cvv
        }
    })
    .then(card => {
        if (!card) return global.errorHandler(res, 404, "This card does not exist.");

        return global.successHandler(res, 200, "The card was updated successfully.");
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
});

/**
 * @function delete_card
 * @instance
 * @param {string} id_user Id of user (Required).
 * @param {string} id Card id (Required).
 * @example <caption>Requesting /v1/card/delete with the following DELETE data.</caption>
 * {
 *  id_user: '599717c3f4c70605197d9ed8',
 *  id: '77602157-3ae6-4762-85cf-5eca01314d92'
 * }
 */
router.delete("/card/delete", passport.authenticate("jwt", { session: false, failureRedirect: "/unauthorized" }), (req, res) => {
    var _id = req.param("id");
    
    if (
        global.isEmpty(_id)
    ) return global.errorHandler(res, 400, "Bad request.");
    
    Card
    .remove({
        _id
    })
    .exec()
    .then(result => {
        return global.successHandler(res, 200, "The card was deleted successfully.");
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
});

module.exports = router;