// backend/routes/products.js - Fixed image paths
const express = require('express');
const router = express.Router();

// Indian bakery products with English names and matching images
const products = [
  {
    id: 'p1',
    name: 'Butter Naan',
    price: 45,
    currency: '₹',
    image: '/assets/butter_naan.jpg',
    description: 'Soft and fluffy butter naan, freshly baked in tandoor',
    category: 'Bread'
  },
  {
    id: 'p2',
    name: 'Aloo Paratha',
    price: 60,
    currency: '₹',
    image: '/assets/Aloo_paratha.jpg',
    description: 'Stuffed whole wheat paratha with spiced potato filling',
    category: 'Paratha'
  },
  {
    id: 'p3',
    name: 'Pav Bhaji',
    price: 80,
    currency: '₹',
    image: '/assets/pav_bhaji.jpg',
    description: 'Mumbai style pav served with spicy vegetable curry',
    category: 'Snacks'
  },
  {
    id: 'p4',
    name: 'Samosa',
    price: 25,
    currency: '₹',
    image: '/assets/samosa.jpg',
    description: 'Crispy pastry filled with spiced potatoes and peas',
    category: 'Snacks'
  },
  {
    id: 'p5',
    name: 'Gulab Jamun',
    price: 40,
    currency: '₹',
    image: '/assets/jamun.jpg',
    description: 'Soft milk dumplings soaked in rose-flavored sugar syrup',
    category: 'Sweet'
  },
  {
    id: 'p6',
    name: 'Jalebi',
    price: 30,
    currency: '₹',
    image: '/assets/jalebi.jpg',
    description: 'Crispy spiral-shaped sweet soaked in sugar syrup',
    category: 'Sweet'
  },
  {
    id: 'p7',
    name: 'Puri Bhaji',
    price: 70,
    currency: '₹',
    image: '/assets/puri_bhaji.jpg',
    description: 'Deep-fried bread served with spiced potato curry',
    category: 'Breakfast'
  },
  {
    id: 'p8',
    name: 'Chole Bhature',
    price: 90,
    currency: '₹',
    image: '/assets/chole_bhature.jpg',
    description: 'Spicy chickpea curry with fluffy fried bread',
    category: 'Special'
  },
  {
    id: 'p9',
    name: 'Kachori',
    price: 35,
    currency: '₹',
    image: '/assets/kachori.jpg',
    description: 'Crispy pastry filled with spiced lentil mixture',
    category: 'Snacks'
  },
  {
    id: 'p10',
    name: 'Masala Dosa',
    price: 85,
    currency: '₹',
    image: '/assets/dosa.jpg',
    description: 'Crispy rice crepe filled with spiced potato',
    category: 'South Indian'
  },
  {
    id: 'p11',
    name: 'Idli Sambhar',
    price: 55,
    currency: '₹',
    image: '/assets/idli.jpg',
    description: 'Steamed rice cakes served with lentil soup',
    category: 'South Indian'
  },
  {
    id: 'p12',
    name: 'Rasgulla',
    price: 45,
    currency: '₹',
    image: '/assets/rasgulla.jpg',
    description: 'Soft cottage cheese balls in light sugar syrup',
    category: 'Sweet'
  },
  {
    id: 'p13',
    name: 'Bread Pakora',
    price: 40,
    currency: '₹',
    image: '/assets/bread_pakora.jpg',
    description: 'Bread slices dipped in gram flour batter and fried',
    category: 'Snacks'
  },
  {
    id: 'p14',
    name: 'Vada Pav',
    price: 35,
    currency: '₹',
    image: '/assets/vada_pav.jpg',
    description: 'Mumbai style potato fritter in bread bun',
    category: 'Street Food'
  },
  {
    id: 'p15',
    name: 'Pani Puri',
    price: 40,
    currency: '₹',
    image: '/assets/pani_puri.jpg',
    description: 'Crispy hollow puris filled with spicy water and chutney',
    category: 'Street Food'
  },
  {
    id: 'p16',
    name: 'Chicken Biryani',
    price: 180,
    currency: '₹',
    image: '/assets/chiken_biyani.jpg',
    description: 'Fragrant rice cooked with aromatic spices and chicken',
    category: 'Main Course'
  },
  {
    id: 'p17',
    name: 'Veg Biryani',
    price: 150,
    currency: '₹',
    image: '/assets/biyani.jpg',
    description: 'Fragrant rice cooked with vegetables and aromatic spices',
    category: 'Main Course'
  }
];

router.get('/', (req, res) => {
  res.json(products);
});

module.exports = router;