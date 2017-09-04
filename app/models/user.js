let bcrypt = global.variables.bcrypt,
    uuid = global.variables.uuid,
    mongoose = global.variables.mongoose,
    Schema = mongoose.Schema,
    salt_round = 10;

let User = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: () => {
            return mongoose.Types.ObjectId();
        }
    },
    session: {
        type: Schema.Types.String,
        default: function() { return uuid.v4() }
    },
    avatar: {
        type: Schema.Types.String,
        default: ""
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: true
    }
});

User.pre("save", function(next) {
    var user = this;

    if (!user.isModified("password")) {
        return next();
    }

    bcrypt.genSalt(salt_round, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (e, hash) => {
            if (e) return next(e);

            user.password = hash;
            next(); 
        });
    });
});

User.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

global.User = mongoose.model("user", User);