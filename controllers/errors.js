const get404 = (req, res) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found!',
    isLoggedIn: req.session.isLoggedIn
  });
};

const get500 = (req, res) => {
  res.status(500).render('500', {
    pageTitle: 'Error!',
    isLoggedIn: req.session.isLoggedIn
  });
};

module.exports = {
  get404,
  get500
};
