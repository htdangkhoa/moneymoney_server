let mongoose = global.variables.mongoose,
    Schema = mongoose.Schema;

let Note = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: () => {
            return mongoose.Types.ObjectId();
        }
    },
    datetime: {
        type: Schema.Types.String,
        default: new Date().getTime()
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: Schema.Types.String
    },
    content: {
        type: Schema.Types.String
    }
});

global.Note = mongoose.model("note", Note);