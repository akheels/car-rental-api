const mongoose = require("mongoose");
const Joi = require("joi");
const moment = require("moment");
const number = require("joi/lib/types/number");

const rentalSchema = new mongoose.Schema({
  user: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50
      },
      email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
      }
    }),
    required: true
  },
  car: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 50
      },
      price: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  days: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

rentalSchema.statics.lookup = function(userId, carId) {
  return this.findOne({
    "user._id": userId,
    "car._id": carId,
  });
};

rentalSchema.methods.return = function(date) {
  this.dateReturned = date;
  const returnRentalDays = moment(this.dateReturned).diff(this.dateOut, "days");
  const currentRentalDays = moment().diff(this.dateOut, "days");
  if(returnRentalDays <= currentRentalDays) {
    this.rentalFee = currentRentalDays * this.car.price;
  }else{
    const rentalFeeExtra = (returnRentalDays - currentRentalDays) * 1000;
    this.rentalFee = rentalFeeExtra + (returnRentalDays * this.car.price);
  }
};

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  const schema = {
    carId: Joi.objectId().required(),
    days: Joi.number().required()
  };

  return Joi.validate(rental, schema);
}

function validateRentalReturn(rental) {
  const schema = {
    carId: Joi.objectId().required(),
  };

  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
exports.validateRentalReturn = validateRentalReturn;
