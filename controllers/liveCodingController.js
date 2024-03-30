import LiveCoding from "../models/liveCoding.js"
import User from "../models/user.js";
export const createLiveCodingEvent = async (req, res) => {
    const {date,time,projectName, description, language} = req.body;
    console.log(req.body)
    try {
        if(!date || !projectName || !time || !description || !language){
            res.status(404).send({message: 'all fields are required'})
        }
       const LiveCodingEvent = await LiveCoding.create({
        date,
        time,
        projectName,
        description,
        language,
        active: false,
        user:req.user.id
       })

       res.status(200).send(LiveCodingEvent);

    } catch (error) {
        console.log(error);
    }
    // console.log(req.user);
}


export const getLiveCodingEvents = async (req, res) => {
    
    try {
        const liveCodingEvents = await LiveCoding.find({}).sort({ date: 1 }).populate('user')
    res.status(200).send(liveCodingEvents)
    // console.log(req.user);
    } catch (error) {
        res.status(404).send("no liveCodingEvents found")
    }
    
}


export const getLiveCodingEvent = async (req, res) => {
    try {
        const liveCodingEvent = await LiveCoding.findById(req.params.id).populate('user')
        res.status(200).send(liveCodingEvent)
    } catch (error) {
        res.status(500).send(error.message)
    }
    // console.log(req.user);
}



export const getLiveCodingEventsByOwner = async (req, res) => {
    const {id} = req.params
try {
    const liveCodingEvents = await LiveCoding.find({user: id}).sort({ date: -1 }).populate('user')
res.status(200).send(liveCodingEvents)
// console.log(req.user);
} catch (error) {
    res.status(404).send("no projects found for this user")
}

}


export const updateLiveCodingEvent = async (req, res) => {

    const {date, description, time, active, projectName} = req.body;
    
    try {
        // if(!name || !description || !image || !githubLink || !url ){
        //    return res.status(404).send({message: 'all fields are required'})
        // }
        const liveCoding = await LiveCoding.findById(req.params.id);

        if(!liveCoding) {
           return res.status(404).send({message: 'Not Found'});
        }
    
        const user = await User.findById(req.user.id);
        // check if user
        if(!user ){
           return res.status(401).send({message: 'user Not Found'});
        }
        // only the logged in user is allowed
        if(liveCoding.user.toString() !== user.id){
           return res.status(401).send({message: 'user not allowed'});
        }
    
        const updateLiveCoding = await LiveCoding.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.status(200).send(updateLiveCoding);
    } catch (error) {
        res.status(401).send(error.message);
    }
   
}

export const deleteLiveCodingEvent = async (req, res) => {
   try {
    const liveCoding = await LiveCoding.findById(req.params.id);

    if(!liveCoding) {
        res.status(404)
        throw new Error({message: 'Not Found'});
    }

    const user = await User.findById(req.user.id);
    // check if user
    if(!user ){
        res.status(401)
        throw new Error({message: 'user Not Found'});
    }
    // only the logged in user is allowed
    if(liveCoding.user .toString() !== user.id){
        res.status(401)
        throw new Error ({message: 'user not allowed'});
    }

    const deleteLiveCoding = await LiveCoding.findByIdAndDelete(req.params.id);
    res.send(deleteLiveCoding);
   } catch (error) {
    res.status(401).send(error.message);
   }
}