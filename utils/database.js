const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = cb => {
  MongoClient.connect('mongodb://localhost:27017/online_shop_development')
    .then(client => {
      console.log('Connected to MongoDB');
      cb(client);
    })
    .catch(err => console.error(err));
};

module.exports = mongoConnect;
