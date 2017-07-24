let User = global.User,
    router = global.variables.router,
    uuid = global.variables.uuid;

/**
 * @function create_card
 * @instance
 * @param {string} type (credit|normal|orther)
 * @param {string} balance Balance of user's card
 * @param {string} name Card holder
 * @param {string} exp Expiration of user's card (timestamp)
 * @param {string} number Card number
 * @param {string} cvv CVV of user's card
 * @param {string} email email of user
 * @example <caption>Requesting /v1/create_card with the following POST data</caption>
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
router.post("/create_card", (req, res) => {
    var type = req.body.type,
        balance = req.body.balance,
        name = req.body.name,
        exp = req.body.exp,
        number = req.body.number,
        cvv = req.body.cvv,
        email = req.body.email;

    if (
        global.variables.types_card.indexOf(type) === -1 ||
        isNaN(parseInt(balance)) ||
        global.isEmpty(name, null) ||
        global.isEmpty(exp, null) ||
        global.isEmpty(number, null) ||
        global.isEmpty(cvv, null) ||
        global.isEmpty(email, null)
    ) return global.errorHandler(res, 400, "Bad request.");

    User.findOne({
        email
    })
    .then(user => {
        if (user.length === 0) {
            return global.errorHandler(res, 404, "Email does not exist.");
        }

        user.cards.push({
            id: uuid.v4(),
            type,
            balance,
            name,
            exp,
            number,
            cvv
        })
        user.save();

        return global.successHandler(res, 200, "Create card successfully.");
    })
    .catch(error => {
        return res.send(error);
    })
});

module.exports = router;