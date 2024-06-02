export const createPost = (postData) => {
  const post = `
	<div class="${postData.postId} recommendations__post">
		<img
			src="${postData.src}"
			alt=""
		/>
		<p class="recommendations__post_info">
			От <span class="recommendations__post_author">${postData.author}</span> |
			<span class="recommendations__post_date">${postData.date}</span>
		</p>
		<h4 class="recommendations__post_title">
		${postData.title}
		</h4>
		<p class="recommendations__post_text">
		${postData.text}
		</p>
	</div>
	`;
  return post;
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const rerenderCommentsText = (commentsAmount, commentsText) => {
  if (
    commentsAmount.innerText[commentsAmount.innerText.length - 1] === 1 &&
    commentsAmount.innerText !== 11
  ) {
    commentsText.innerText = "комментарий";
  } else if (
    commentsAmount.innerText[commentsAmount.innerText.length - 1] >= 2 &&
    commentsAmount.innerText[commentsAmount.innerText.length - 1] <= 4 &&
    (commentsAmount.innerText < 12 || commentsAmount.innerText > 14)
  ) {
    commentsText.innerText = "комментария";
  } else {
    commentsText.innerText = "комментариев";
  }
};

export const renderComment = (comments, commentData) => {
  const commentHTML = `
    <div class="parents">
      <img src="${commentData.image}">
      <div>
        <h1>${commentData.name}</h1>
        <p>${commentData.message}</p>
        <span class="date">${commentData.date}</span>
      </div>    
    </div>`;
  comments.innerHTML += commentHTML;
};

export const getPostId = () =>
  window.location.href.split("/").pop().split(".")[0];

export const generateComment = (userData) => {
  return `<div class="parents">
    <img src="${userData.image}">
    <div>
      <h1>${userData.name}</h1>
      <p>${userData.message}</p>
      <span class="date">${userData.date}</span>
    </div>    
  </div>`;
};

export const NULL_USER = {
  name: null,
  identity: null,
  image: null,
  message: null,
  date: null,
};
