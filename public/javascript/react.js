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




function createReaction(reactions, preactValue, postID,checker,deleted) {
	console.log(postID);
	let reaction = document.createElement('div'),
		like = document.createElement('div'),
		count = document.createElement('div'),
		dislike = document.createElement('div');
	reaction.id = postID;
	reaction.appendChild(like);
	reaction.appendChild(count);
	reaction.appendChild(dislike);
	reaction.className = 'reactions';
	count.className = 'count';
	if (checker==0){
		like.className = 'like like-hover';
		dislike.className = 'dislike dislike-hover';
	}
	else if (checker==1){
		like.className = 'comment_like comment_like-hover';
		dislike.className = 'comment_dislike comment_dislike-hover';
	}
	count.id = 'count-' + postID;
	count.textContent = reactions;
	if (preactValue == 1 && checker ==0) {
		like.classList.toggle('like-hover');
		like.classList.toggle('like_colored');
		dislike.classList.remove('dislike-hover');
		dislike.classList.remove('dislike_colored');
		like.title = 'Remove';
		dislike.title = 'Downvote';
	  }
	 if (preactValue == -1 && checker==0) {
		dislike.classList.toggle('dislike-hover');
		dislike.classList.toggle('dislike_colored');
		like.classList.remove('like-hover');
		like.classList.remove('like_colored');
		like.title = 'Upvote';
		dislike.title = 'Remove';
	 }
	 if (preactValue == 1 && checker ==1) {
		like.classList.toggle('comment_like-hover');
		like.classList.toggle('comment_like_colored');
		dislike.classList.remove('comment_dislike-hover');
		dislike.classList.remove('comment_dislike_colored');
		like.title = 'Remove';
		dislike.title = 'Downvote';
	  }
	 if (preactValue == -1 && checker==1) {
		dislike.classList.toggle('comment_dislike-hover');
		dislike.classList.toggle('comment_dislike_colored');
		like.classList.remove('comment_like-hover');
		like.classList.remove('comment_like_colored')
		like.title = 'Upvote';
		dislike.title = 'Remove';
	 }
	 if (deleted==1){
		like.classList.remove('comment_like-hover');
		dislike.classList.remove('comment_dislike-hover');
		like.style.pointerEvents='none';
		dislike.style.pointerEvents='none';
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

	let requestBody;
	
		requestBody = {
		parentId: postID,
		reactionValue: reactionValue,
		reactParentType: parent,
		};
  
		$.ajax({
			url: '/api/react',
			method: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(requestBody),
			success: function (data) {
				console.log("xdadas")
			  // Handle successful reaction update
			  // Assuming the response contains the updated rating data, you can now update the rating values on the page
			  const newRatingValue = data.newRatingValue; // Replace 'newRatingValue' with the actual key in the response
			  //console.log("new rating value:", newRatingValue);
			  const ratingContainer = $('#count-' + postID);
			  //console.log(ratingContainer);
			  ratingContainer.text(newRatingValue);
			},
			error: function (error) {
			  console.error('Failed to update reaction:', error);
			  // Handle error
			},
		  });
  }