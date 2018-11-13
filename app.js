const path       = require('path');
const express    = require('express');
const bodyParser = require('body-parser');
const hbs        = require('express-handlebars');

const errorsController = require('./controllers/errors');
const sequelize        = require('./utils/database');
const User             = require('./models/user');
const Product          = require('./models/product');
const Cart             = require('./models/cart');
const CartItem         = require('./models/cart_item');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes  = require('./routes/shop');

app.use((req, res, next) => {
  User.findByPk(1)
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

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorsController.get404);

User.hasMany(Product);
User.hasOne(Cart);
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => User.findByPk(1))
  .then(user => {
    if (!user) {
      return User.create({
        name: 'Mohammad',
        email: 'mohd.a.saed@gmail.com'
      });
    }
    return user;
  })
  .then(user => user.createCart())
  .then(() => app.listen(3000))
  .catch(err => console.error(err));
