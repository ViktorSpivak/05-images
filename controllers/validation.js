const Joi = require("@hapi/joi");

class validations {
  validateRequest = (req, res, next) => {
    const rules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      subscription: Joi.string(),
    });
    const validationResult = rules.validate(req.body);
    if (validationResult.error) {
      res.status(422).json({ message: "Missing required field" });
      return;
    }
    next();
  };
  validateSignIn = (req, res, next) => {
    const rules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationResult = rules.validate(req.body);
    if (validationResult.error) {
      res.status(422).json({ message: "Missing required field" });
      return;
    }
    next();
  };
}
module.exports = new validations();
