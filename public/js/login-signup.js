let otpver = false;

async function validateLoginForm() {
  event.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (username === "" || password === "") {
    alert("Please fill in all fields for login.");
    return false;
  }

  // Call backend API to login
  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    window.location.href = "profile.html";
    return true;
  } else {
    const errorMessage = await response.text(); // Parse response as text
    alert(errorMessage);
    return false;
  }
}

async function validateSignupForm() {
  event.preventDefault();
  const fullName = document.getElementById("fullName").value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (
    fullName === "" ||
    phoneNumber === "" ||
    username === "" ||
    email === "" ||
    password === "" ||
    otpver == false
  ) {
    alert("Please fill in all fields for signup.");
    return false;
  }

  const response = await fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fullName, phoneNumber, username, email, password }),
  });

  if (response.ok) {
    window.location.href = "profile.html";
    return confirm("Are you sure you want to signup?");
  } else {
    const errorMessage = await response.text(); // Parse response as text
    alert(errorMessage);
    return false;
  }
}

function sendOTP() {
  const otpverify = document.querySelector(".otpverify");
  const otp_val = Math.floor(Math.random() * 1000000);
  const email = document.getElementById("signupEmail").value.trim();
  const emailBody = `<h2>Your OTP is ${otp_val}</h2>`;
  Email.send({
    SecureToken: "c516e36f-73fc-45dc-a9bb-7cced2be297d",
    To: email,
    From: "blogvistaorg@gmail.com",
    Subject: "OTP Verification",
    Body: emailBody,
  }).then((message) => {
    if (message === "OK") {
      alert("OTP sent to your email " + email);
      otpverify.style.display = "flex";
      const otp_inp = document.getElementById("otp_inp");
      const otp_btn = document.getElementById("otp-btn");
      otp_btn.addEventListener("click", () => {
        if (otp_inp.value == otp_val) {
          otpver = true;
          alert("Email address verified...");
        } else {
          alert("Invalid OTP");
        }
      });
    }
  });
}

function resetpassword() {
  window.location.href = "forgotpassword.html";
}

document.addEventListener("DOMContentLoaded", function () {
  // Login Form
  const loginPasswordInput = document.getElementById("loginPassword");
  const showLoginPassIcon = document.querySelector("#loginForm .showpass");
  const hideLoginPassIcon = document.querySelector("#loginForm .hidepass");

  showLoginPassIcon.addEventListener("click", function () {
    console.log("show");
    loginPasswordInput.setAttribute("type", "text");
    showLoginPassIcon.style.display = "none";
    hideLoginPassIcon.style.display = "block";
  });

  hideLoginPassIcon.addEventListener("click", function () {
    loginPasswordInput.setAttribute("type", "password");
    hideLoginPassIcon.style.display = "none";
    showLoginPassIcon.style.display = "block";
  });

  // Signup Form
  const signupPasswordInput = document.getElementById("signupPassword");
  const showSignupPassIcon = document.querySelector("#signupForm .showpass");
  const hideSignupPassIcon = document.querySelector("#signupForm .hidepass");

  showSignupPassIcon.addEventListener("click", function () {
    signupPasswordInput.setAttribute("type", "text");
    showSignupPassIcon.style.display = "none";
    hideSignupPassIcon.style.display = "block";
  });

  hideSignupPassIcon.addEventListener("click", function () {
    signupPasswordInput.setAttribute("type", "password");
    hideSignupPassIcon.style.display = "none";
    showSignupPassIcon.style.display = "block";
  });
});
