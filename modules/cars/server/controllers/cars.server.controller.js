'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  Car = mongoose.model('Car'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an car
 */
exports.create = function (req, res) {
  var car = new Car(req.body);
  car.user = req.user;
 
  car.save(function (err) {
      console.log(err);
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(car);
    }
  });
};



/**
 * Show the current car
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var car = req.car ? req.car.toJSON() : {};

  // Add a custom field to the Car, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Car model.
  car.isCurrentUserOwner = !!(req.user && car.user && car.user._id.toString() === req.user._id.toString());

  res.json(car);
};

/**
 * Update an car
 */
exports.update = function (req, res) {
  var car = req.car;

  car.title = req.body.title;
  car.type = req.body.type;
  car.make = req.body.make;
  car.imageurl = req.body.imageurl;
  car.model = req.body.model;
  car.year = req.body.year;
  car.price = req.body.price;
  car.description = req.body.description;
  car.contact_email = req.body.contact_email;
  car.state = req.body.state;

  car.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(car);
    }
  });
};


/**
 * Create a article with Upload
 */
exports.createWithUpload = function(req, res) {
  var file = req.files.file;
  console.log(file.name);
  console.log(file.type);
  console.log(file.path);
  console.log(req.body.article);

  var art = JSON.parse(req.body.article);
  var article = new Article(art);
  article.user = req.user;

  fs.readFile(file.path, function (err,original_data) {
 if (err) {
   return res.status(400).send({
         message: errorHandler.getErrorMessage(err)
     });
 } 
    // save image in db as base64 encoded - this limits the image size
    // to there should be size checks here and in client
  var base64Image = original_data.toString('base64');
   fs.unlink(file.path, function (err) {
   if (err)
      { 
          console.log('failed to delete ' + file.path);
      }
      else{
        console.log('successfully deleted ' + file.path);
      }
  });
  article.image = base64Image;

  article.save(function(err) {
    if (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    } else {
        res.json(article);
    }
  });
});
};


/**
 * Delete an car
 */
exports.delete = function (req, res) {
  var car = req.car;

  car.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(car);
    }
  });
};

/**
 * List of Cars
 */
exports.list = function (req, res) {
  Car.find().sort('-created').populate('user', 'displayName').exec(function (err, cars) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cars);
    }
  });
};

/**
 * Car middleware
 */
exports.carByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Car is invalid'
    });
  }

  Car.findById(id).populate('user', 'displayName').exec(function (err, car) {
    if (err) {
      return next(err);
    } else if (!car) {
      return res.status(404).send({
        message: 'No car with that identifier has been found'
      });
    }
    req.car = car;
    next();
  });
};
