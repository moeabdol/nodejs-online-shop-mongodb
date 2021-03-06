const crypto               = require('crypto');
const nodemailer           = require('nodemailer');
const sendgridTransport    = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

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
    errorMessage: req.flash('error'),
    oldInput: {
      email: '',
      password: ''
    }
  });
};

const postLogin = (req, res, next) => {
  const email    = req.body.email;
  const password = req.body.password;
  const errors   = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      activeLogin: true,
      formsCSS: true,
      authCSS: true,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email,
        password
      },
      emailError: errors.array().find(e => e.param === 'email'),
      passwordError: errors.array().find(e => e.param === 'password')
    });
  }

  User
    .findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          pageTitle: 'Login',
          activeLogin: true,
          formsCSS: true,
          authCSS: true,
          errorMessage: 'Invalid email and/or password!',
          oldInput: {
            email,
            password
          }
        });
      }

      user.comparePassword(password, (err, isMatch) => {
        if (err) return console.error(err);
        if (!isMatch) {
          return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            activeLogin: true,
            formsCSS: true,
            authCSS: true,
            errorMessage: 'Invalid email and/or password!',
            oldInput: {
              email,
              password
            }
          });
        }

        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(err => {
          if (err) return console.error(err);
          res.redirect('/');
        });
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    errorMessage: req.flash('error'),
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

const postSignup = (req, res, next) => {
  const email    = req.body.email;
  const password = req.body.password;
  const errors   = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      activeSignup: true,
      formsCSS: true,
      authCSS: true,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email,
        password,
        confirmPassword: req.body.confirmPassword
      },
      emailError: errors.array().find(e => e.param === 'email'),
      passwordError: errors.array().find(e => e.param === 'password'),
      confirmPasswordError: errors.array().find(e => e.param === 'confirmPassword')
    });
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
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
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

const postReset = (req, res, next) => {
  const email = req.body.email;

  crypto
    .randomBytes(32, (err, buffer) => {
      if (err) {
        console.error(err);
        return res.redirect('/reset-password');
      }
      const token = buffer.toString('hex');
      User
        .findOne({ email })
        .then(user => {
          if (!user) {
            req.flash('error', 'Email doesn\'t exists');
            return res.redirect('/reset-password');
          }
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        })
        .then(() => {
          res.redirect('/');
          transporter
            .sendMail({
              to: email,
              from: 'node@online-shop.com',
              subject: 'Reset Password',
              html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password</p>
              `
            });
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    });
};

const getNewPassword = (req, res, next) => {
  const token = req.params.token;

  User
    .findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() }})
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid token');
        return res.redirect('/reset-password');
      }
      res.render('auth/new_password', {
        pageTitle: 'New Password',
        activeLogin: true,
        formsCSS: true,
        authCSS: true,
        errorMessage: req.flash('error'),
        userId: user._id,
        token: token
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId      = req.body.userId;
  const token       = req.body.token;

  User
    .findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid token');
        return res.redirect('/reset-password');
      }
      user.password = newPassword;
      user.resetToken = null;
      user.resetTokenExpiration = undefined;
      user.save(err => {
        if (err) return console.error(err);
        res.redirect('/login');
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword
};
