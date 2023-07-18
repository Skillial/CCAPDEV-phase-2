function createPost(title, content, date) {
	let	main = document.createElement('main'),
		article = document.createElement('article'),
		tempdate = document.createElement('div'),
		spacer = document.createElement('div');
	
	main.textContent = title;
	article.textContent = content;
	tempdate.textContent = date;
	article.setAttribute('align', 'justify');
	tempdate.setAttribute('align', 'justify');
	spacer.className = 'space';
	
	return {'title': main, 'content': article, 'date':tempdate, 'spacer': spacer};
	
}

function createComment(content, date) {
	let	article = document.createElement('article'),
		tempdate = document.createElement('div'),
		spacer = document.createElement('div');

	article.textContent = content;
	tempdate.textContent = date;
	article.setAttribute('align', 'justify');
	tempdate.setAttribute('align', 'justify');
	spacer.className = 'space';
	
	return {'content': article, 'date':tempdate, 'spacer': spacer};
	
}