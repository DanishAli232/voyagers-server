import Itinerary from "../models/Itinerary.js";

class ItineraryService {
  async addItinerary(values) {
    let itinerary = await Itinerary.create(values);
    return itinerary;
  }

  async getListing(query, limit) {
    const itineraries = await Itinerary.find(query).populate("userId").limit(limit);

    let filteredItineraries = itineraries.filter((each) => each.userId.stripeConnected);

    return filteredItineraries;
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

  async deleteDay(id, data) {
    const itinerary = await Itinerary.findByIdAndUpdate(id, { $set: { eachDetail: data } });
    return itinerary;
  }

  parseImages(files, data) {
    let eachDetail = JSON.parse(data.eachDetail);
    // let eachData = [{}];
    return eachDetail.map((each, idx) => {
      let objData = {
        stayImages: each.stayImages ? [...each.stayImages] : [],
        tasteImages: each.tasteImages ? [...each.tasteImages] : [],
        experienceImages: each.experienceImages ? [...each.experienceImages] : [],
        vibeImages: each.vibeImages ? [...each.vibeImages] : [],
        ...each,
      };
      files
        .filter((each) => each.fieldname !== "image")
        .map((file, idx) => {
          if (file.fieldname.includes(`eachDetail[${each.day}].stayImages[`)) {
            objData = {
              ...objData,
              stayImages: [...objData.stayImages, `${process.env.BASE_URL}/img/${file.filename}`],
            };
          }

          if (file.fieldname.includes(`eachDetail[${each.day}].experienceImages[`)) {
            objData = {
              ...objData,
              experienceImages: [...objData.experienceImages, `${process.env.BASE_URL}/img/${file.filename}`],
            };
          }

          if (file.fieldname.includes(`eachDetail[${each.day}].vibeImages[`)) {
            objData = {
              ...objData,
              vibeImages: [...objData.vibeImages, `${process.env.BASE_URL}/img/${file.filename}`],
            };
          }

          if (file.fieldname.includes(`eachDetail[${each.day}].tasteImages[`)) {
            objData = {
              ...objData,
              tasteImages: [...objData.tasteImages, `${process.env.BASE_URL}/img/${file.filename}`],
            };
          }
        });
      return objData;
    });
  }

  async updateItinerary(data, itineraryId) {
    try {
      // console.log("Data", data, "Data");
      const itinerary = await Itinerary.findByIdAndUpdate(itineraryId, { $set: data });

      // await itinerary.save();
      return itinerary;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async deleteItinerary(id, userId) {
    try {
      const itinerary = await Itinerary.deleteOne({ _id: id });
      return itinerary;
    } catch (err) {
      console.log(err);
    }
  }

  validateItineraryInput(data, files) {
    let errors = {};
    // validate Title
    if (!data.title || data.title?.trim() === "") {
      errors.title = "Title field shouldn't be empty";
    }

    // validate Country
    if (!data.country || data.country?.trim() === "") {
      errors.country = "Country field shouldn't be empty";
    }

    // validate Price
    if (!data.price || data.price?.trim() === "") {
      errors.price = "Price field shouldn't be empty";
    }

    // validate Introduction
    if (!data.introduction || data.introduction?.trim() === "") {
      errors.introduction = "Introduction field shouldn't be empty";
    }

    // validate Image
    if (!files || !files.find((each) => each.fieldname === "image")) {
      errors.image = "Images shouldn't be empty";
    }

    // validate Sales Pitch
    if (!data.salesPitch || data.salesPitch?.trim() === "") {
      errors.salesPitch = "Sales Pitch field shouldn't be empty";
    }

    // validate category
    data.category = JSON.parse(data.category);
    if (!data.category || data.category.length < 1) {
      errors.category = "Category field shouldn't be empty";
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0,
      values: {
        country: data.country,
        price: data.price,
        category: data.category,
        introduction: data.introduction,
        salesPitch: data.salesPitch,
        image: data.image,
        eachDetail: data.eachDetail,
        title: data.title,
      },
    };
  }
}

export default new ItineraryService();
