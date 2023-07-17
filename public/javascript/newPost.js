const writePostButton = document.getElementById("newPostWrite");
const postFormContainer = document.getElementById("newPostFormContainer");
const postForm = document.getElementById("postForm");
const cancelButton = document.getElementById("cancelButton");
const yCancelButton = document.getElementById("yCancelButton");
const nCancelButton = document.getElementById("nCancelButton");
var maxCalls = 15;
var callCount=0;

writePostButton.addEventListener("click", () => {
   postFormContainer.style.display = "block";
});



cancelButton.addEventListener("click", () => { 
  yCancelButton.style.display = "block";
  nCancelButton.style.display = "block";
});

yCancelButton.addEventListener("click", () => {
    postForm.reset();
    yCancelButton.style.display = "none";
    nCancelButton.style.display = "none";
    postFormContainer.style.display = "none";
});

nCancelButton.addEventListener("click", () => {
  yCancelButton.style.display = "none";
  nCancelButton.style.display = "none";
});

  
function createPost(title, desc, author, rating, media, profile, link,pid) {
	let post = document.createElement('div'),
	content_div = document.createElement('div'),
	post_title = document.createElement('div'),
	post_author = document.createElement('span'),
	post_description = document.createElement('div'),
	post_media = document.createElement('span'),
  post_title_name = document.createElement('span');

  post_author.className='content_author';
	post.className = 'forum';
	content_div.className = 'content';
	post_title_name.className = 'content_title';
  post_title_name.onclick = function() {
    window.location.href = link;
  };
	post_description.className = 'content_desc';
	post_title_name.textContent = title;
  post_title.appendChild(post_title_name);
	post_author.innerHTML = " &bull; " + author;
  post_author.onclick = function() {
    window.location.href = profile;
  };
	post_title.appendChild(post_author);
	post_description.textContent = desc;
	post_description.setAttribute('align', 'justify');
	// if (media.localeCompare(' ') !== 0) {
	// 	post_description.appendChild(document.createElement('br'));
	// 	post_media.textContent = '(' + media + ')';
	// 	post_description.appendChild(post_media);
	// }

	content_div.appendChild(post_title);
	content_div.appendChild(post_description);

	post.appendChild(createReaction(rating,0,pid));
	post.appendChild(content_div);
  callCount++;
	return post;
}

  
  // postForm.addEventListener('submit', (event) => {
  //   event.preventDefault(); 
  
  //   const title = document.getElementById('postTitle').value;
  //   const content = document.getElementById('postContent').value;
  //   //const author = document.getElementById('author').value;
  //   //let media = document.getElementById('media').value;
  //   const rating = 0; // Default rating value (starting at 0)
    
  //   let media = '';
  //   if(media === ''){
  //       media = ' ';
  //   }
  //   const newPost = createPost(title, content, author, rating, media,profile,'');
  //   const postContainer = document.getElementById('forum');
  //   postContainer.appendChild(newPost);
    
  //   postForm.reset();
  //   postFormContainer.style.display = "none";
  // });