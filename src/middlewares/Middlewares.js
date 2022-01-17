const httpStatus = require("http-status");
const JWT = require("jsonwebtoken");

class Middlewares {
    validate = (schema, source) => (req, res, next) => { //source user bilgisi yani req.body. Source yerine => req.body, req.params, req.query
      const { value, error } = schema.validate(req[source]); 
      if (error) {
        const errorMessage = error?.details
          ?.map((detail) => detail?.message)
          .join(", ");
          //   ["message1", "message2", "m3"] => "message1, message2, m3"
        return res.status(httpStatus.BAD_REQUEST).send({ error: errorMessage });
      }
      Object.assign(req, value);
      return next();
    };

    authenticateUser = (req, res, next) => {
      const token = req.headers?.token;
      if(!token) res.status(httpStatus.UNAUTHORIZED).send({ message: "You have to login first to continue!"});
      JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
        if(err) return res.status(httpStatus.FORBIDDEN).send(err);
        req.user = user;
        next();
      });
    };

      //checkerdan sonra addprofilephoto dan !req.params.id yi kaldir
}

module.exports = new Middlewares();