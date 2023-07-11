//might delete
exports.getLogin = (req, res, next) => {
    if (req.session.isLoggedIn) {
      res.render('index', {
        pageTitle: 'SnaccOverflow'
      });
    } else {
      res.render('login', {
        pageTitle: 'Login',
      });
    }
  };
  
  exports.postLogin = (req, res, next) => {
    if (req.body.username === 'aaa' && req.body.password === '111') {
      req.session.isLoggedIn = true;
      res.redirect('/index');
    } else {
      res.redirect('/');
    }
  };
  
  exports.getLogout = (req, res, next) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  };
  