const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);

// const mongodb = require('mongodb');
//
// const getDb = require('../utils/database').getDb;
//
// class Product {
//   constructor(title, price, description, imageUrl, id) {
//     this.title       = title;
//     this.price       = price;
//     this.description = description;
//     this.imageUrl    = imageUrl;
//     this._id         = id ? new mongodb.ObjectId(id) : null;
//   }
//
//   save() {
//     const db = getDb();
//     if (this._id) {
//       return db.collection('products').updateOne(
//         { _id: this._id },
//         { $set: this }
//       );
//     } else {
//       return db.collection('products').insertOne(this);
//     }
//   }
//
//   static fetchAll() {
//     const db = getDb();
//     return db.collection('products').find().toArray();
//   }
//
//   static findById(id) {
//     const db = getDb();
//     return db.collection('products').findOne({ _id: new mongodb.ObjectId(id) });
//   }
//
//   static deleteById(id) {
//     const db = getDb();
//     return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(id) });
//   }
// }
//
// module.exports = Product;
