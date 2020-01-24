import { Router } from 'express';

import { UserController } from '../controllers';

const router = Router();

router.get('/adveritisers', UserController.getAdverisers);
router.get('/adveritisers/:id', UserController.getAdveriser);

export default router;
