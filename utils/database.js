const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = cb => {
  MongoClient.connect('mongodb://localhost:27017/online_shop_development')
    .then(client => {
      console.log('Connected to MongoDB');
      _db = client.db();
      cb(client);
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

module.exports = {
  mongoConnect,
  getDb
};
