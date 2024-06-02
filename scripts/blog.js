const posts = document.querySelectorAll(".post_item");
posts.forEach((post) =>
  post.addEventListener("click", () => {
    const postId = post.classList[0].replace("_", "");
    window.location.href = `../pages/${postId}.html`;
  })
);
