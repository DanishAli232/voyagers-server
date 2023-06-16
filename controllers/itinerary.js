import itineraryService from "../services/itineraryService.js";

class Itinerary {
  async addItinierary(req, res) {
    let values = req.body;

    let itinerary = await itineraryService.addItinerary({
      ...values,
      userId: req.user.id,
      image: req.file.path,
      eachDetail: JSON.parse(values.eachDetail),
    });
    return res.send(itinerary);
  }

  async getItineraries(req, res) {
    const itineraries = await itineraryService.getListing();
    return res.send(itineraries);
  }

  async getSingleItinerary(req, res) {
    let { itineraryId } = req.params;
    const itinerary = await itineraryService.getSingleItinerary(itineraryId);
    return res.send(itinerary);
  }

  async updateItinerary(req, res) {
    const itinerary = await itineraryService.updateItinerary(req.body);
    return res.send(itinerary);
  }
}

export default new Itinerary();
