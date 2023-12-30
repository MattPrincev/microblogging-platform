Matthew Princev 

Using your own server, follow the instructions below to be able to access the platform

Add the two tables (users and postings) found in schema.sql into the data base by copy and pasting them.
    DON'T USE THE INSERT INTO POSTINGS UNLESS NECESSARY FOR TESTING. They may mess with the logic of the server
    as I've implemented hashing, so the password'y won't correlate as they hashing is very specific and I store
    the hashed password in the table, not the regular password

Password hashing feature:
    I added password hashing so look out for that (using bcrypt)

Before trying to run the server make sure the following are installed:
npm install mysql-await
npm install express
npm install bcrypt
npm install express-session

Next run the server by going to the directory of the folder and running 'node server.js'

Next navigate to 'http://localhost:PORT/login' where you should be at the login page and go to the register account to register
     as the database should be empty. When making an account watch out for the minimum and maximum length of the username and password.
        Username must be at least 3 and at max 14, while the password must be at least 3 and at max 40

Website Features:

Login feature:
    This is where the user is able to log in if they have already created an account, otherwise there is a button that directs them 
to  register page

Register account feature:
    This is where new users can register an account, it will tell you if there was an error in making an account due to 
an email already being taken

Home page feature:
    This is where the timeline is where you can see everyone's posts'. It includes a post button and every post contains a
like button to like the post, an edit post if it's your post, and a delete post to delete the post if it's yours

    Post feature:
        This is where you can post to the timeline with a limited number count

    Timeline switch feature:
        This is where you can switch between the order of the timeline, either by most recent posts' or most liked posts'

    Post like feature:
        This is where if you click the like button, the like counter will go up. Has not limit for amount of time you can like 
            a post

    Post delete feature:
        This is where you can delete a post if it's yours by clicking the delete button

Profile feature:
    This is where you can see the details of your profile including: username, bio, and gender. Although, your bio and gender can only
        be seen by you :/

Edit profile feature:
    This is found in the profile page if you click the edit button. You can change your proile details here

Serotonin boost feature:
    This is if you need a boost of serotonin. Click the button and see what happens... 
    (find the super funny, awesome, cool, comical, amusing, humorous, hilarious secret image)

