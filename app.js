const path       = require('path');
const express    = require('express');
const bodyParser = require('body-parser');
const hbs        = require('express-handlebars');

const errorsController = require('./controllers/errors');
const mongoConnect     = require('./utils/database').mongoConnect;

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes  = require('./routes/shop');

// app.use((req, res, next) => {
//   User.findByPk(1)
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.error(err));
// });

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

mongoConnect(() => {
  app.listen(3000);
});
