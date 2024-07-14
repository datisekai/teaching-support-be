import dotenv from "dotenv";

dotenv.config();
const config = {
  jwtSecret: process.env.JWT_SECRET,
  domainUrl: process.env.DOMAIN_URL
};

export default config;
