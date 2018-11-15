const mongodb = require('mongodb');

const getDb = require('../utils/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title       = title;
    this.price       = price;
    this.description = description;
    this.imageUrl    = imageUrl;
    this._id         = id;
  }

  save() {
    const db = getDb();
    if (this._id) {
      return db.collection('products').updateOne(
        { _id: mongodb.ObjectId(this._id) },
        { $set: this }
      );
    } else {
      return db.collection('products').insertOne(this);
    }
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray();
  }

  static findById(id) {
    const db = getDb();
    return db.collection('products').findOne({ _id: mongodb.ObjectId(id) });
  }
}

module.exports = Product;
