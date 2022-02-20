import { Schema, models, model } from 'mongoose';

const QuestionSchema = new Schema({
  questions: {
    type: Object,
  },
});

export default models.Questions || model('Questions', QuestionSchema);
