import itineraryService from "../services/itineraryService.js";

class Itinerary {
  async addItinierary(req, res) {
    let { values, errors, isValid } = itineraryService.validateItineraryInput(req.body);
    const parseData = itineraryService.parseImages(req.files, req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    let itinerary = await itineraryService.addItinerary({
      ...values,
      userId: req.user.id,
      image: process.env.BASE_URL + "/img/" + req.file.filename,
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
