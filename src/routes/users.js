import { Router } from 'express';

import { UserController } from '../controllers';
import Auth from '../middlewares/auth';

const router = Router();

router.get('/adveritisers', [Auth.getCurrentUser], UserController.getAllAdvertisers);
router.get('/adveritisers/:id', [Auth.getCurrentUser], UserController.getOneAdvertiser);

export default router;
