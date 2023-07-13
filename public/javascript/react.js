$(document).on('click', '.dislike', function() {
	$(this).siblings('.dislike').toggleClass('dislike-hover');
	$(this).toggleClass('dislike_colored');
	$(this).siblings('.like').removeClass('like-hover');
	$(this).siblings('.like').removeClass('like_colored');
  });
  
  $(document).on('click', '.like', function() {
	$(this).siblings('.like').toggleClass('like-hover');
	$(this).toggleClass('like_colored');
	$(this).siblings('.dislike').removeClass('dislike-hover');
	$(this).siblings('.dislike').removeClass('dislike_colored');
  });

$(document).on('click', '.comment_dislike', function() {
	$(this).siblings('.comment_dislike').toggleClass('comment_dislike-hover');
	$(this).toggleClass('comment_dislike_colored');
	$(this).siblings('.comment_like').removeClass('comment_like-hover');
	$(this).siblings('.comment_like').removeClass('comment_like_colored');
});

$(document).on('click', '.comment_like', function() {
	$(this).siblings('.comment_like').toggleClass('comment_like-hover');
	$(this).toggleClass('comment_like_colored');
	$(this).siblings('.comment_dislike').removeClass('comment_dislike-hover');
	$(this).siblings('.comment_dislike').removeClass('comment_dislike_colored');
});

function createReaction(reactions, isHorizontal) {
	let reaction = document.createElement('div'),
		like = document.createElement('div'),
		count = document.createElement('div'),
		dislike = document.createElement('div');
		
	reaction.appendChild(like);
	reaction.appendChild(count);
	reaction.appendChild(dislike);
	if (isHorizontal) 
		reaction.className = 'reactions-horizontal';
	else
		reaction.className = 'reactions';
	like.className = 'like like-hover';
	count.className = 'count';
	dislike.className = 'dislike dislike-hover';

	count.textContent = reactions;

	return reaction; 
}	