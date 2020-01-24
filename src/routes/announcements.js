import { Router } from 'express';

import { AnouncementController } from '../controllers';

const router = Router();

router.post('/', AnouncementController.create);

export default router;
