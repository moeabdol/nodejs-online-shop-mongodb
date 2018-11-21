const User = require('../models/user');

const getLogin = (req, res) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    activeLogin: true,
    formsCSS: true,
    authCSS: true,
    isLoggedIn: req.session.isLoggedIn
  });
};

const postLogin = (req, res) => {
  User.findOne()
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect('/');
    })
    .catch(err => console.error(err));
};

const postLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) return console.error(err);
    res.redirect('/');
  });
};

module.exports = {
  getLogin,
  postLogin,
  postLogout
};
