const db = require('../config/dentlDBS')


exports.getUsers = async ()=> {
    const result = await db.query("SELECT * FROM users");
    return result.rows;
}

exports.getUserById = async (id)=> {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id])
    return result.rows[0]
}

exports.addUser = async (username, password_hash, full_name, role, phone)=> {
    await db.query(
        "INSERT INTO users(username, password_hash, full_name, role, phone) VALUES($1, $2, $3, $4, $5)",
        [username, password_hash, full_name, role, phone]
    )
}

exports.updateUser = async (id, username, password_hash, full_name, role, phone)=> {
    await db.query(
        "UPDATE users SET username = $2, password_hash = $3, full_name = $4, role = $5, phone = $6 WHERE id = $1",
        [id, username, password_hash, full_name, role, phone]
    )
}

exports.deleteUsers = async (id)=> {
    const result = await db.query("DELETE FROM users WHERE id = $1", [id])
}

exports.login = async(username)=> {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username])

    return result.rows[0];
}