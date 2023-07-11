function createPost(title, content) {
	let	main = document.createElement('main'),
		article = document.createElement('article'),
		spacer = document.createElement('div');
	
	main.textContent = title;
	article.textContent = content;
	article.setAttribute('align', 'justify');
	spacer.className = 'space';
	
	return {'title': main, 'content': article, 'spacer': spacer};
	
}