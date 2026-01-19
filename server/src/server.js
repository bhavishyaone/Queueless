import app from "./app.js";
const PORT = 3000;

const startserver = ()=>{
    app.get("/",(req,res)=>{
    return res.status(200).json({message:"server chal gaya"})
    })

    app.listen(PORT,console.log(`Server is running on port ${PORT}`))

}
startserver();