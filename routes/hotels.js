const express = require('express')
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()
const Hotel = require('../models/hotels')

router.post('/createhotel', requireLogin, (req, res, next) =>{
    let hotel = new Hotel({
        name: req.body.name,
        code: req.body.code,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        imageUrl: req.body.imageUrl,
        rating: req.body.rating
    })
    hotel.save(function(err, savedHotel){
        if(err)
            res.status(400).json(err)
        else if(!savedHotel)
            res.status(202).json("hotel not created")
        else
            res.status(201).json(savedHotel)
    })
})

router.patch('/updatehotel', requireLogin, (req, res, next) =>{
    Hotel.updateOne(
        { "_id" : req.body._id },
        { $set: req.body }
    ).exec(function(err, hotelData){
        if(err)
            res.status(400).json(err)
        else
            res.status(200).json(hotelData)
    })
})

router.delete('/deletehotel', requireLogin, (req, res, next) =>{
    User.deleteOne({"_id":req.params.hotel_id}).exec(function(err, userData){
        if(err)
            res.status(400).json(err)
        else
            res.status(200).json(userData)
    })
})

router.get('/fetchhotel', requireLogin, (req, res, next) =>{
    Hotel.find({}).exec(function(err, hotelData){
        if(err)
            res.status(400).json(err)
        else if(!hotelData)
            res.status(202).json("no data found")
        else
            res.status(200).json(hotelData)
    })
})

module.exports = router