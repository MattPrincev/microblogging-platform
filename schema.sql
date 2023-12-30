-- schema
-- creates table for the posts
create table postings (
	post_id int not null auto_increment,
	user_id int not null,
	username VARCHAR(14),
	post VARCHAR(255),
	likes int,
    post_date DATETIME,
	primary key(post_id)
);
-- insert this into post table, but be aware that the user_id might not exist so other functions might not work
INSERT INTO postings (user_id, username, post, likes, post_date) VALUE (999, "username" ,"post", 0, CURRENT_TIMESTAMP);


-- creates table for the users
create table users (
	user_id int not null auto_increment,
	username VARCHAR(14) not null,
	email VARCHAR(255) not null,
	pass VARCHAR(70) not null,
    created_date DATE,
	bio VARCHAR(110),
	gender VARCHAR(20),
	primary key(user_id)
);

-- insert this into user table, but be aware it may disrupt how things work because some of the values may overlap
INSERT INTO users (username, email, pass, created_date, bio, gender) VALUE ("icekween", "iceking@email.com" ,"a", CURRENT_TIMESTAMP, 'this is  my bio', 'he/him');