const path         = require('path');
const express      = require('express');
const bodyParser   = require('body-parser');
const hbs          = require('express-handlebars');
const mongoose     = require('mongoose');
const session      = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);

const errorsController = require('./controllers/errors');

const app   = express();
const store = new mongodbStore({
  uri:         'mongodb://localhost:27017/online_shop_development',
  collection:  'sessions'
});

const adminRoutes = require('./routes/admin');
const shopRoutes  = require('./routes/shop');
const authRoutes  = require('./routes/auth');

const User = require('./models/user');

app.use((req, res, next) => {
  User.findOne()
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.error(err));
});

app.engine('hbs', hbs({
  layoutsDir: 'views/layouts',
  defaultLayout: 'main',
  extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:             'my secret',
  resave:             false,
  saveUninitialized:  false,
  store:              store
}));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorsController.get404);

mongoose.connect('mongodb://localhost:27017/online_shop_development', {
  useNewUrlParser: true
})
  .then(() => User.findOne())
  .then(user => {
    if (!user) {
      const newUser = User({
        name: 'Mohammad',
        email: 'mohd.a.saed@gmail.com',
        cart: {
          item: []
        }
      });
      newUser.save();
    }

    console.log('Connected to MongoDB');
    app.listen(3000, () => console.log('Server listening on port 3000'));
  })
  .catch(err => console.error(err));
