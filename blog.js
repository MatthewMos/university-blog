document.addEventListener("DOMContentLoaded", function () {
	document.querySelector(".post_1").addEventListener("click", function () {
		window.location.href = "blogPost1.html";
	});
});
document.addEventListener("DOMContentLoaded", function () {
	document
		.querySelector("#navBlog")
		.addEventListener("click", function (event) {
			event.preventDefault();
			window.location.href = "blog.html";
		});
});
document.addEventListener("DOMContentLoaded", function () {
	document
		.querySelector("#footerLinksBlog")
		.addEventListener("click", function (event) {
			event.preventDefault();
			window.location.href = "blog.html";
		});
});
