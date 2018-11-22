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
      req.session.save(err => {
        if (err) return console.error(err);
        res.redirect('/');
      });
    })
    .catch(err => console.error(err));
};

const postLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) return console.error(err);
    res.redirect('/');
  });
};

const getSignup = (req, res) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    activeSignup: true,
    formsCSS: true,
    authCSS: true,
    isLoggedIn: false
  });
};

const postSignup = (req, res) => {
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup
};
