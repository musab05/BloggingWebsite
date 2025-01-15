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

async function searchPosts() {
  const searchQuery = document.getElementById("searchInput").value.trim();

  if (searchQuery === "") {
    alert("Please enter a search query.");
    return;
  }

  try {
    const response = await fetch(
      `/search?query=${encodeURIComponent(searchQuery)}`,
    );
    const posts = await response.json();
    const postsContainer = document.querySelector(".blogs-section");
    postsContainer.innerHTML = ""; // Clear previous search results

    if (posts.length === 0) {
      alert("No posts found matching the search query.");
      return;
    }

    posts.forEach((post) => {
      const postCard = document.createElement("div");
      postCard.className = "blog-card";
      postCard.innerHTML = `
            <h1 class="blog-title">${post.title}</h1>
            ${
              post.imagePath
                ? `<img src="${post.imagePath}" class="blog-image" alt="">`
                : '<img src="https://via.placeholder.com/800x400" alt="Dummy Blog Post Image" class="blog-image">'
            }                  
            <p class="blog-overview">${post.name}</p>
            <button class="btn dark" onclick="viewPost('${post._id}')">read</button>
          `;
      postsContainer.appendChild(postCard);
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    alert("An error occurred while searching posts.");
  }
}

// Function to view a post (similar to your existing logic)
function viewPost(postId) {
  window.location.href = `display.html?postId=${postId}`;
}

// Function to fetch and display all posts (similar to your existing logic)
async function fetchPosts() {
  // Your existing fetchPosts function
}

// Fetch and display all posts when the page loads
fetchPosts();

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
