const path       = require('path');
const express    = require('express');
const bodyParser = require('body-parser');
const hbs        = require('express-handlebars');

const errorsController = require('./controllers/errors');
const sequelize        = require('./utils/database');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes  = require('./routes/shop');

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

sequelize
  .sync()
  .then(() => app.listen(3000))
  .catch(err => console.error(err));
