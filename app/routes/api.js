let User = global.User,
    router = global.variables.router,
    uuid = global.variables.uuid;

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