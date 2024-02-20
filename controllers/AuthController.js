import prisma from "../DB/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { registerSchema } from "../validations/authValidation.js";
import bcrypt from "bcryptjs";

class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema);

      const payload = await validator.validate(body);

      // Check for existing email
      const findUser = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (findUser) {
        return res.status(400).json({
          error: {
            email: "Email already taken.",
          },
        });
      }

      // Password Encryption

      const salt = bcrypt.genSaltSync(10);
      payload.password = bcrypt.hashSync(payload.password, salt);

      const user = await prisma.users.create({
        data: payload,
      });

      return res.json({
        status: 200,
        message: "successfully created user",
        user,
      });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({
          errors: error.message,
        });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong!!",
        });
      }
    }
  }
}

export default AuthController;
