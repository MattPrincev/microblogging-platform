async function change_order(order) { 
  const posts = await fetch("/change_timeline", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ timeline_order : order }) } );
  location.reload()
}

async function by_likes() { 
  const posts = await fetch("/likes", { method: "GET"});
}

async function delete_post(post_id) { 
  const posts = await fetch("/delete_post", { method: "DELETE", headers: { "Content-Type": "application/json", }, body: JSON.stringify({ postID: post_id })});
}

async function edit_post(post_id) { 
  const element = "post-data"+ post_id
  const post_data = document.getElementById(element).innerText
  const posts = await fetch("/edit_post", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify({ postID: post_id, post : post_data })});
}

async function page_number(page_number) {
  const page = await fetch("/set_page", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify({ page : page_number })});
  location.reload()
}

async function like_post(post_id) {
  var post = document.getElementById("like-btn"+post_id).innerHTML
  document.getElementById("like-btn"+post_id).textContent = parseInt(post, 10) + 1
  const posts = await fetch("/like", { method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify({ postID: post_id}), });
}

async function generate_funny() {
  var random_number = Math.floor(Math.random() * (21 - 0 +1)) + 0
  console.log(random_number)
  const funnies = {
    0 : '/images/doggo/IMG_0252.jpg',
    1 : '/images/doggo/IMG_0253.jpg',
    2 : '/images/doggo/IMG_0254.jpg',
    3 : '/images/doggo/IMG_0255.jpg',
    4 : '/images/doggo/IMG_0256.jpg',
    5 : '/images/doggo/IMG_0258.jpg',
    6 : '/images/doggo/IMG_0259.jpg',
    7 : '/images/doggo/IMG_0260.jpg',
    8 : '/images/doggo/IMG_0262.jpg',
    9 : '/images/doggo/IMG_0263.jpg',
    10 : '/images/doggo/IMG_0264.jpg',
    11 : '/images/doggo/IMG_0265.jpg',
    12 : '/images/doggo/IMG_0266.jpg',
    13 : '/images/doggo/IMG_0267.jpg',
    14 : '/images/doggo/IMG_0268.jpg',
    15 : '/images/doggo/IMG_0269.jpg',
    16 : '/images/doggo/IMG_0270.jpg',
    17 : '/images/doggo/IMG_0271.jpg',
    18 : '/images/doggo/IMG_0272.jpg',
    19 : '/images/doggo/IMG_0273.jpg',
    20 : '/images/doggo/IMG_0274.jpg',
    21 : '/images/doggo/catto.jpg',
  };
  var random_pic = funnies[random_number]
  document.getElementById("funny-pic").src=random_pic;
}