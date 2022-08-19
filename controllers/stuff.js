// Made by Poukam Ngamaleu

const Thing = require('../models/Thing')
const fs = require('fs')

exports.getAllThings = (req, res, next) => {
    Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({error}))
}

exports.getOneThing = (req, res) => {
    Thing.findOne({_id: req.params.id})
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({error}))
}

// exports.creatingThing = (req, res) => {
//     delete req.body._id
//     const thing = new Thing({
//         ...req.body
//     })
//     thing.save()
//     .then(()=> res.status(201).json({message: 'Object enregistré !'}))
//     .catch(error => res.status(400).json({error}))
// }

exports.creatingThing = (req, res) => {
    const thingObject = JSON.parse(req.body.thing)
    delete thingObject._id
    delete thingObject._userId
    const thing = new Thing({
      ...thingObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
  
    thing.save()
    .then(()=> { res.status(201).json({message: 'Object created !!'})})
    .catch(error => res.status(400).json({ error }))
  }

// exports.modifyThing = (req, res) => {
//     Thing.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
//     .then(() => res.status(200).json({message: 'Object modifié'}))
//     .catch(error => res.status(400).json({error}))
// }

exports.modifyThing = (req, res) => {
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body}

    delete thingObject._userId
    Thing.findOne({_id: req.params.id})
    .then((thing) => {
        if (thing.userId != req.auth.userId) {
            res.status(401).json({messsage: 'Non-autorisé'})
        } else {
            Thing.updateOne({_id: req.params.id}, { ...thingObject, _id:req.params.id})
            .then(()=>{ res.status(200).json({message:'Onject modified !!'})})
            .catch(error => { res.status(401).json({ error })})
        }
    })
    .catch(error => {res.status(401).json({ error })})
}

// exports.deleteThing = (req, res) => {
//     Thing.deleteOne({_id: req.params.id})
//     .then(() => res.status(200).json({message:'Object supprimé !'}))
//     .catch(error => res.status(404).json({error}))
// }
exports.deleteThing = (req, res) => {
    Thing.findOne({ _id: req.params.id})
        .then((thing) => {
            if(thing.userId != req.auth.userId){
                res.status(401).json({message: 'Non autorisé'})
            } else {
                const filename = thing.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message:'Object deleted !!'})})
                    .catch(error => {res.status(401).json({ error })})
                })
            }
        })
        .catch(error => { res.status(500).json({message:'Non autorisé !!'})})
}