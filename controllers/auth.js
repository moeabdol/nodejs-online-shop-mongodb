const bcrypt = require('bcryptjs');

const User = require('../models/user');

const getLogin = (req, res) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    activeLogin: true,
    formsCSS: true,
    authCSS: true
  });
};

const postLogin = (req, res) => {
  const email    = req.body.email;
  const password = req.body.password;

  User
    .findOne({ email })
    .then(user => {
      if (!user) return res.redirect('/login');

      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              if (err) return console.error(err);
              res.redirect('/');
            });
          }
          res.redirect('/login');
        })
        .catch(err => console.error(err));
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
    authCSS: true
  });
};

const postSignup = (req, res) => {
  const email           = req.body.email;
  const password        = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User
    .findOne({ email: email })
    .then(user => {
      if (user) return res.redirect('/signup');
      bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const newUser = new User({
            email,
            password: hashedPassword
          });
          newUser.save(err => {
            if (err) return console.error(err);
            res.redirect('/login');
          });
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup
};
