const posts = document.querySelectorAll(".author_individual");
posts.forEach(post =>
	post.addEventListener("click", () => {
		const authorId = post.classList[0].replace("_individual_", "");
		window.location.href = `../pages/${authorId}.html`;
	})
);
