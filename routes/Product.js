import express from 'express';
import upload from '../middlewares/multer.js';
import { protect } from '../middlewares/authUser.js';
import { isAdmin } from '../middlewares/authAdmin.js';
import { getProductById, getProducts } from '../controllers/product.js';


const router = express.Router();

router.get("/get-products",getProducts);
router.get('/:id',getProductById);

export default router;