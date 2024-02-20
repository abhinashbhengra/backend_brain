import prisma from "../DB/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { loginSchema, registerSchema } from "../validations/authValidation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

  static async login(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(loginSchema);
      const payload = await validator.validate(body);

      // Check for existing email
      const findUser = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (findUser) {
        if (!bcrypt.compareSync(payload.password, findUser.password)) {
          return res.status(400).json({
            error: {
              message: "Invalid Credentials",
            },
          });
        }
        // Issue Token to User

        const payloadData = {
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
          profile: findUser.profile,
        };
        const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
          expiresIn: "365d",
        });

        res.json({
          message: "logged In",
          access_token: `Bearer ${token}`,
        });
      }

      return res.status(400).json({
        status: 400,
        message: "User not exist with this email",
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
