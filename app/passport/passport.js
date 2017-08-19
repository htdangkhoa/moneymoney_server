let User = global.User,
    passport = global.variables.passport,
    passportJWT = require('passport-jwt'),
    extractJwt = passportJWT.ExtractJwt;
    jwtStrategy = passportJWT.Strategy,
    crypto = require("../crypto"),
    options = {
        jwtFromRequest: extractJwt.fromAuthHeader(),
        secretOrKey : crypto.secret
    };

passport.use(new jwtStrategy(options, (data, done) => {
    var payload = JSON.parse(crypto.decrypt(data));

    var email = payload.email,
        password = payload.password;

    User
    .findOne({
  		email
    })
    .then(user => {
        if (!user) return done(null, false);

        user.comparePassword(password, function(err, isMatch) {
            if (err) return done(err);

            if (!isMatch) return done(null, false);

            return done(null, user);
        });
    })
    .catch((error) => {
  		return done(error);
  	});
}));

global.passport = passport;