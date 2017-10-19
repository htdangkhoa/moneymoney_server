let router = global.variables.router,
  mongoose = global.variables.mongoose,
  Card = global.Card,
  History = global.History;

router.post('/transfer', (req, res) => {
  var from = req.body.from,
    nameF = req.body.namef,
    nameT = req.body.namet,
    to = req.body.to,
    value = req.body.value;

  console.log(nameF, nameT);

  /** From */
  Card.findOne({
    _id: from
  }).then(card => {
    card.balance -= parseInt(value);
    card.usedTotal = parseInt(card.usedTotal) - parseInt(value);

    card.save();
  });

  /** To */
  Card.findOne({
    _id: to
  }).then(card => {
    card.balance += parseInt(value);

    card.save();
  });

  new History({
    from: nameF,
    to: nameT,
    value
  }).save();

  return global.successHandler(res, 200, 'Transaction successful.');
});

router.get('/transfer', (req, res) => {
  History.aggregate([
    {
      $project: {
        _id: '$_id',
        from: '$from',
        to: '$to',
        datetime: {
          $dateToString: { format: '%d/%m/%Y', date: '$datetime' }
        },
        value: '$value'
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

module.exports = router;
