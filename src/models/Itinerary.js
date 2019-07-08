import mongoose, { Schema } from 'mongoose';

// Mongoose Schema
const ItinerarySchema = new Schema({
  title: String,
  description: String,
  time: Number,
  sleepingMode: String,
  latitude: Number,
  longitude: Number,
}, {
  timestamps: true,
});

// Mongoose Model
const ItineraryModel = mongoose.model('Itinerary', ItinerarySchema);
export { ItinerarySchema, ItineraryModel };
