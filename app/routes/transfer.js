let router = global.variables.router,
    Card = global.Card;

router.post("/transfer", (req, res) => {
    var from = req.body.from,
        to = req.body.to,
        value = req.body.value;

    console.log(from, to, value);

    /** From */
    Card
    .findOne({
        _id: from
    })
    .then(card => {
        card.balance -= parseInt(value);
        card.usedTotal = parseInt(card.usedTotal) - parseInt(value);

        card.save();
    })

    /** To */
    Card
    .findOne({
        _id: to
    })
    .then(card => {
        card.balance += parseInt(value);
        
        card.save();
    })

    return global.successHandler(res, 200, "ok");
})

module.exports = router;