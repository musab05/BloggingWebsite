const mediaQuery = window.matchMedia("(max-width: 550px)");
const hamburgerclick = document.querySelector(".hamburger");
const cross = document.querySelector(".cross");
hamburgerclick.addEventListener("click", hamFunction);
cross.addEventListener("click", crossFunction);

function handleMediaQueryChange(event) {
  if (event.matches) {
    hamburgerclick.style.display = "inline-block";
  } else {
    hamburgerclick.style.display = "none";
  }
}

mediaQuery.addListener(handleMediaQueryChange);

handleMediaQueryChange(mediaQuery);

function hamFunction() {
  var hamnav = document.querySelector(".hamburgernav");
  hamnav.style.display = "inline-block";
  hamburgerclick.style.display = "none";
}

function crossFunction() {
  var hamnav = document.querySelector(".hamburgernav");
  hamnav.style.display = "none";
  if (mediaQuery.matches) {
    hamburgerclick.style.display = "inline-block";
  } else {
    hamburgerclick.style.display = "none";
  }
}

window.addEventListener("resize", function () {
  handleMediaQueryChange(mediaQuery);
});

// Fetch user data
async function fetchUserData() {
  try {
    const response = await fetch("/profile/userdata");
    const userData = await response.json();
    document.getElementById("userData").innerHTML +=
      `<div class="name">Name : ${userData.fullName}</div>
            <div class="name">Username : ${userData.username}</div>
          <div class="email">Email : ${userData.email}</div>`;
  } catch (error) {
    console.error("Error fetching user data:", error);
    alert("An error occurred while fetching user data.");
  }
}

// Fetch user posts
async function fetchUserPosts() {
  try {
    const response = await fetch("/profile/post");
    const posts = await response.json();
    const postsContainer = document.getElementById("userPosts");

    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className = "post-card";
      postElement.classList.add("post");
      postElement.innerHTML = `
                        <div class="post-title">${post.title}</div>
                        ${
                          post.imagePath
                            ? `<img src="${post.imagePath}" class="blog-image" alt="">`
                            : '<img src="./img/dummy.webp" alt="Dummy Blog Post Image" class="blog-image">'
                        }   
                        <button class="btn dark" onclick="viewPost('${
                          post._id
                        }')">read</button>
                        <button class="delete-btn" onclick="deletePost('${
                          post._id
                        }')">Delete</button>
                    `;
      // postsContainer.appendChild(postElement);
      $("#userPosts").append(postElement);
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    alert("An error occurred while fetching user posts.");
  }
}

async function viewPost(postId) {
  window.location.href = `display.html?postId=${postId}`;
}

// Delete post
async function deletePost(postId) {
  try {
    const response = await fetch(`/profile/post/${postId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      location.reload();
    } else {
      throw new Error("Failed to delete post");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("An error occurred while deleting the post.");
  }
}

// Load user data and posts when the page loads
window.onload = function () {
  fetchUserData();
  fetchUserPosts();
};

function checkLoginforEdit() {
  fetch("/login") // Change to appropriate route for checking login status
    .then((response) => {
      if (response.ok) {
        window.location.href = "/editor"; // Redirect to profile page if logged in
      } else {
        window.location.href = "/login"; // Redirect to login page if not logged in
      }
    })
    .catch((error) => console.error("Error checking login status:", error));
}

function checkLogin() {
  fetch("/login") // Change to appropriate route for checking login status
    .then((response) => {
      if (response.ok) {
        window.location.href = "/profile"; // Redirect to profile page if logged in
      } else {
        window.location.href = "/login"; // Redirect to login page if not logged in
      }
    })
    .catch((error) => console.error("Error checking login status:", error));
}
