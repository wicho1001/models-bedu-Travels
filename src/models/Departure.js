import mongoose, { Schema } from 'mongoose';

// Mongoose Schema
const DepartureSchema = new Schema({
  startDate: Date,
  endDate: Date,
  price: Number,
  seats: Number,
}, {
  timestamps: true,
});

// Mongoose Model
const DepartureModel = mongoose.model('Departure', DepartureSchema);
export { DepartureModel, DepartureSchema };
