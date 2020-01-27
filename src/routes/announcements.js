import { Router } from 'express';

import { AnouncementController } from '../controllers';

const router = Router();

router.post('/', AnouncementController.create);
router.patch('/:id', AnouncementController.update);

export default router;
