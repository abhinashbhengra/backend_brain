import prisma from "../DB/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { registerSchema } from "../validations/authValidation.js";
import bcrypt from 'bcryptjs'

class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema);

      const payload = await validator.validate(body);

      // Password Encryption
      
      const salt = bcrypt.genSaltSync(10)
      payload.password = bcrypt.hashSync(payload.password, salt)

      return res.json({
        payload,
      });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({
          errors: error.message,
        });
      }
    }
  }
}

export default AuthController;
