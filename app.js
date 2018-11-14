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
const Order            = require('./models/order');
const OrderItem        = require('./models/order_item');

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
User.hasMany(Order);
Product.belongsTo(User);
Product.belongsToMany(Cart, { through: CartItem });
Product.belongsToMany(Order, { through: OrderItem });
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });

let incomingUser;
sequelize
  // .sync({ force: true })
  .sync()
  .then(() => User.findByPk(1))
  .then(user => {
    if (!user) {
      return User.create({ name: 'Mohammad', email: 'mohd.a.saed@gmail.com' });
    }
    return user;
  })
  .then(user => {
    incomingUser = user;
    return user.getCart();
  })
  .then(cart => {
    if (!cart) {
      return incomingUser.createCart();
    }
    return cart;
  })
  .then(() => {
    app.listen(3000, () => console.log('Server listening on port 3000'));
  })
  .catch(err => console.error(err));
