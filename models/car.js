const mongoose = require("mongoose");
const Joi = require("joi");
const { Type } = require("./type");

const Car = mongoose.model(
  "Car",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50
    },
    type: {
      type: Type.schema,
      required: true
    },
    capacity: {
      type: Number,
      min: 1,
      max: 255,
      required: true
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      default: "Manual"
    },
    airConditioner: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      required: true
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 255
    }
  })
);

function validateCar(car) {
  const schema = {
    name: Joi.string()
      .min(1)
      .max(50)
      .required(),
    typeId: Joi.objectId().required(),
    capacity: Joi.number()
      .integer()
      .min(1)
      .required(),
    transmission: Joi.string().only("Manual", "Automatic"),
    airConditioner: Joi.boolean(),
    color: Joi.string().required(),
    numberInStock: Joi.number()
      .integer()
      .min(0)
      .required(),
    price: Joi.number()
      .min(0)
      .required()
  };

  return Joi.validate(car, schema);
}

exports.Car = Car;
exports.validate = validateCar;
