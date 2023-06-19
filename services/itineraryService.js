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

  parseImages(files, data) {
    let eachDetail = JSON.parse(data.eachDetail);
    // let eachData = [{}];
    eachDetail.map((each, idx) => {
      let objData = { stayImages: [] };
      files
        .filter((each) => each.fieldname !== "image")
        .map((file, idx) => {
          if (file.fieldname === `eachDetail[${each.day}].stayImages[${idx}]`) {
            objData = { ...each, stayImages: [...objData.stayImages, `${process.env.BASE_URL}/img/${file.filename}`] };
          }
          if (file.fieldname === `eachDetail[${each.day}].experienceImages[${idx}]`) {
            objData = {
              ...each,
              experienceImages: [...objData.experienceImages, `${process.env.BASE_URL}/img/${file.filename}`],
            };
          }
          if (file.fieldname === `eachDetail[${each.day}].vibeImages[${idx}]`) {
            objData = {
              ...each,
              experienceImages: [...objData.experienceImages, `${process.env.BASE_URL}/img/${file.filename}`],
            };
          }
          if (file.fieldname === `eachDetail[${each.day}].tasteImages[${idx}]`) {
            objData = {
              ...each,
              tasteImages: [...objData.tasteImages, `${process.env.BASE_URL}/img/${file.filename}`],
            };
          }
        });
      console.log(objData);
    });
  }

  async updateItinerary(data) {
    try {
      const itinerary = await Itinerary.findByIdAndUpdate(data.itineraryId, { $set: data });

      await itinerary.save();
      return itinerary;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  validateItineraryInput(data) {
    let errors = {};
    // validate Title
    if (!data.title || data.title?.trim() === "") {
      errors.title = "Title field shouldn't be empty";
    }

    // validate Country
    if (!data.country || data.country?.trim() === "") {
      errors.country = "Country field shouldn't be empty";
    }

    // validate Introduction
    if (!data.introduction || data.introduction?.trim() === "") {
      errors.introduction = "Introduction field shouldn't be empty";
    }

    // validate Sales Pitch
    if (!data.salesPitch || data.salesPitch?.trim() === "") {
      errors.salesPitch = "Sales Pitch field shouldn't be empty";
    }

    // validate category
    if (!data.category || data.category.length < 1) {
      errors.category = "Category field shouldn't be empty";
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0,
      values: data,
    };
  }
}

export default new ItineraryService();
