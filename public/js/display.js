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

// Parse query parameters to extract post ID
async function fetchPostData() {
  try {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const postId = urlParams.get("postId");

    // Fetch post data based on the postId
    const response = await fetch(`/display/${postId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch post data');
    }
    const post = await response.json();

    // Display post details
    document.getElementById("post-title").textContent = post.title;
    document.getElementById("post-image").src = post.imagePath || "./img/dummy.webp";
    document.getElementById("post-content").innerHTML = post.content;
  } catch (error) {
    console.error("Error fetching post:", error);
    alert("An error occurred while fetching the post.");
  }
}

// Call the async function
fetchPostData();

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