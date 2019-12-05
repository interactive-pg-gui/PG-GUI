 const Users = require("./db/db");

const loginController = {};

loginController.signup = (req, res, next)=>{
  const {username, password} = req.body;

  Users.findOne({username})
    .then(user =>{
      console.log('user')
      console.log(user)
      console.log('line 10 error')
      if(user){
        const errObj = {
          log: "Error in loginController.signup",
          message: {err: "Username already exists.  Try again!"}
        }
        return next(errObj)
      }else{
        console.log("error on line 18")
        const newUser = new Users({
          
          username,
          password,
          history: []
        });

        newUser.save((err, users) =>{
          console.log('users')
          console.log(users)
          if(err){
            return next({err});
          }
          return next()
        })
      }
    })
    .catch(err =>{
      if(err)return next({
        log: "loginController.signup.catch, line 26",
        message: "Issue with signup"
      })
    })
    return next();
}

module.exports = loginController;


