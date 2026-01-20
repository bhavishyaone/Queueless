import dotenv from "dotenv";

dotenv.config();

const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET:process.env.JWT_SECRET
};
export default ENV;
