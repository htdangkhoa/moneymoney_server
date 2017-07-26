let router = global.variables.router,
    Record = global.Record;

/**
 * @function create_record
 * @instance
 * @param {string} datetime Date and time [timestamp] (Required).
 * @param {string} mode [Balance|Income] (Required).
 * @param {string} category [Food|Education|Sport|...] (Required).
 * @param {string} card Card id (Required).
 * @param {string} value Money (Required).
 * @param {string} note Note (Option).
 * @param {string} picture Picture [Base64] (Option).
 * @example <caption>Requesting /v1/record/create with the following POST data.</caption>
 * {
 *  datetime: 1500879600,
 *  category: 'Food',
 *  card: 0c4f2df1-5229-406d-9548-337a2dcc6d15,
 *  value: 90000
 * }
 */
router.post("/record/create", (req, res) => {
    var datetime = req.body.datetime,
        mode = req.body.mode,
        category = req.body.category,
        card = req.body.card,
        value = req.body.value,
        note = req.body.note,
        picture = req.body.picture;

    if (
        !req.user
    ) return res.redirect("/");

    if (
        global.isEmpty(datetime, null) || 
        global.isEmpty(mode, null) || 
        global.isEmpty(category, null) || 
        global.isEmpty(card, null) || 
        isNaN(parseInt(value))
    ) return global.errorHandler(res, 400, "Bad request.");

    if (
        mode.toLowerCase() != "balance" && 
        mode.toLowerCase() != "income"
    ) return global.errorHandler(res, 200, "Now, we just supported 'Balance' and 'Income'.");

    new Record({
        datetime,
        mode: mode.toLowerCase(),
        category,
        card,
        value,
        note: note || "",
        picture: picture || ""
    })
    .save();

    return global.successHandler(res, 200, "The record was created successfully.");
});

/**
 * @function get_record_by_card_id
 * @instance
 * @param {string} id Id of card (Required).
 * @example <caption>Requesting /v1/records?id=0c4f2df1-5229-406d-9548-337a2dcc6d15 with the following GET data.</caption>
 */
router.get("/records", (req, res) => {
    var card = req.param("id");

    if (
        !req.user
    ) return res.redirect("/");

    if (
        global.isEmpty(card, null)
    ) return global.errorHandler(res, 400, "Bad request.");

    Record
    .aggregate([
        {
            $match: {
                card
            }
        },
        {
            $group: {
                _id: "$category", //GROUP BY QUERY.
                total: {
                    $sum: "$value"
                }
            }
        }
    ])
    .then(result => {
        return global.successHandler(res, 200, result);
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
});

/**
 * @function get_record_by_category
 * @instance
 * @param {string} id Id of card (Required).
 * @param {string} mode [Balance|Income] (Required).
 * @param {category} category [Food|Education|Sport|...] (Required).
 * @example <caption>Requesting /v1/records/Balance/Food?id=0c4f2df1-5229-406d-9548-337a2dcc6d15&category=Food with the following GET data.</caption>
 */
router.get("/records/:mode/:category", (req, res) => {
    var card = req.param("id"),
        mode = req.params.mode;
        category = req.params.category;

    if (
        !req.user
    ) return res.redirect("/");

    if (
        global.isEmpty(card, null) || 
        global.isEmpty(mode, null)
    ) return global.errorHandler(res, 400, "Bad request.");

    if (
        mode.toLowerCase() != "balance" && 
        mode.toLowerCase() != "income"
    ) return global.errorHandler(res, 200, "Now, we just supported 'Balance' and 'Income'.");

    Record
    .find({
        card,
        mode,
        category
    })
    .then(result => {
        return global.successHandler(res, 200, result);
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
});

/**
 * @function delete_record
 * @instance
 * @param {string} id Record's id (Required).
 * @example <caption>Requesting /v1/record/delete with the following DELETE data.</caption>
 * {
 *  id: 597776c62c41f00e56acdc7b
 * }
 */
router.delete("/record/delete", (req, res) => {
    var _id = req.body.id;

    if (
        !req.user
    ) return res.redirect("/");

    if (
        global.isEmpty(_id, null)
    ) return global.errorHandler(res, 400, "Bad request.");

    Record
    .remove({ _id })
    .exec()
    .then(result => {
        return global.successHandler(res, 200, "The record was deleted successfully.");
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
});

/**
 * @function edit_record
 * @instance
 * @param {string} id Id of record (Required).
 * @param {string} datetime Date and time [timestamp] (Required).
 * @param {string} category [Food|Education|Sport|...] (Required).
 * @param {string} card Card id (Required).
 * @param {string} value Money (Required).
 * @param {string} note Note (Option).
 * @param {string} picture Picture [Base64] (Option).
 * @example <caption>Requesting /v1/record/edit with the following PUT data.</caption>
 * {
 *  id: '5978ae30a8782607e865ba62',
 *  datetime: 1500879600,
 *  category: 'Food',
 *  card: 0c4f2df1-5229-406d-9548-337a2dcc6d15,
 *  value: 90000
 * }
 */
router.put("/record/edit", (req, res) => {
    var _id = req.body.id,
        datetime = req.body.datetime,
        category = req.body.category,
        card = req.body.card,
        value = req.body.value,
        note = req.body.note,
        picture = req.body.picture;

    if (
        !req.user
    ) return res.redirect("/");

    if (
        global.isEmpty(_id, null) || 
        global.isEmpty(datetime, null) || 
        global.isEmpty(category, null) || 
        global.isEmpty(card, null) || 
        isNaN(parseInt(value))
    ) return global.errorHandler(res, 400, "Bad request.");

    Record
    .findOneAndUpdate({
        _id
    }, {
        $set: {
            datetime,
            category,
            card,
            value,
            note: note || "",
            picture: picture || ""
        }
    })
    .then(record => {
        if (!record) return global.errorHandler(res, 404, "This record does not exist.");
        
        return global.successHandler(res, 200, "The record was updated successfully.");
    })
    .catch(error => {
        return global.errorHandler(res, 200, error);
    });
});

module.exports = router;
