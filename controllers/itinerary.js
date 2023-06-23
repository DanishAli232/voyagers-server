import User from "../models/User.js";
import itineraryService from "../services/itineraryService.js";
import ItineraryModel from "../models/Itinerary.js";

class Itinerary {
  async addItinierary(req, res) {
    let { values, errors, isValid } = itineraryService.validateItineraryInput(req.body, req.files);
    const parseData = itineraryService.parseImages(req.files, req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    let image = req.files.find((each) => each.fieldname === "image");

    let itinerary = await itineraryService.addItinerary({
      ...values,
      userId: req.user.id,
      image: process.env.BASE_URL + "/img/" + image?.filename,
      eachDetail: parseData,
    });
    return res.send(itinerary);
  }

  async getItineraries(req, res) {
    let query = req.query;
    if (query.region) {
      query.country = query.region;
      delete query.region;
    }
    let limit;

    if (query.limit) {
      limit = query.limit;
      delete query.limit;
    }

    const itineraries = await itineraryService.getListing(query, limit);
    return res.send(itineraries);
  }

  async getPurchasedItineraries(req, res) {
    let user = await User.findById(req.user.id).select("boughtItineraries");

    let query = req.query;
    if (query.region) {
      query.country = query.region;
      delete query.region;
    }
    let limit;

    query._id = { $in: user.boughtItineraries };

    if (query.limit) {
      limit = query.limit;
      delete query.limit;
    }

    const itineraries = await itineraryService.getListing(query, limit);
    return res.send(itineraries);
  }

  async getMyItineraries(req, res) {
    let query = req.query;
    if (query.region) {
      query.country = query.region;
      delete query.region;
    }
    let limit;

    if (query.limit) {
      limit = query.limit;
      delete query.limit;
    }

    query.userId = req.user.id;

    const itineraries = await itineraryService.getListing(query, limit);
    return res.send(itineraries);
  }

  async getSingleItinerary(req, res) {
    let { itineraryId } = req.params;
    const itinerary = await itineraryService.getSingleItinerary(itineraryId);
    return res.send(itinerary);
  }

  async updateItinerary(req, res) {
    let { values, errors, isValid } = itineraryService.validateItineraryInput(req.body, req.files);
    const parseData = itineraryService.parseImages(req.files, req.body);
    let itineraryId = req.params.itineraryId;

    if (!isValid) {
      return res.status(400).json(errors);
    }
    let image = req.files?.find((each) => each.fieldname === "image");

    let itinerary = await itineraryService.updateItinerary(
      {
        ...values,
        userId: req.user.id,
        image: image ? process.env.BASE_URL + "/img/" + image?.filename : req.body.image,
        eachDetail: parseData,
      },
      itineraryId
    );
    return res.send(itinerary);
  }

  async deleteDay(req, res) {
    const itinerary = await itineraryService.deleteDay(req.body.itineraryId, req.body.newValues);

    return res.send(itinerary);
  }

  async deleteItinerary(req, res) {
    const itinerary = await ItineraryModel.findById(req.params.itinerary);
    if (!itinerary) {
      return res.status(400).json({ message: "Itinerary not found or you or not authorized" });
    }
    if (itinerary.userId.toString() === req.user.id) {
      const itinerary = await itineraryService.deleteItinerary(req.params.itinerary);
      const query = {};

      query.userId = req.user.id;

      const itineraries = await itineraryService.getListing(query);

      console.log(itinerary);
      if (itinerary.deletedCount === 1) {
        return res.json(itineraries);
      }

      return res.status(500).send({ message: "Something went wrong" });
    }

    return res.status(400).json({ message: "You are not authorized to delete this itinerary" });
  }
}

export default new Itinerary();
