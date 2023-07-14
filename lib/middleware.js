
const isLoggedInMiddleware = (req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    // if(req.session.isLoggedIn){
    //   app.get('/api/user/:id' , async(req, res)=>{
    //     if(res.remembered){
    //       req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 21; //reset to 21 days
    //     }
    //   }
    // )
    // }
    next();
  };

module.exports = {
  isLoggedInMiddleware,
};




  