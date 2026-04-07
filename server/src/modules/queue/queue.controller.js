import {createToken,serveNextToken,completeToken,skipToken,getLiveQueue,getToken,getHistoryQueue,resetQueue,getQueueStats,searchTokenNumber,bulkCancelTokens} from '../queue/queue.service.js'


export const createTokenHandler = async (req,res)=>{
    try{
        const token = await createToken();
        return res.status(201).json(token)

    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error."})

    }
};


export const serveNextHandler = async (req,res)=>{
    try{
        const token = await serveNextToken({
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

export const getTokenHandler = async (req, res) => {
  try {
    const token = await getToken({ tokenId: req.params.id });
    return res.status(200).json(token);
  } catch (err) {
    console.log(err)
    return res.status(500).json({message:'server error'})
  }
};

export const getHistoryQueueHandler = async (req, res) => {
  try {
    const historyQueue = await getHistoryQueue();
    return res.status(200).json(historyQueue);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'server error' });
  }
};

export const resetQueueHandler = async (req, res) => {
  try {
      await resetQueue();
      return res.status(200).json({ message: "Queue reset successfully. All waiting tokens marked as skipped." });
  } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'server error' });
  }
};

export const getQueueStatsHandler = async (req, res) => {
  try {
      const stats = await getQueueStats();
      return res.status(200).json(stats);
  } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'server error' });
  }
};

export const searchTokenNumberHandler = async (req, res) => {
    try {
        const token = await searchTokenNumber(Number(req.params.tokenNumber));
        if (!token) return res.status(404).json({ message: "Token not found for today" });
        return res.status(200).json(token);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'server error' });
    }
};

export const bulkCancelTokensHandler = async (req, res) => {
    try {
        const { tokenIds } = req.body;
        if (!Array.isArray(tokenIds) || tokenIds.length === 0) {
            return res.status(400).json({ message: "Invalid token IDs array" });
        }
        await bulkCancelTokens(tokenIds);
        return res.status(200).json({ message: "Tokens cancelled successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'server error' });
    }
};