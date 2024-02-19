import prisma from "../DB/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { registerSchema } from "../validations/authValidation.js";

class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vim.compile(registerSchema);
      const payload = await validator.validate(body);

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
