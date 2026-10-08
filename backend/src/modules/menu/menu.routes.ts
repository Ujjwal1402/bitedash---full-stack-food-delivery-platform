import { Router } from 'express';
import { menuController } from './menu.controller.ts';
import { authenticateJWT, requireRoles } from '../../middleware/auth.middleware.ts';

const router = Router();

// Public item discovery & AI search
router.get('/search', (req, res, next) => menuController.search(req, res, next));
router.post('/ai-discover', (req, res, next) => menuController.aiDiscover(req, res, next));

// Partner management
router.post('/items', authenticateJWT, requireRoles('RESTAURANT', 'ADMIN'), (req, res, next) =>
  menuController.createItem(req, res, next)
);
router.put('/items/:id', authenticateJWT, requireRoles('RESTAURANT', 'ADMIN'), (req, res, next) =>
  menuController.updateItem(req, res, next)
);
router.patch('/items/:id/availability', authenticateJWT, requireRoles('RESTAURANT', 'ADMIN'), (req, res, next) =>
  menuController.toggleAvailability(req, res, next)
);
router.delete('/items/:id', authenticateJWT, requireRoles('RESTAURANT', 'ADMIN'), (req, res, next) =>
  menuController.deleteItem(req, res, next)
);
router.post('/categories', authenticateJWT, requireRoles('RESTAURANT', 'ADMIN'), (req, res, next) =>
  menuController.createCategory(req, res, next)
);

export default router;
