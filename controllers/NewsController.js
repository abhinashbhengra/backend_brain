import vine, { errors } from "@vinejs/vine";
import { newsSchema } from "../validations/NewsValidation.js";
import { generateUniqueId, imageValidator } from "../utils/helper.js";
import prisma from "../DB/db.config.js";

class NewsController {
  static async index(req, res) {
    try {
      return res.json({
        message: "Getting news...",
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: "Something went wrong",
      });
    }
  }
  static async store(req, res) {
    try {
      const user = req.user;
      const body = req.body;

      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          status: 400,
          message: "Image is required ",
        });
      }

      const image = req.files.image;
      const message = imageValidator(image?.size, image?.mimetype);

      if (message !== null) {
        return res.status(400).json({
          error: {
            profile: message,
          },
        });
      }

      const imgExt = image?.name.split(".");
      const imageName = `${generateUniqueId()}.${imgExt[1]}`;
      const uploadPath = `${process.cwd()}/public/images/${imageName}`;

      image.mv(uploadPath, (err) => {
        if (err) throw err;
      });

      const newPayload = {
        ...payload,
        image: imageName,
        user_id: user.id,
      };

      const news = await prisma.news.create({
        data: newPayload,
      });

      return res.json({
        status: 200,
        message: "successfully created news",
        news,
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
  static async show(req, res) {}
  static async update(req, res) {}
  static async destroy(req, res) {}
}

export default NewsController;
