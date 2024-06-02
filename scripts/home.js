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
	apiKey: "AIzaSyBqEITIHtmooTGZzseEZTCqFPmFc14I6WQ",
	authDomain: "project-psu-b795e.firebaseapp.com",
	projectId: "project-psu-b795e",
	storageBucket: "project-psu-b795e.appspot.com",
	messagingSenderId: "973567118314",
	appId: "1:973567118314:web:f64903e57ceeecab8e0093",
	measurementId: "G-PFH0KPJDVE",
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
		.then(result => {
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			const user = result.user;
			localStorage.setItem("user", JSON.stringify(user));
			createLogOutButton();
		})
		.catch(error => {
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
		.catch(error => {
			// Handle errors here
		});
}

signUp.addEventListener("click", e => {
	if (signUp.textContent === "Sign Up | Log In") {
		open(e);
	} else {
		close(e);
	}
});

onAuthStateChanged(auth, user => {
	if (user) {
		createLogOutButton();
	} else {
		createSignUpButton();
	}
});
