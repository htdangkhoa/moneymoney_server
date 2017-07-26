let mongoose = global.variables.mongoose,
    uuid = global.variables.uuid,
    Schema = mongoose.Schema;

let Record = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: () => {
            return mongoose.Types.ObjectId();
        }
    },
    
    datetime: {
        type: Schema.Types.String,
        required: true
    },
    mode: {
        type: Schema.Types.String,
        required: true
    },
    category: {
        type: Schema.Types.String,
        required: true
    },
    card: {
        type: Schema.Types.String,
        required: true
    },
    value: {
        type: Schema.Types.Number,
        required: true
    },
    note: {
        type: Schema.Types.String
    },
    picture: {
        type: Schema.Types.String
    },
});

global.Record = mongoose.model("record", Record);