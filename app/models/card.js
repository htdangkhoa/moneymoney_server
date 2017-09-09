let mongoose = global.variables.mongoose,
    Schema = mongoose.Schema;

let Card = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: () => {
            return mongoose.Types.ObjectId();
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: Schema.Types.String,
        required: true
    },
    balance: {
        type: Schema.Types.Number,
        required: true
    },
    amount: {
        type: Schema.Types.Number,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: true
    },
    exp: {
        type: Schema.Types.Date,
        required: true
    },
    number: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    cvv: {
        type: Schema.Types.Number,
        required: true
    }
});

global.Card = mongoose.model("card", Card);