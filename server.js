const data = require("./data.js")
const express = require('express')  //loads express library (require is most important function for javascript modules)
const app = express() //create express object (by convention assign to "app") [the express object is a complete web server and we can just configure it]
const port = 4131 //just a var, nothing special

// make sure all have req.session checks
// profile button
// post form

const bcrypt = require('bcrypt')
var session = require('express-session')
app.use(express.static('resources'))
app.set("views", "resources/templates");
app.set("view engine", "pug")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({ secret: 'keyboard cat'}))

// start of GET requests

// app.get("/test", async (req, res) =>{
//     res.status(200)
//     res.render("success_register.pug")
// })

app.get("/", async (req, res) => {
    if(req.session.userID && req.session.page){
        console.log("page number")
        console.log(req.session.page)
        var posts = await data.getTimeline(req.session.page, req.session.timeline);
        var page_length = await data.getPostLength()
        res.status(200)
        res.render("home.pug", { title: "posts", post_list : posts, pages : Math.floor((page_length + 10)/10),  current_userID : req.session.userID, current_page: req.session.page})
    }
    else{
        res.status(404)
        res.render("404.pug")
    }
})

app.get("/profile", (req, res) => {
    if(req.session.username){
        res.status(200)
        res.render("profile.pug", {username : req.session.username, bio : req.session.bio, gender : req.session.gender})
    }
    res.status(404)
    res.render("404.pug")
})

app.get("/logout", (req, res) => {
    if (req.session.username) {
        req.session.destroy((err) => {
            if (err){
                throw err;
            }
            else{
                res.redirect('/login')
            }
        })
    }
    else{
        res.redirect('/login')
    }
})

app.get("/post", (req, res) => {
    if(req.session.username){
        res.status(200)
        res.render("post.pug")
    }
    else{
        res.status(404)
        res.render("404.pug")
    }
})

app.get("/edit-profile", (req, res) => {
    if(req.session.username){
        res.status(200)
        res.render("edit_profile.pug", {username : req.session.username, bio : req.session.bio, gender: req.session.gender})
    }
    else{
        res.status(404)
        res.render("404.pug")
    }
})

app.get("/login", (req, res) => {
    res.status(200)
    res.render("login.pug")
})

app.get("/register", (req, res) => {
    res.status(200)
    res.render("register")
})

app.get("/edit_post", (req, res) => {
    if(req.session.username){
        res.status(200)
        res.render("edit_post.pug", {post : req.session.repost_data, repostID : req.session.repostID})
    }
    else{
        res.status(404)
        res.render("404.pug")
    }
})

app.get("/surprise", (req, res) =>{
    if(req.session.username){
        res.status(200)
        res.render("serotonin.pug")
    }
    else{
        res.status(404)
        res.render("404.pug")
    }
})


// start of POST requests

app.post("/post", async (req, res) => {
    if(req.session.username && req.body.post){
        req.session.post = req.body.post
        const post_status = data.addPost(req.session.userID, req.session.username, req.session.post)
        if(post_status){
            res.status(200)
            res.render("success_form.pug")
        }
        else{
            res.status(400)
            res.render("fail_form.pug")
        }
    }
    else{
        res.status(404)
        res.render("404.pug")
    }

    // Why does it send at 0 but not 1-4
})

app.post("/repost", async (req, res) => {
    const repost_status = await data.repost(req.body.post, req.body.repostID)
    if(repost_status && req.session.username){
        res.status(200)
        res.render("repost.pug")
    }
    else{
        res.status(404)
        res.render("fail_form.pug")
    }

    // if(req.session.repostID){
    //     const repost_status = data.repost(req)
    //     if(post_status){
    //         res.status(200)
    //         res.render("success_form.pug")
    //     }
    //     else{
    //         res.status(400)
    //         res.render("fail_form.pug")
    //     }
    // }
    // else{
    //     res.status(404)
    //     res.render("404.pug")
    // }
})

app.post("/like", async (req, res) => {
    const like_status = await data.like_post(req.body.postID)
    if(like_status && req.session.username){
        res.status(200)
        res.send(JSON.stringify({ status : true }))
    }
    else{
        console.log("Error in liking the post :(")
        res.status(400)
        res.send(JSON.stringify({ status : false }))
    }
})

