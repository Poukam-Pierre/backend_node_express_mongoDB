const express = require('express')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const stuffCtrl = require('../controllers/stuff')


const router = express.Router()


router.get('/', auth, stuffCtrl.getAllThings);

router.get('/:id', auth, stuffCtrl.getOneThing)

router.post('/', auth, multer, stuffCtrl.creatingThing)

router.put('/:id', auth, multer, stuffCtrl.modifyThing)

router.delete('/:id', auth, stuffCtrl.deleteThing)

module.exports = router