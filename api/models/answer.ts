import { Schema, models, model } from 'mongoose';

const AnswerSchema = new Schema({
  answers: {
    type: Object,
  },
  createdAt: {
    type: Date,
  },
});

export default models.Answer || model('Answer', AnswerSchema);