app.post("/register", async (req, res) => {
    const user_status = await data.userCheck(req.body.email)
    if(user_status == 1){
        console.log("Already in the database?!?!?!")
        res.status(400)
        res.render("register_again.pug")
    }
    if(user_status == 999){
        console.log("More than one of the same user in the database?!?!?!")
        res.status(400)
        res.render("register_again.pug")
    }
    if(user_status == 0 && req.body.pass == req.body.repeat){
        console.log("Not in the database")
        const hpass = await bcrypt.hash(req.body.pass, 7)
        const user_status = await data.addUser(req.body.user, req.body.email, hpass)
        res.status(200)
        res.render("success_register.pug")
    }
    else{
        console.log("different password")
        res.status(400)
        res.render("register_again.pug")
    }
})

app.post("/login", async (req, res) => {
    console.log("In login")
    const login_status = await data.login(req.body.email, req.body.pass)
    console.log(login_status)
    if(login_status){
        const user_info = await data.getUser(req.body.email)
        user = user_info[0]
        req.session.userID = user.user_id
        req.session.username = user.username
        req.session.email = user.email
        req.session.password = user.pass
        req.session.bio = user.bio
        req.session.gender = user.gender
        req.session.page = 1
        req.session.timeline = true
        res.status(200)
        res.render("welcome.pug")
    }
    else{
        res.status(400)
        res.render("login_fail.pug")
    }
})

app.post("/edit_post", async (req, res) => {
    const post_status = data.get_post(req.body.postID)
    if(req.session.username && post_status){
        req.session.repostID =req.body.postID
        req.session.repost_data = req.body.post
        res.status(200)
        res.render("edit_post.pug")
    }
    else{
        res.status(404)
        res.render("404.pug")
    }
})

app.post("/set_page", async (req, res) => {
    if(req.session.page){
        req.session.page = req.body.page
        console.log("set page to :")
        console.log(req.session.page)
        res.status(200)
        res.send(JSON.stringify({ status : true }))
    }
    else{
        console.log("Error in setting page number")
        res.status(400)
        res.send(JSON.stringify({ status : false }))
    }
})

app.post("/change_timeline", async (req, res) => {
    if(req.session.username){
        if(req.body.timeline_order){
            req.session.timeline = true
            res.status(200)
            res.send(JSON.stringify({ status : true }))
        }
        else{
            req.session.timeline = false
            res.status(200)
            res.send(JSON.stringify({ status : true }))
        }
    }
    else{
        res.status(400)
        res.send(JSON.stringify({ status : false }))
    }
})

app.post("/edit_profile", async (req, res) => {
    if(req.session.email){
        const username_status = await data.usernameCheck(req.body.username)
        if(!username_status){
            res.status(400)
            res.render("username_taken.pug")
        }
        if(req.body.username != '' && req.session.username){
            req.session.username = req.body.username
        }
        if(req.body.bio != '' && req.session.username){
            req.session.bio = req.body.bio
        }
        if(req.body.gender != '' && req.session.username){
            req.session.gender = req.body.gender
        }
        const profile_change = await data.profile_change(req.session.username, req.session.bio, req.session.gender, req.session.email)
        if(profile_change){
            res.status(200)
            res.render("change_profile_success.pug")
        }
        else{
            res.status(400)
            res.render("fail_form.pug")
        }
    }
    else{
        res.status(400)
        res.render("fail_form.pug")
    }


})

// start of DELETE requests

app.delete("/delete_post", async (req, res) => {
    const deleting_post = req.body.postID
    if(req.session.userID && deleting_post){
        const delete_status = data.deletePost(deleting_post)
        if(delete_status){
            res.status(200)
            res.send(JSON.stringify({ deleted_postID : req.body.postID }))
        }
        else{

            res.status(404)
            res.send(JSON.stringify({ delete_post : false }))
        }
    }
    else{
        res.status(404)
        res.send(JSON.stringify({ access : false }))
    }
})


// start of the end...

app.use((req, res) => {
    res.status(404);
    res.send('<h1>Error 404: Resource not found</h1>')
  })

app.listen (port, () => {       //configured server, so use call back function to call it
    console.log(`Example app listening on port ${port}`) //BACK TICK `` not reqular " " (backtick's are multi-line)
})


// rename all var's with same ame is (fn, command, and F2)








