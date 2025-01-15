let otpver = false;

async function sendOTP() {
  event.preventDefault();
  const email = document.getElementById("signupEmail").value.trim();

  const response = await fetch("/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (response.ok) {
    const otpverify = document.querySelector(".otpverify");
    const otp_val = Math.floor(Math.random() * 1000000);
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
            show();
          } else {
            alert("Invalid OTP");
          }
        });
      }
    });
  } else {
    const errorMessage = await response.text();
    alert(errorMessage);
    return false;
  }
}

async function show() {
  const showdiv = document.querySelector(".show"); // Use querySelector for single element
  showdiv.style.display = "block";
}

async function resetpassword() {
  const password = document.getElementById("loginPassword").value.trim();
  const email = document.getElementById("signupEmail").value.trim();

  if (email === "" || password === "") {
    alert("Please fill in all fields for login.");
    return false;
  }

  const response = await fetch("/changepass", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    alert("Password changed successfully");
    window.location.href = "index.html";
    return true;
  } else {
    const errorMessage = await response.text();
    alert(errorMessage);
    return false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("loginPassword");
  const showPassIcon = document.querySelector(".showpass");
  const hidePassIcon = document.querySelector(".hidepass");

  showPassIcon.addEventListener("click", function () {
    passwordInput.setAttribute("type", "text");
    showPassIcon.style.display = "none";
    hidePassIcon.style.display = "block";
  });

  hidePassIcon.addEventListener("click", function () {
    passwordInput.setAttribute("type", "password");
    hidePassIcon.style.display = "none";
    showPassIcon.style.display = "block";
  });
});
