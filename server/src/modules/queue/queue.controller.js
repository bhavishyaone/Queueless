import {createToken,serveNextToken,completeToken,skipToken,getLiveQueue} from '../queue/queue.service.js'


export const createTokenHandler = (req,res)=>{
    try{
        const token = createToken();
        return res.status(201).json(token)

    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error."})

    }
};


export const serveNextHandler = (req,res)=>{
    try{
        const token = serveNextToken({
            counterId:req.body.counterId,
            user:req.user
        })

        return res.status(200).json(token)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error"})
    }
}


export const completeTokenHandler = async (req, res) => {
  try {

    const token = await completeToken({
      tokenId: req.params.id,
      user: req.user
    });

    return res.status(200).json(token);

  } catch (err) {

    console.log(err)
    return res.status(500).json({message:'server error'})
  }
};

export const skipTokenHandler = async (req, res) => {

  try {
    const token = await skipToken({
      tokenId: req.params.id
    });

    return res.status(200).json(token);
    
  } catch (err) {

    console.log(err)
    return res.status(500).json({message:'server error'})
  }
};

export const getLiveQueueHandler = async (req, res) => {

  try {
    const queue = await getLiveQueue();
    return res.status(200).json(queue);
    
  } catch (err) {

    console.log(err)
    return res.status(500).json({message:'server error'})
  }
};