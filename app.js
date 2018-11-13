const path       = require('path');
const express    = require('express');
const bodyParser = require('body-parser');
const hbs        = require('express-handlebars');

const db               = require('./utils/database');
const errorsController = require('./controllers/errors');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes  = require('./routes/shop');

db.execute('SELECT * FROM products')
  .then(result => {
    console.log(result);
  })
  .catch();

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

app.listen(3000);
