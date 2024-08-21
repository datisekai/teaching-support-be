import { Request, Response } from "express";
class UploadController {
  static uploadImage = (req: any, res: Response) => {
    try {
      res.status(200).json({
        message: "Image uploaded successfully",
        file: req.file,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

export default UploadController;
