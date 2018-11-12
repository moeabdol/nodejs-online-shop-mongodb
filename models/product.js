const fs   = require('fs');
const path = require('path');

const file = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = (cb) => {
  fs.readFile(file, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

class Product {
  constructor(id, title, imageURL, description, price) {
    this.id          = id;
    this.title       = title;
    this.imageURL    = imageURL;
    this.description = description;
    this.price       = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(p => {
          if (p.id === this.id) return p;
        });
        const updatedProductsArray = [...products];
        updatedProductsArray[existingProductIndex] = this;
        fs.writeFile(file, JSON.stringify(updatedProductsArray), err => {
          if (err) console.error(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(file, JSON.stringify(products), err => {
          if (err) console.error(err);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
}

module.exports = Product;
