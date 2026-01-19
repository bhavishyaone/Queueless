import app from "./app.js";
import ENV  from "./config/env.js";

const startserver = ()=>{

    app.get("/",(req,res)=>{
    return res.status(200).json({message:"server chal gaya"})
    })

    app.listen(ENV.PORT,console.log(`Server is running on port ${ENV.PORT}`))

}
startserver();