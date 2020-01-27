import { Router } from 'express';

import { AnouncementController } from '../controllers';
import Auth from '../middlewares/auth';

const router = Router();

router.get('/', [Auth.attachCredentials], AnouncementController.getAll);
router.get('/:id', [Auth.attachCredentials], AnouncementController.getOne);
router.post('/', [Auth.attachCredentials], AnouncementController.create);
router.patch('/:id', [Auth.attachCredentials], AnouncementController.update);

export default router;
