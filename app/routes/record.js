let router = global.variables.router,
    Record = global.Record;

router.post("/record/create", (req, res) => {
    var datetime = req.body.datetime,
        category = req.body.category,
        card = req.body.card,
        value = req.body.value,
        note = req.body.note,
        picture = req.body.picture;

    if (!req.user) {
        return res.send("Please sign in.");
    }

    if (
        global.isEmpty(datetime, null) || 
        global.isEmpty(category, null) || 
        global.isEmpty(card, null) || 
        isNaN(parseInt(value))
    ) return global.errorHandler(res, 400, "Bad request.");

    new Record({
        datetime,
        category,
        card,
        value,
        note: note || "",
        picture: picture || ""
    })
    .save();

    return global.successHandler(res, 201, "The record was created successfully.");
})

module.exports = router;
