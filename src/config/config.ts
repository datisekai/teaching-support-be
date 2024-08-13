import dotenv from "dotenv";

dotenv.config();
const config = {
  jwtSecret: process.env.JWT_SECRET,
  domainUrl: process.env.DOMAIN_URL,
  ttdtUrl: "https://thongtindaotao.sgu.edu.vn",
};

export default config;
