import { Router } from 'express';

import { UserController } from '../controllers';
import Auth from '../middlewares/auth';

const router = Router();

router.get('/adveritisers', [Auth.attachCredentials], UserController.getAdvertisers);
router.get('/adveritisers/:id', [Auth.attachCredentials], UserController.getAdvertiser);

export default router;
