import { Router } from 'express';

import { UserController } from '../controllers';
import Auth from '../middlewares/auth';

const router = Router();

router.get('/', [Auth.getCurrentUser], UserController.getAll);
router.delete('/:id', [Auth.getCurrentUser], UserController.delete);

export default router;
