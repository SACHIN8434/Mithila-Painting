import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, brand, discountPrice } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Name, description, price, and category are required' });
    }

    let images = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) reject(error);
              else resolve({ url: result.secure_url, public_id: result.public_id });
            }
          );
          stream.end(file.buffer);
        });
      });

      images = await Promise.all(uploadPromises);
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      brand,
      discountPrice,
      images,
      seller: req.user._id,
    });

    return res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    console.log('Error in createProduct', err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json({ products });
  } catch (err) {
    console.log('Error in getProducts', err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ product });
  } catch (err) {
    console.log('Error in getProductById', err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = false;
    await product.save();

    return res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.log('Error in deleteProduct', err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};