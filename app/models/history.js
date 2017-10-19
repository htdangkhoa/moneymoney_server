let mongoose = global.variables.mongoose,
  Schema = mongoose.Schema;

let History = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => {
      return mongoose.Types.ObjectId();
    }
  },
  datetime: {
    type: Schema.Types.Date,
    default: () => {
      return new Date();
    }
  },
  from: {
    type: Schema.Types.String,
    required: true
  },
  to: {
    type: Schema.Types.String,
    required: true
  },

  value: {
    type: Schema.Types.Number,
    required: true
  }
});

global.History = mongoose.model('history', History);
