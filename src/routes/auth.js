const { Router } = require('express');

const router = Router();

const { AuthController } = require('../controllers');

router.post('/signup', AuthController.signUp);

module.exports = router;
