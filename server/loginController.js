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
      const id = user._id;
      const uriHistory = user.uriHistory;
      console.log('user id: ', user._id);
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
          res.locals.SSID = id;
          res.locals.uriHistory = uriHistory;
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

loginController.addURI = (req, res, next) => {
  console.log('req.cookies.SSID');
  console.log(req.cookies.SSID);
  if (req.cookies.SSID !== undefined) {
    const { name } = req.body;
    const { uri } = req.body;
    Users.find({ _id: req.cookies.SSID })
      .then(data => {
        return data[0].uriHistory;
      })
      .then(uriHistory => {
        // console.log('inside of uriHistory this is the data[0]');
        // console.log(uriHistory);
        // const newEntry = {}; ///this was workaround for notation issue;
        // newEntry[name] = uri;
        // uriHistory.unshift(newEntry);
        // console.log('uriHistoryunshift');
        // console.log(uriHistory);
        // res.locals.updatedHistory = uriHistory;
        // Users.update(
        //   { _id: req.cookies.SSID },
        //   { $push: { uriHistory: uriHistory } }
        // );
        return next();
      });
  }
  return next();
};

module.exports = loginController;
