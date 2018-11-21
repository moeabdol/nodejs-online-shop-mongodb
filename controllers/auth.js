const getLogin = (req, res) => {
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    pageTitle: 'Login',
    activeLogin: true,
    formsCSS: true,
    authCSS: true
  });
};

const postLogin = (req, res) => {
  req.session.isLoggedIn = true;
  res.redirect('/');
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
