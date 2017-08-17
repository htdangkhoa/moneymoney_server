let User = global.User,
    passport = global.variables.passport,
    passportJWT = require('passport-jwt'),
    extractJwt = passportJWT.ExtractJwt;
    jwtStrategy = passportJWT.Strategy,
    options = {
        jwtFromRequest: extractJwt.fromAuthHeader(),
        secretOrKey : global.variables.secret
    };

passport.use(new jwtStrategy(options, (payload, done) => {
    console.log("payload: ", payload);

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