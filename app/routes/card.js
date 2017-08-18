let User = global.User,
    Record = global.Record,
    router = global.variables.router,
    uuid = global.variables.uuid,
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
router.post("/card/create", passport.authenticate("jwt", { session: false }), (req, res) => {
    var type = req.body.type,
        amount = req.body.amount,
        name = req.body.name,
        exp = req.body.exp,
        number = req.body.number,
        cvv = req.body.cvv,
        _id = req.body.id;

    if (
        !req.user
    ) return res.redirect("/success");
    
    if (
        global.variables.types_card.indexOf(type) === -1 ||
        isNaN(parseInt(amount)) ||
        global.isEmpty(name) ||
        global.isEmpty(exp) ||
        global.isEmpty(number) ||
        global.isEmpty(cvv) ||
        global.isEmpty(_id)
    ) return global.errorHandler(res, 400, "Bad request.");

    User
    .findOne({
        _id
    })
    .then(user => {
        if (!user) return global.errorHandler(res, 404, "Email does not exist.");

        var cards = user.cards;

        for (var i = 0; i < cards.length; i++) {
            if (cards[i].number === number) return global.errorHandler(res, 302, "Card already exist.");
        }

        user.cards.push({
            id: uuid.v4(),
            type,
            amount,
            name,
            exp,
            number,
            cvv
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
 * @param {string} id Id of user (Required).
 * @example <caption>Requesting /v1/cards?id=599717c3f4c70605197d9ed8 with the following GET data.</caption>
 */
router.get("/cards", passport.authenticate("jwt", { session: false }), (req, res) => {
    var _id = req.param("id");

    if (
        global.isEmpty(_id)
    ) return global.errorHandler(res, 400, "Bad request.");

    User
    .find({
        _id
    }, ["cards"])
    .then(result => {
        if (result.length === 0) return global.errorHandler(res, 404, "Email does not exist.");

        result[0].cards.forEach(function(element, i) {
            console.log(element.id)
            
            Record
            .aggregate([
                {
                    $match: {
                        card: element.id
                    }
                },
                {
                    $group: {
                        _id: {
                            mode: "$mode"
                        },
                        total: {
                            $sum: "$value"
                        }
                    }
                }
            ])
            .then(r => {
                result[0].cards[i].current_balance = r;
                if (
                    i == result[0].cards.length -1
                ) return global.successHandler(res, 200, result);
            })
            .catch(e => {
                console.log(e)
            })
        }, this);

        if (result.length === 0) {
            return global.errorHandler(res, 404, "Email does not exist.");
        }

        
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
router.patch("/card/edit", passport.authenticate("jwt", { session: false }), (req, res) => {
    var _id = req.body.id_user,
        id = req.body.id,
        type = req.body.type,
        amount = req.body.amount,
        name = req.body.name,
        exp = req.body.exp,
        number = req.body.number,
        cvv = req.body.cvv;
    
    if (
        global.variables.types_card.indexOf(type) === -1 ||
        isNaN(parseInt(amount)) ||
        global.isEmpty(name) ||
        global.isEmpty(exp) ||
        global.isEmpty(number) ||
        global.isEmpty(cvv) ||
        global.isEmpty(_id) ||
        global.isEmpty(id)
    ) return global.errorHandler(res, 400, "Bad request.");

    User
    .findOne({
        _id
    }, ["cards"])
    .then(user => {
        if (!user) return global.errorHandler(res, 404, "Email does not exist.");

        var cards = user.cards;

        for (var i = 0; i < cards.length; i++) {
            if (id === cards[i].id) {
                cards[i].type = type;
                cards[i].amount = amount;
                cards[i].name = name;
                cards[i].exp = exp;
                cards[i].number = number;
                cards[i].cvv = cvv;

                user.save();

                return global.successHandler(res, 200, "The card was updated successfully.")
            }
        }
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    })

    return res.send("ok")
});

/**
 * @function delete_card
 * @instance
 * @param {string} id_user Id of user (Required).
 * @param {string} id Card id (Required).
 * @example <caption>Requesting /v1/card/delete with the following DELETE data.</caption>
 */
router.delete("/card/delete", passport.authenticate("jwt", { session: false }), (req, res) => {
    var _id = req.body.id_user,
        id = req.body.id;
    
    if (
        global.isEmpty(_id) || 
        global.isEmpty(id)
    ) return global.errorHandler(res, 400, "Bad request.");

    User
    .findOne({
        _id
    }, ["cards"])
    .then(result => {
        if (!result) {
            return global.errorHandler(res, 404, "Email does not exist.");
        }

        var cards = result.cards;

        for (var i = 0; i < cards.length; i++) {
            if (id === cards[i].id) {
                cards.splice(i, 1);

                result.save();

                return global.successHandler(res, 200, "The card was deleted successfully.");
            }
        }

        return global.errorHandler(res, 404, "Card does not exist.");
    });
});

module.exports = router;