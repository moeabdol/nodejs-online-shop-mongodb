const getLogin = (req, res) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    activeLogin: true,
    formsCSS: true,
    authCSS: true
  });
};

module.exports = {
  getLogin
};
