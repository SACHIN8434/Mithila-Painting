import express from 'express';
import upload from '../middlewares/multer.js';
import { protect } from '../middlewares/authUser.js';
import { isAdmin } from '../middlewares/authAdmin.js';
import { createProduct, deleteProduct } from '../controllers/product.js';
import { adminLogin } from '../controllers/admin.js';

const router = express.Router();

// public — this is how an admin gets their token in the first place
router.post('/login', adminLogin);

// protected — requires a valid admin token from above
router.post('/create-product', protect, isAdmin, upload.array('images', 2), createProduct);
router.delete('/:id',deleteProduct)

export default router;