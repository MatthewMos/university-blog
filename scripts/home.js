// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQ1S3Fe6ottiPEhlJnJYzTbmiifXRdwIg",
  authDomain: "fir-plain-js.firebaseapp.com",
  projectId: "fir-plain-js",
  storageBucket: "fir-plain-js.appspot.com",
  messagingSenderId: "8060861628",
  appId: "1:8060861628:web:cf9483a71713b6de9ea4b9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();

const signUp = document.querySelector(".nav_a");

// Set the button content to empty initially
signUp.textContent = "";
signUp.style.padding = "16px 38px"; // Default padding

const createSignUpButton = () => {
  const img = document.querySelector(".nav_a > img");
  if (img) {
    img.remove();
  }
  signUp.textContent = "Sign Up | Log In";
  signUp.style.padding = "16px 38px";
};

const createLogOutButton = () => {
  const img = document.createElement("img");
  img.src = "../img/door_icon_246428.svg";
  signUp.textContent = "";
  signUp.append(img);
  signUp.style.padding = "16px 88px";
};

function open(e) {
  e.preventDefault();
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      createLogOutButton();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      // Handle errors here
    });
}

function close(e) {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      localStorage.removeItem("user");
      createSignUpButton();
    })
    .catch((error) => {
      // Handle errors here
    });
}

signUp.addEventListener("click", (e) => {
  if (signUp.textContent === "Sign Up | Log In") {
    open(e);
  } else {
    close(e);
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    createLogOutButton();
  } else {
    createSignUpButton();
  }
});
