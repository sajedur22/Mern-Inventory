import jwt from "jsonwebtoken";

const CreateToken = (data) => {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 1 day expiry
    data: data
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
};

export default CreateToken;
