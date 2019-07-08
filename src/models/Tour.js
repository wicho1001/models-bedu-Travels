import mongoose, { Schema } from 'mongoose';
import { ItinerarySchema } from './Itinerary';
import { DepartureSchema } from './Departure';

// Mongoose Schema
const TourSchema = new Schema({
  title: String,
  description: String,
  duration: Number,
  availability: Boolean,
  difficulty: String,
  startLocation: {
    latitude: Number,
    longitude: Number,
  },
  endLocation: {
    latitude: Number,
    longitude: Number,
  },
  operator: String,
  typeTour: String,
  likes: 0,
  itinerary: [ItinerarySchema],
  departures: [DepartureSchema],
}, {
  timestamps: true,
});

const TourModel = mongoose.model('Tour', TourSchema);
export default TourModel;
