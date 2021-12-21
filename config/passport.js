const LocalStrategy = require('passport-local').Strategy
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../src/models/user.model')

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: "Incorrect username" }); }
            if (!bcrypt.compareSync(password, user.password)) { return done(null, false, { message: "Incorrect password" }); }
            return done(null, user);
        });
    }
));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});