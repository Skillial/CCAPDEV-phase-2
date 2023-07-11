const writePostButton = document.getElementById("newPostWrite");
const postFormContainer = document.getElementById("newPostFormContainer");
const postForm = document.getElementById("postForm");
const cancelButton = document.getElementById("cancelButton");
const yCancelButton = document.getElementById("yCancelButton");
const nCancelButton = document.getElementById("nCancelButton");
const postTag = document.getElementById("tags");
var maxCalls = 15;
var callCount=0;

writePostButton.addEventListener("click", () => {
  var ecolaElement = document.getElementById("Ecola");
        var kinkeyElement = document.getElementById("Kinkey");
        var matrixElement = document.getElementById("Matrix");
        var denialElement = document.getElementById("denial");
        var poop_banditElement = document.getElementById("poop bandit");
        if (ecolaElement||kinkeyElement||matrixElement||denialElement||poop_banditElement) {
          if (callCount < maxCalls) {
   postFormContainer.style.display = "block";
          }else{
            alert("You have reached the limit of 15 posts");
          }
        }else{
          alert("You need to log in first");
        }
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

  
function createPost(title, desc, author, rating, tags, media, profile,link) {
	let post = document.createElement('div'),
	content_div = document.createElement('div'),
	post_title = document.createElement('div'),
	post_author = document.createElement('span'),
	post_description = document.createElement('div'),
	post_media = document.createElement('span'),
	post_tag = document.createElement('span'),
	post_tags = document.createElement('div'),
  post_title_name = document.createElement('span');

  post_author.className='content_author';
	post.className = 'forum';
	content_div.className = 'content';
	post_title_name.className = 'content_title';
  post_title_name.onclick = function() {
    window.location.href = link;
  };
	post_description.className = 'content_desc';
	post_tags.className = 'content_footer';
	post_title_name.textContent = title;
  post_title.appendChild(post_title_name);
	post_author.innerHTML = " &bull; " + author;
  post_author.onclick = function() {
    window.location.href = profile;
  };
	post_title.appendChild(post_author);
	post_description.textContent = desc;
	post_description.setAttribute('align', 'justify');
	if (media.localeCompare(' ') !== 0) {
		post_description.appendChild(document.createElement('br'));
		post_media.textContent = '(' + media + ')';
		post_description.appendChild(post_media);
	}
	post_tags.textContent = 'Tags: ';
	post_tag.textContent = tags;
	post_tags.appendChild(post_tag);

	content_div.appendChild(post_title);
	content_div.appendChild(post_description);
	content_div.appendChild(post_tags);

	post.appendChild(createReaction(rating));
	post.appendChild(content_div);
  callCount++;
	return post;
}

  
  postForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
  
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    //const author = document.getElementById('author').value;
    const tags = document.getElementById('tags').value;
    let media = document.getElementById('media').value;
    const rating = 0; // Default rating value (starting at 0)
    var ecolaElement = document.getElementById("Ecola");
        var kinkeyElement = document.getElementById("Kinkey");
        var matrixElement = document.getElementById("Matrix");
        var denialElement = document.getElementById("denial");
        var poop_banditElement = document.getElementById("poop bandit");
        var author;
        var profile;
        var link;
        if (ecolaElement){
           author = 'Ecola';
           profile='user_profiles/Ecola.html';
          }
          if (kinkeyElement){
            author = 'Kinkey';
            profile='user_profiles/Kinkey.html';
          }
          if (matrixElement){
            author = 'Matrix';
            profile='user_profiles/Matrix.html';
          }
          if (denialElement){
            author = 'denial';
            profile='user_profiles/denial.html';
          }
          if (poop_banditElement){
            author = 'poop bandit';
            profile='user_profiles/poop bandit.html';
          }

    if(media === ''){
        media = ' ';
    }
    const newPost = createPost(title, content, author, rating, tags, media,profile,'');
    const postContainer = document.getElementById('forum');
    postContainer.appendChild(newPost);
    
    postForm.reset();
    postFormContainer.style.display = "none";
  });