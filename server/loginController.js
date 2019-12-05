const bcrypt = require('bcryptjs');

const Users = require('./db/db');

const loginController = {};

loginController.signup = (req, res, next) => {
  const { username, password } = req.body;

  Users.findOne({ username }).then(user => {
    if (user) {
      const errObj = {
        log: 'Error in loginController.signup',
        message: { err: 'Username already exists.  Try again!' }
      };
      return next(errObj);
    } else {
      const newUser = new Users({
        username,
        password,
        uriHistory: []
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              // may need to redirect user to login
              // res.redirect('/users/login');
              return next();
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
};

loginController.login = (req, res, next) => {
  const { username, password } = req.body;

  Users.findOne({ username }).then(user => {
    if (!user) {
      const errObj = {
        log: 'Error in loginController.login',
        message: { err: 'Username does not exist.  Sign up or check yourself!' }
      };
      return next(errObj);
    } else {
      const hashedPassword = user.password;
      console.log('hashedPassword', hashedPassword);
      console.log('password', password);

      bcrypt.compare(password, hashedPassword, (err, response) => {
        if (err) {
          console.log('error in bcrypt', err);
          return next({
            log: 'bcrypt compare failed',
            message: 'server could not verify password'
          });
        }
        if (response) {
          // send JWT or session token or cookie or something like that
          return next();
        } else {
          return res.json({
            loginStatus: 'failed',
            message: 'wrong password, try again!'
          });
        }
      });
    }
  });
};

module.exports = loginController;
