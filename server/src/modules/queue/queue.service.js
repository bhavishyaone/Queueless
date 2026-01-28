import QueueToken from '../../models/QueueToken.js'
import Counter from '../../models/counter.js'
import Clinic from '../../models/clinic.js'
import  {COUNTER_STATUS,QUEUE_STATUS} from '../../utils/constants.js'

// Yeh Today ki date provide karega
const today = ()=> new Date().toISOString().slice(0,10)


// Create new Token
export const createToken = async()=>{
    const clinic = await Clinic.findOne()

    if(!clinic){
        throw new Error('Clinic not found')
    }

    if(!clinic.isOpen){
        throw new Error('Clinic is closed')
    }

    const countToday = await QueueToken.countDocuments({
        queueDate:today()
    })

    const token = await QueueToken.create({
        tokenNumber:countToday+1,
        queueDate:today()
    })

    return token
}


// Serve Next Token
export const serveNextToken = async({counterId,user})=>{

    const counter = await Counter.findById(counterId)

    if(!counter || counter.status!==COUNTER_STATUS.ACTIVE){
        throw new Error(`Counter is not ACTIVE`)
    }

    const alreadyServing = await QueueToken.findOne({
        counterId,
        queueDate:today()
    })

    if(alreadyServing){
        throw new Error('"Counter already serving a token"')
    }


    const nextToken  = await QueueToken.findOne({
        status:QUEUE_STATUS.WAITING,
        queueDate:today()
    }).sort({createdAt:1})

    if(!nextToken){
        throw new Error("No Token in Queue.")
    }

    nextToken.status = QUEUE_STATUS.SERVING
    nextToken.counterId = counter._id;
    nextToken.counterNameSnapshot = counter.name;
    nextToken.servedBy = user._id;
    nextToken.servedAt = new Date();


    await nextToken.save()
    return nextToken

}


// Complete Token 


export const completeToken = async({tokenId,user})=>{

    const token =await QueueToken.findById(tokenId)

    if(!token){
        throw new Error('Token not found.')
    }

    if(token.status!==QUEUE_STATUS.SERVING){
        throw new Error("Only serving token can be completed")
    }

    token.status = QUEUE_STATUS.DONE
    token.completedAt=new Date()
    await token.save()
    return token
}


// Skip the Token 


export const skipToken = async({tokenId})=>{
    const token = await QueueToken.findById(tokenId)
    if(!token){
        throw new Error("Token not found.")
    }

    if(token.status!==QUEUE_STATUS.WAITING){
        throw new Error("Only waiting token can be skipped")
    }

    token.status = QUEUE_STATUS.SKIPPED;
    token.skippedAt = new Date();
    await token.save();

    return token;
}

// Get the Live Queue

export const getLiveQueue = async () => {

  return QueueToken.find({
    queueDate: today(),
    status: { $in: [QUEUE_STATUS.WAITING, QUEUE_STATUS.SERVING] }
  }).sort({ createdAt: 1 });
  
};


