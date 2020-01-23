const { Router } = require('express');

const router = Router();

const { UserController } = require('../controllers');

router.get('/:id', UserController.getOne);

module.exports = router;
