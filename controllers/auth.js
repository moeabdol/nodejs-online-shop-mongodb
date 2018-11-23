const nodemailer        = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}));

const getLogin = (req, res) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    activeLogin: true,
    formsCSS: true,
    authCSS: true,
    errorMessage: req.flash('error')
  });
};

const postLogin = (req, res) => {
  const email    = req.body.email;
  const password = req.body.password;

  User
    .findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email and/or password');
        return res.redirect('/login');
      }

      user.comparePassword(password, (err, isMatch) => {
        if (err) return console.error(err);
        if (!isMatch) {
          req.flash('error', 'Invalid email and/or password.');
          return res.redirect('/login');
        }

        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(err => {
          if (err) return console.error(err);
          res.redirect('/');
        });
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
    errorMessage: req.flash('error')
  });
};

const postSignup = (req, res) => {
  const email           = req.body.email;
  const password        = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User
    .findOne({ email: email })
    .then(user => {
      if (user) {
        req.flash('error', 'Email already exists!');
        return res.redirect('/signup');
      }

      const newUser = new User({
        email,
        password
      });
      newUser.save(err => {
        if (err) return console.error(err);
        transporter
          .sendMail({
            to: email,
            from: 'node@online-shop.com',
            subject: 'Signup Succeeded!',
            html: '<h1>You have successfully signed up!</h1>'
          })
          .then(() => res.redirect('/login'))
          .catch(err => console.error(err));
      });
    })
    .catch(err => console.error(err));
};

const getReset = (req, res) => {
  res.render('auth/reset_password', {
    pageTitle: 'Reset Password',
    activeLogin: true,
    formsCSS: true,
    authCSS: true,
    errorMessage: req.flash('error')
  });
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset
};
