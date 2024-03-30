import Project from "../models/project.js";
import User from "../models/user.js";

export const createProject = async (req, res) => {
    const {name, description, image, githubLink, url,projectType} = req.body;
    console.log(req.body)
    try {
        if(!name || !description || !image || !githubLink || !url || !projectType){
            res.status(404).send({message: 'all fields are required'})
        }
       const project = await Project.create({
        name,
        description,
        image,
        githubLink,
        url,
        projectType,
        user:req.user.id
       })

       res.status(200).send(project);

    } catch (error) {
        console.log(error);
    }
    // console.log(req.user);
}

export const getProjects = async (req, res) => {
    
    try {
        const projects = await Project.find({}).sort({ createdAt: -1 }).populate('user')
    res.status(200).send(projects)
    // console.log(req.user);
    } catch (error) {
        res.status(404).send("no projects found for this user")
    }
    
}

export const getProjectsByOwner = async (req, res) => {
        const {id} = req.params
    try {
        const projects = await Project.find({user: id}).sort({ createdAt: -1 }).populate('user')
    res.status(200).send(projects)
    // console.log(req.user);
    } catch (error) {
        res.status(404).send("no projects found for this user")
    }
    
}

export const findProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
        res.status(200).send(project)
    } catch (error) {
        res.status(500).send(error.message)
    }
    // console.log(req.user);
}

export const updateProjectInteraction =async (req, res)=>{
    const {userId} = req.body;
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).send({ message: 'Project not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).send({ message: 'User not found' });
        }

        // Toggle like
        const likeIndex = project.likes.findIndex(like => like.userId.toString() === user.id);
        if (likeIndex === -1) {
            // User hasn't liked the project yet, add like
            project.likes.push({ userId: user.id }); // Add other like details as needed
        } else {
            // User has already liked the project, remove like
            project.likes.splice(likeIndex, 1);
        }

        await project.save();
        res.send(project);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
export const updateProject = async (req, res) => {

    const {name, description, image, githubLink, url} = req.body;
    
    try {
        // if(!name || !description || !image || !githubLink || !url ){
        //    return res.status(404).send({message: 'all fields are required'})
        // }
        const project = await Project.findById(req.params.id);

        if(!project) {
           return res.status(404).send({message: 'Not Found'});
        }
    
        const user = await User.findById(req.user.id);
        // check if user
        if(!user ){
           return res.status(401).send({message: 'user Not Found'});
        }
        // only the logged in user is allowed
        if(project.user.toString() !== user.id){
           return res.status(401).send({message: 'user not allowed'});
        }
    
        const updateproject = await Project.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.send(updateproject);
    } catch (error) {
        res.status(401).send(error.message);
    }
   
}

export const deleteProject = async (req, res) => {
   try {
    const project = await Project.findById(req.params.id);

    if(!project) {
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
    if(project.user .toString() !== user.id){
        res.status(401)
        throw new Error ({message: 'user not allowed'});
    }

    const deleteProject = await Project.findByIdAndDelete(req.params.id);
    res.send(deleteProject);
   } catch (error) {
    res.status(401).send(error.message);
   }
}