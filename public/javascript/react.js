$(document).on('click', '.dislike', function() {
	$(this).toggleClass('dislike_colored');
	$(this).siblings('.like').removeClass('like_colored');
	$(this).siblings('.like').toggleClass('no-hover');
  });
  
  $(document).on('click', '.like', function() {
	$(this).toggleClass('like_colored');
	$(this).siblings('.dislike').removeClass('dislike_colored');
	$(this).siblings('.dislike').toggleClass('no-hover');
  });



$(document).on('click', '.comment_dislike', function() {
  $(this).toggleClass('comment_dislike_colored');
  $(this).siblings('.comment_like').removeClass('comment_like_colored');
});

$(document).on('click', '.comment_like', function() {
  $(this).toggleClass('comment_like_colored');
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
	like.className = 'like';
	count.className = 'count';
	dislike.className = 'dislike';

	count.textContent = reactions;

	return reaction; 
}	