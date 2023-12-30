// data for server operations
const mysql = require("mysql-await"); //preffered. change name to mysql
const bcrypt = require('bcrypt')

async function addUser(username, email, password){
    const add_user = await connPool.awaitQuery("INSERT INTO users (username, email, pass, created_date) VALUE ( ?, ?, ?, CURRENT_TIMESTAMP);", [username, email , password]);
    console.log(add_user)
    console.log("User added to the database sucessfully!")
    return
}

// KEEP FOR DELETING PROFILE???
// async function deleteCurrentID(current_id){
//     const delete_current = await connPool.awaitQuery("DROP TABLE currentUser?;", [current_id])
//     console.log(delete_current)
//     return
// }

async function userCheck(user_email) {
    const user = await connPool.awaitQuery("SELECT * from users WHERE email=?;", [user_email])
    console.log(user.length);
    if(user.length == 1){
        console.log("User already in database!")
        return 1
    }
    else if(user.length < 1){
        console.log("User not in database!")
        console.log(user.length)
        return 0
    }
    else {
        // console.log("How is there more than one of the same user in the database!?!?!")
        return 999
    }
}

async function usernameCheck(username) {
    const username_status = await connPool.awaitQuery("SELECT * from users WHERE username=?;", [username])
    console.log("userna,e status here:")
    console.log(username_status)
    if(username_status.length == 0){
        console.log("Username not in database!")
        return true
    }
    else{
        console.log("Username already in database!")
        return false
    }
}

async function getUser(email) {
    const user = await connPool.awaitQuery("SELECT * FROM users WHERE email=?;", [email])
    return user
}

// const hpass = await bcrypt.hash('pass', 7)
// const hashedword = await bcrypt.compare('pass', password)

async function login(email, password) {
     // const hashedword = await bcrypt.compare(req.body.pass, hpass)
    const login_status = await connPool.awaitQuery("SELECT * FROM users WHERE email=?;", [email])
    if(login_status.length == 1){
        console.log(login_status[0].pass)
        console.log(password)
        const hashedword = await bcrypt.compare(password,login_status[0].pass)
        console.log(hashedword)
        if(hashedword){
            return true
        }
        return false
    }
    else{
        return false
    }
}

async function addPost(user_id, username, post){    
    var post_added = await connPool.awaitQuery("INSERT INTO postings (user_id, username, post, likes, post_date) VALUE (?, ? , ?, 0, CURRENT_TIMESTAMP);", [user_id, username, post]);
    if(post_added.affectedRows == 1){
        console.log("Post added to the database successfully!")
        return true
    }
    else{
        console.log("Oops! There was an error adding the post to the database!")
        return false
    }
}

async function deletePost(post_id){    
    var post_deleted = await connPool.awaitQuery("DELETE from postings where post_id=?;", [post_id]);
    if(post_deleted.affectedRows == 1){
        console.log("Post delete succesfully!")
        return true
    }
    else{
        console.log("Error in deleting post")
        return false
    }


}

async function getPostLength(){
    var posts = await connPool.awaitQuery("SELECT * FROM postings");
    return posts.length
}

async function getTimeline(page, order){
    // SELECT * FROM postings ORDER BY post_date DESC LIMIT 10 OFFSET 10;
    // SELECT * FROM postings ORDER BY post_date DESC;
    var timeline;
    var offset = (page-1) * 10
    if(order){
        timeline = await connPool.awaitQuery("SELECT * FROM postings ORDER BY post_date DESC LIMIT 10 OFFSET ?;", [offset]);
        console.log("recent")
    }
    else{
        timeline = await connPool.awaitQuery("SELECT * FROM postings ORDER BY likes DESC LIMIT 10 OFFSET ?;", [offset]);
        console.log("likes")
    }
    return timeline
}

async function like_post(post_id){
    var liked_post = await connPool.awaitQuery("UPDATE postings SET likes = likes + 1 WHERE post_id=?;", [post_id]);
    if(liked_post.affectedRows == 1){
        console.log("Post liked successfully!")
        return true
    }
    else{
        console.log("Oops! There was an error liking the post!")
        return false
    }
}

async function edit_post(post_id, post_data){
    var edited_post = await connPool.awaitQuery("UPDATE postings SET post = ? WHERE post_id=?;", [post_data ,post_id]);
    console.log(edited_post)
    return
}

async function get_post(post_id){
    const get_post = await connPool.awaitQuery("SELECT * FROM  postings WHERE post_id=?;", [post_id]);
    if(get_post.length == 1){
        console.log("Post found successfully!")
        return true
    }
    else{
        console.log("Couldn't find post")
        return false
    }
}

async function profile_change(username, bio, gender, email) {
    console.log("inside p change")
    const profile_status = await connPool.awaitQuery("UPDATE users SET username=?, bio=?, gender=? WHERE email=?;", [username, bio, gender, email]);
    if(profile_status.affectedRows == 1){
        console.log("Profile changed successfully!")
        return true
    }
    else{
        console.log("Error in changing profile!")
        return false
    }
}

async function repost(new_post, post_id) {
    const repost = await connPool.awaitQuery("UPDATE postings SET post=? WHERE post_id=?;", [new_post, post_id]);
    if(repost.affectedRows == 1){
        console.log("Repost was successful!")
        return true
    }
    else{
        console.log("Repost failed")
        return false
    }
}


module.exports = {addUser, userCheck, usernameCheck, getUser, login, addPost, deletePost, getPostLength, getTimeline, like_post, edit_post, get_post, profile_change, repost}