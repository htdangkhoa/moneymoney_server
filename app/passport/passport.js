let User = global.User,
    passport = global.variables.passport,
    LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, (email, password, done) => {
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

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    User
    .findOne({
        email: user.email
    })
    .then(u => {
        if (!u) return done(null, false);

        return done(null, u);
    })
    .catch(error => {
        return done(error);
    });
});

global.passport = passport;