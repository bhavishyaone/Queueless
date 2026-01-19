import dotenv from 'dotenv'
dotenv.config()

const ENV = {
    PORT : process.env.PORT || 3000,
    MongoDB_URL : process.env.MongoDB_URL
}
export default ENV;