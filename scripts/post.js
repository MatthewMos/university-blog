import { postsData } from "../constants/postsData.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  query,
  orderBy,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  NULL_USER,
  createPost,
  generateComment,
  getPostId,
  renderComment,
  rerenderCommentsText,
  shuffleArray,
} from "./utils.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

const postsSection = document.querySelector(".recommendations__posts");

const shuffledPostsData = shuffleArray(postsData);

shuffledPostsData.forEach((postData) => {
  const post = createPost(postData);
  postsSection.innerHTML += post;
});

const userComment = document.querySelector(".usercomment");
const publishBtn = document.querySelector("#publish");
const comments = document.querySelector(".comments");
const userName = document.querySelector(".user");
const userImage = document.querySelector(".commentbox__image");
const commentsAmount = document.querySelector("#comment");
const commentsText = document.querySelector(".comment__text");

userComment.addEventListener("input", () => {
  if (!userComment.value) {
    publishBtn.setAttribute("disabled", "disabled");
    publishBtn.classList.remove("active");
  } else {
    publishBtn.removeAttribute("disabled");
    publishBtn.classList.add("active");
  }
});

const addCommentToFirestore = async (postId, commentData) => {
  const postsRef = collection(db, "posts");
  const post = doc(postsRef, postId);
  const commentsRef = collection(post, "comments");
  try {
    await addDoc(commentsRef, commentData);
  } catch (e) {
    console.log(e);
  }
};

const loadCommentsFromFirestore = async (postId) => {
  const postsRef = collection(db, "posts");
  const post = doc(postsRef, postId);
  const q = query(collection(post, "comments"), orderBy("date", "asc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const commentData = doc.data();
    renderComment(comments, commentData);
  });
  commentsAmount.innerText = querySnapshot.docs.length;
  rerenderCommentsText(commentsAmount, commentsText);
};

window.onload = () => {
  const postId = getPostId();
  loadCommentsFromFirestore(postId);
};

const addComment = async (userData) => {
  if (!userComment.value) return;

  userData.name = userName.value;
  userData.message = userComment.value;
  userData.date = new Date().toLocaleString();

  if (userData.name === "Анонимус") {
    userData.identity = false;
    userData.image = "../img/anonymous.png";
  } else {
    userData.identity = true;
  }

  const published = generateComment(userData);
  comments.innerHTML += published;

  userComment.value = "";
  publishBtn.classList.remove("active");

  const postId = getPostId();
  commentsAmount.innerText = +commentsAmount.innerText + 1;
  await addCommentToFirestore(postId, userData);
  rerenderCommentsText(commentsAmount, commentsText);
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userData = {
      name: user.displayName,
      identity: null,
      image: user.photoURL,
      message: null,
      date: null,
    };
    userName.value = userData.name;
    userImage.src = userData.image;
    publishBtn.addEventListener("click", () => addComment(userData));
  } else {
    publishBtn.addEventListener("click", () => addComment(NULL_USER));
  }
});
