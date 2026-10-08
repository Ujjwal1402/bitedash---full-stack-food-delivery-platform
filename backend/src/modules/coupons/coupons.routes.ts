import { Router } from 'express';
import { couponsController } from './coupons.controller.ts';

const router = Router();

router.get('/', (req, res, next) => couponsController.getActive(req, res, next));
router.post('/validate', (req, res, next) => couponsController.validate(req, res, next));

export default router;
