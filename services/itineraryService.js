import Itinerary from "../models/Itinerary.js";

class ItineraryService {
  async addItinerary(values) {
    let itinerary = await Itinerary.create(values);
    return itinerary;
  }

  async getListing() {
    const itineraries = await Itinerary.find({}).populate("userId");
    return itineraries;
  }

  async getSingleItinerary(id) {
    try {
      const itineraries = await Itinerary.findById(id).populate("userId");
      console.log("\n\n\n\n Itinerary data");
      return itineraries._doc;
    } catch (err) {
      console.log("\n\n\n\n Erorr", err);
    }
  }

  async updateItinerary(data) {
    try {
      const itinerary = await Itinerary.findByIdAndUpdate(data.itineraryId, { $set: data });
      console.log(itinerary);
      await itinerary.save();
      return itinerary;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export default new ItineraryService();
