import { NextFunction } from "express";
import Joi from "joi";

const pick = (object: any, keys: any) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

const validate = (schema: any) => (req: any, res: any, next: NextFunction) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details: any) => details.message)
      .join(", ");
    return res.status(500).json({ success: false, message: errorMessage });
  }
  Object.assign(req, value);
  return next();
};

export default validate;
