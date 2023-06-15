import mongoose from "mongoose";

const ItinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  country: { type: mongoose.Schema.Types.String, required: true },
  title: { type: mongoose.Schema.Types.String, required: true },
  price: { type: mongoose.Schema.Types.String, required: true },
  introduction: { type: mongoose.Schema.Types.String, required: true },
  image: { type: mongoose.Schema.Types.String, required: true },
  salesPitch: { type: mongoose.Schema.Types.String, required: true },
  // details: { type: mongoose.Schema.Types.String, required: true },
  category: [{ type: mongoose.Schema.Types.String, enum: ["stay", "taste", "vibe", "experience"], required: true }],
  eachDetail: [
    {
      day: { type: mongoose.Schema.Types.Number, required: true },
      stayDescription: { type: mongoose.Schema.Types.String, required: true },
      stayImages: [{ type: mongoose.Schema.Types.String, required: true }],
      tasteImages: [{ type: mongoose.Schema.Types.String, required: true }],
      tasteDescription: { type: mongoose.Schema.Types.String, required: true },
      vibeDescription: { type: mongoose.Schema.Types.String, required: true },
      vibeImages: [{ type: mongoose.Schema.Types.String, required: true }],
      experienceDescription: { type: mongoose.Schema.Types.String, required: true },
      highlights: { type: mongoose.Schema.Types.String, required: true },
      experienceImages: [{ type: mongoose.Schema.Types.String, required: true }],
      services: [
        {
          type: mongoose.Schema.Types.String,
          enum: ["room service", "wifi", "mini bar", "bath tub & shower"],
          required: true,
        },
      ],
    },
  ],
});

export default mongoose.model("Itinerary", ItinerarySchema);
