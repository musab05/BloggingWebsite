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

function checkLoginforEdit() {
  fetch("/login") 
    .then((response) => {
      if (response.ok) {
        window.location.href = "/editor"; 
      } else {
        window.location.href = "/login"; 
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

async function fetchPosts() {
  try {
    const response = await fetch("/posts");
    const posts = await response.json();
    const postsContainer = document.querySelector(".blogs-section");

    posts.forEach((post) => {
      const postCard = document.createElement("div");
      postCard.className = "blog-card";

      // Convert createdAt to a formatted date string
      const createdAt = new Date(post.createdAt).toLocaleDateString();

      postCard.innerHTML = `
                <h1 class="blog-title">${post.title}</h1>
                ${
                  post.imagePath
                    ? `<img src="${post.imagePath}" class="blog-image" alt="">`
                    : '<img src="./img/dummy.webp" alt="Dummy Blog Post Image" class="blog-image">'
                }                  
                <p class="blog-overview">Created by : ${post.name}</p>
                <p class="blog-overview">Created at : ${createdAt}</p> <!-- Display the creation date -->
                <button class="btn dark" onclick="viewPost('${post._id}')">read</button>
            `;
      postsContainer.appendChild(postCard);
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    alert("An error occurred while fetching posts.");
  }
}

async function viewPost(postId) {
  window.location.href = `display.html?postId=${postId}`;
}

fetchPosts();
