const { Car, validate } = require("../models/car");
const { Type } = require("../models/type");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const validateReqBody = require("../middleware/validateReqBody");
const express = require("express");
const router = express.Router();

const notFoundError = "Car with given ID does not exist.";
const typeIdError = "Invalid type.";

router.get("/", async (req, res) => {
  const cars = await Car.find().sort("name");
  res.send(cars);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) return res.status(404).send(notFoundError);

  res.send(car);
});

router.post("/", [auth, admin, validateReqBody(validate)], async (req, res) => {

  const type = await Type.findById(req.body.typeId);
  if (!type) return res.status(400).send(typeIdError);

  const car = new Car(setValues(req, type));
  await car.save();

  res.status(201).send(car);
});

router.put(
  "/:id",
  [auth, admin, validateObjectId, validateReqBody(validate)],
  async (req, res) => {
    const type = await Type.findById(req.body.typeId);
    if (!type) return res.status(400).send(typeIdError);

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      setValues(req, type),
      {
        new: true
      }
    );

    if (!car) return res.status(404).send(notFoundError);

    res.send(car);
  }
);

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const car = await Car.findByIdAndRemove(req.params.id);

  if (!car) return res.status(404).send(notFoundError);

  res.send(car);
});

function setValues(req, type) {
  return {
    name: req.body.name,
    type: {
      _id: type._id,
      name: type.name
    },
    capacity: req.body.capacity,
    transmission: req.body.transmission,
    airConditioner: req.body.airConditioner,
    color: req.body.color,
    numberInStock: req.body.numberInStock,
    price: req.body.price
  };
}

module.exports = router;
