import { Schema, model, models } from 'mongoose';

const DashboardSchema = new Schema({
  backgroundImg: {
    type: String,
  },
});

export default models.Dashboard || model('Dashboard', DashboardSchema);
