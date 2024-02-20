class ProfileController {
  static async index(req, res) {
    try {
      const user = req.user;
      return res.json({
        status: 200,
        user,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong!",
      });
    }
  }
  static async store() {}
  static async show() {}
  static async update() {
    try {
      const { id } = req.params;
      const authUser = req.user;
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          status: 400,
          message: "Image is required ",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong!",
      });
    }
  }
  static async destroy() {}
}

export default ProfileController;
