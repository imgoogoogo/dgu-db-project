import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ success: false, message: "토큰 없음" });

  // Authorization: Bearer xxx
  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ success: false, message: "토큰 형식 오류" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 이제 req.user가 JWT 기반으로 채워짐!
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "유효하지 않은 토큰" });
  }
}
