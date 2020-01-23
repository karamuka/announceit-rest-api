const { Router } = require('express');

const router = Router();

const { AuthController } = require('../controllers');

router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);

module.exports = router;
