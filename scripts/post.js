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

const recommendationsPosts = document.querySelectorAll(
  ".recommendations__post"
);
const userComment = document.querySelector(".usercomment");
const publishBtn = document.querySelector("#publish");
const comments = document.querySelector(".comments");
const userName = document.querySelector(".user");
const userImage = document.querySelector(".commentbox__image");
const commentsAmount = document.querySelector("#comment");
const commentsText = document.querySelector(".comment__text");
const anonymous = "../img/anonymous.png";

let visibleComments = 5;
let totalComments;

recommendationsPosts.forEach((post) => {
  post.addEventListener("click", () => {
    const postId = post.classList[0];
    window.location.href = `../pages/${postId}.html`;
  });
});

userComment.addEventListener("input", () => {
  if (!userComment.value) {
    publishBtn.setAttribute("disabled", "disabled");
    publishBtn.classList.remove("active");
  } else {
    publishBtn.removeAttribute("disabled");
    publishBtn.classList.add("active");
  }
});

const showMoreBtn = document.getElementById("showMore");
const showLessBtn = document.getElementById("showLess");

const renderComments = () => {
  const allComments = document.querySelectorAll(".parents");
  allComments.forEach((comment, index) => {
    if (index < visibleComments) {
      comment.style.display = "flex";
    } else {
      comment.style.display = "none";
    }
  });

  if (visibleComments < totalComments) {
    showMoreBtn.style.display = "block";
    showLessBtn.style.display = "none";
  } else {
    showMoreBtn.style.display = "none";
    showLessBtn.style.display = "block";
  }
};

const showMoreComments = () => {
  visibleComments += 5;
  renderComments();
};

const showLessComments = () => {
  visibleComments = 5;
  renderComments();
};

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
  const q = query(collection(post, "comments"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  totalComments = querySnapshot.docs.length;
  querySnapshot.forEach((doc) => {
    const commentData = doc.data();
    renderComment(comments, commentData);
  });
  commentsAmount.innerText = querySnapshot.docs.length;
  rerenderCommentsText(commentsAmount, commentsText);
  renderComments();
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

  if (userData.name === "Anonymous") {
    userData.identity = false;
    userData.image = anonymous;
  } else {
    userData.identity = true;
  }

  const published = generateComment(userData);
  comments.insertAdjacentHTML("afterbegin", published);

  userComment.value = "";
  publishBtn.classList.remove("active");

  const postId = getPostId();
  commentsAmount.innerText = +commentsAmount.innerText + 1;
  await addCommentToFirestore(postId, userData);
  rerenderCommentsText(commentsAmount, commentsText);
  renderComments();
};

showMoreBtn.addEventListener("click", showMoreComments);
showLessBtn.addEventListener("click", showLessComments);

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
    userName.value = "Anonymous";
    userImage.src = anonymous;
    publishBtn.addEventListener("click", () => addComment(NULL_USER));
  }
});
