import { Schema, model, models } from 'mongoose';

const DashboardSchema = new Schema({
  backgroundImg: {
    type: String,
  },
  welcomeText: {
    type: String,
  },
  thanksText: {
    type: String,
  },
  thanksSubText: {
    type: String,
  },
});

export default models.Dashboard || model('Dashboard', DashboardSchema);
