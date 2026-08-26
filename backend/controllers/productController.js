const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      const re = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: re }, { description: re }, { category: re }];
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, sizes, category, inStock, featured, rating } = req.body;
    let parsedSizes = sizes;
    if (typeof sizes === 'string') {
      parsedSizes = sizes.split(',').map((s) => s.trim()).filter(Boolean);
    }
    const product = new Product({
      name,
      description,
      price: Number(price),
      sizes: parsedSizes && parsedSizes.length ? parsedSizes : ['S', 'M', 'L', 'XL'],
      category,
      image: req.file ? req.file.filename : '',
      inStock: inStock === 'false' || inStock === false ? false : true,
      featured: featured === 'true' || featured === true,
      rating: rating !== undefined ? Number(rating) : 0,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const { name, description, price, sizes, category, inStock, featured, rating } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (rating !== undefined) product.rating = Number(rating);
    if (sizes !== undefined) {
      let parsed = sizes;
      if (typeof sizes === 'string') parsed = sizes.split(',').map((s) => s.trim()).filter(Boolean);
      if (parsed.length) product.sizes = parsed;
    }
    if (inStock !== undefined) product.inStock = inStock === 'false' || inStock === false ? false : true;
    if (featured !== undefined) product.featured = featured === 'true' || featured === true;
    if (req.file) product.image = req.file.filename;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product removed', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
