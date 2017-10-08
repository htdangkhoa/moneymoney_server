let router = global.variables.router,
    mongoose = global.variables.mongoose,
    Loan = global.Loan,
    passport = global.passport;

router.post("/loan/create", (req, res) => {
    var datetime = req.body.datetime,
        user = req.body.id,
        value = req.body.value;

    if (
        global.isEmpty(user) ||
        global.isEmpty(value)
    ) return global.errorHandler(400, res, "Bad request");

    if (value <= 0) return global.errorHandler(200, res, "Value must be greater than 0.");

    new Loan({
        datetime: new Date(datetime),
        user: mongoose.Types.ObjectId(user),
        value
    }).save();

    return global.successHandler(200, res, "The loan was created successfully.")
});

router.get("/loans", (req, res) => {
    var user = req.param("id");

    Loan
    .find({
        user: mongoose.Types.ObjectId(user)
    })
    .then(loan => {
        return global.successHandler(200, res, loan);
    })
    .catch(error => {
        return global.errorHandler(200, res, error);
    });
});

module.exports = router;