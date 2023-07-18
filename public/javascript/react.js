$(document).on('click', '.dislike', function() {
	var reactionDiv = $(this).closest('.reactions');
	var postID = reactionDiv.attr('id');
	var isDisliked = $(this).hasClass('dislike_colored'); // Check if the dislike button is already colored
	
	$(this).siblings('.dislike').toggleClass('dislike-hover');
	$(this).toggleClass('dislike_colored');
	$(this).siblings('.like').removeClass('like-hover');
	$(this).siblings('.like').removeClass('like_colored');
	
	if (isDisliked) {
	  handleReact(postID, 'undislike', 'post'); // Run handleReact with 'undislike' action
	} else {
	  handleReact(postID, 'dislike', 'post'); // Run handleReact with 'dislike' action
	}
  });
  
  $(document).on('click', '.like', function() {
	var reactionDiv = $(this).closest('.reactions');
	var postID = reactionDiv.attr('id');
	var isLiked = $(this).hasClass('like_colored'); // Check if the like button is already colored
	
	$(this).siblings('.like').toggleClass('like-hover');
	$(this).toggleClass('like_colored');
	$(this).siblings('.dislike').removeClass('dislike-hover');
	$(this).siblings('.dislike').removeClass('dislike_colored');
	
	if (isLiked) {
	  handleReact(postID, 'unlike', 'post'); // Run handleReact with 'unlike' action
	} else {
	  handleReact(postID, 'like', 'post'); // Run handleReact with 'like' action
	}
  });

$(document).on('click', '.comment_dislike', function() {
	var reactionDiv = $(this).closest('.reactions');
	var postID = reactionDiv.attr('id');
	var isDisliked = $(this).hasClass('comment_dislike_colored');

	$(this).siblings('.comment_dislike').toggleClass('comment_dislike-hover');
	$(this).toggleClass('comment_dislike_colored');
	$(this).siblings('.comment_like').removeClass('comment_like-hover');
	$(this).siblings('.comment_like').removeClass('comment_like_colored');

	if (isDisliked) {
		handleReact(postID, 'undislike', 'comment'); // Run handleReact with 'undislike' action
	  } else {
		handleReact(postID, 'dislike', 'comment'); // Run handleReact with 'dislike' action
	  }
});

$(document).on('click', '.comment_like', function() {
	var reactionDiv = $(this).closest('.reactions');
	var postID = reactionDiv.attr('id');
	var isLiked = $(this).hasClass('comment_like_colored'); // Check if the like button is already colored
	
	$(this).siblings('.comment_like').toggleClass('comment_like-hover');
	$(this).toggleClass('comment_like_colored');
	$(this).siblings('.comment_dislike').removeClass('comment_dislike-hover');
	$(this).siblings('.comment_dislike').removeClass('comment_dislike_colored');

	if (isLiked) {
		handleReact(postID, 'unlike', 'comment'); // Run handleReact with 'unlike' action
	  } else {
		handleReact(postID, 'like', 'comment'); // Run handleReact with 'like' action
	  }
});

function createReaction(reactions, preactValue, postID) {
	let reaction = document.createElement('div'),
		like = document.createElement('div'),
		count = document.createElement('div'),
		dislike = document.createElement('div');
	reaction.id = postID;
	reaction.appendChild(like);
	reaction.appendChild(count);
	reaction.appendChild(dislike);
	reaction.className = 'reactions';
	like.className = 'like like-hover';
	count.className = 'count';
	dislike.className = 'dislike dislike-hover';
	count.textContent = reactions;
	if (preactValue == 1) {
		like.classList.toggle('like-hover');
		like.classList.toggle('like_colored');
		dislike.classList.remove('dislike-hover');
		dislike.classList.remove('dislike-colored');
	  }
	 if (preactValue == -1) {
		dislike.classList.toggle('dislike-hover');
		dislike.classList.toggle('dislike_colored');
		like.classList.remove('like-hover');
		like.classList.remove('like-colored')
	 }
	return reaction; 
}	

function handleReact(postID, reactionType, parent) {
    // Determine the reaction value based on the reactionType
	console.log("hi", postID);
    let reactionValue;
    switch (reactionType) {
      case 'like':
        reactionValue = 1;
        break;
      case 'dislike':
        reactionValue = -1;
        break;
      case 'undislike':
      case 'unlike':
        reactionValue = 0;
        break;
      default:
        reactionValue = 0; 
        break;
    }
 
    // Send an HTTP request to update the reaction on the server
	let requestBody;
	
		requestBody = {
		parentId: postID,
		reactionValue: reactionValue,
		reactParentType: parent,
		};
	
	// }else if(parent == 'comment'){}
	// 	requestBody = {
	// 	commentID: postID,
	// 	reactionValue: reactionValue,
	// 	reactParentType: parent,
	// 	};
	// }
  
    fetch(`/api/react`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => {
        if (response.ok) {
          // Handle successful reaction update
        //   window.location.href = "/post/" + encodeURIComponent(ptitle);
		//window.location.reload();
        } else {
          throw new Error('Failed to update reaction');
        }
      })
      .catch(error => {
        console.error(error);
        // Handle error
      });
  }
