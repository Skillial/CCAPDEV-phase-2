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
    like.onclick = function() {
        alert("Please login first!");
    }
    dislike.onclick = function() {
        alert("Please login first!");
    }
    return reaction; 
}