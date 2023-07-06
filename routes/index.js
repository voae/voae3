var express = require('express');
var router = express.Router();

var controller = require('../controller/controller');

/* GET home page. */
router.get('/', controller.getIndex);

router.post('/synchronize-email', controller.getEmail);

router.post('/confirmation-email', controller.postEmailDetails);

module.exports = router;
