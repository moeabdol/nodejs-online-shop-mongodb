require('dotenv').config();

const path         = require('path');
const express      = require('express');
const bodyParser   = require('body-parser');
const hbs          = require('express-handlebars');
const mongoose     = require('mongoose');
const session      = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);
const csurf        = require('csurf');
const flash        = require('connect-flash');

const errorsController = require('./controllers/errors');

const app   = express();
const csrf  = csurf();
const store = new mongodbStore({
  uri:         'mongodb://localhost:27017/online_shop_development',
  collection:  'sessions'
});

const adminRoutes = require('./routes/admin');
const shopRoutes  = require('./routes/shop');
const authRoutes  = require('./routes/auth');

const User = require('./models/user');

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
app.use(csrf);      // must be initialized after the session
app.use(flash());   // must be initialized after the session

app.use((req, res, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.error(err));
});

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csrfToken  = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorsController.get404);

mongoose.connect('mongodb://localhost:27017/online_shop_development', {
  useNewUrlParser: true
})
  .then(() => User.findOne())
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => console.log('Server listening on port 3000'));
  })
  .catch(err => console.error(err));
