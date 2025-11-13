import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "토큰 없음" });
    }

    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "유효하지 않은 토큰" });
  }
};
