import { Router } from 'express';

import { AnouncementController } from '../controllers';
import Auth from '../middlewares/auth';

const router = Router();

router.get('/', [Auth.getCurrentUser], AnouncementController.getAll);
router.get('/:id', [Auth.getCurrentUser], AnouncementController.getOne);
router.post('/', [Auth.getCurrentUser], AnouncementController.create);
router.patch('/:id', [Auth.getCurrentUser], AnouncementController.update);

export default router;
