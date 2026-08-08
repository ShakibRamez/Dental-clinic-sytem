const userModel = require("../model/userModel")
exports.getUsers = async(req, res)=> {
    const users = await userModel.getUsers();
    res.json(users);
}

exports.getUserById = async(req, res)=> {
    const id = req.body;
    const user = await userModel.getUserById(id)
    res.json(user)
}

exports.addUsers = async(req, res)=> {
    const {username, password_hash, full_name, role, phone} = req.body;
    
    await userModel.addUser(username, password_hash, full_name, role, phone);
    
    res.json({
        message: "User Added"
    })
}

exports.updateUsers = async(req, res)=> {
    const {id, username, password_hash, full_name, role, phone} = req.body;
    
    await userModel.updateUser(id, username, password_hash, full_name, role, phone);
    
    res.json({
        message: "User Updated"
    })
}

exports.deleteUsers = async(req, res)=> {
    const id = req.params.id;
    
    await userModel.deleteUsers(id)
    res.json({
        message: "User Deleted"
    })
}

exports.login = async(req, res)=> {
    try{
        const {username, password} = req.body;
                
        const user = await userModel.login(username);

        if(!user) {
            return res.status(401).json({
                status: false,
                message: "User not found"
            });
        }

        if(user.password_hash !== password) {
            return res.status(401).json({
                status: false,
                message: "Invalid username or password"
            });
        }

        res.json({
            status: true,
            message: "Login successful",
            user: user
        });
        
    }catch(err){
        res.status(500).json({
            status: false,
            message: "Database Error"
        })
    }
}
