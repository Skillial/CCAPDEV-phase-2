function newPost(postID, pauthor, ptitle, ppfp, pdesc, ppostedDate, peditedDate, prating, pmedia) {
    const infoList = document.createElement('div');
    infoList.className = 'info_list';
  
    const topic = document.createElement('div');
    topic.className = 'topic';
  
    const headers = document.createElement('div');
    headers.className = 'headers';
  
    const titleElement = document.createElement('h2');
    titleElement.textContent = ptitle;
    headers.appendChild(titleElement);
  
    const authorSpan = document.createElement('span');
    authorSpan.textContent = ` - posted by ${pauthor}`;
    authorSpan.style.cursor = 'pointer';
    authorSpan.addEventListener('click', () => {
      window.location.href = `/profile/${pauthor}`;
    });
    headers.appendChild(authorSpan);
  
    topic.appendChild(headers);
  
    const postContent = document.createElement('div');
    postContent.className = 'post_content';
    postContent.textContent = pdesc;
    topic.appendChild(postContent);
  
    if (pmedia) {
      const mediaElement = document.createElement('img');
      mediaElement.src = pmedia;
      topic.appendChild(mediaElement);
    }
  
    const info = document.createElement('div');
    info.className = 'info';
    info.style.display = 'flex';
  
    const posted = document.createElement('p');
    posted.innerHTML = 'Posted:&nbsp;';
    info.appendChild(posted);
  
    const postedDateElement = document.createElement('span');
    postedDateElement.textContent = new Date(ppostedDate).toLocaleString();
    info.appendChild(postedDateElement);
  
    if (peditedDate !== '- Not Edited') {
      const edited = document.createElement('p');
      edited.textContent = 'Edited ';
      info.appendChild(edited);
  
      const editedDateElement = document.createElement('span');
      editedDateElement.textContent = new Date(peditedDate).toLocaleString();
      info.appendChild(editedDateElement);
    }
  
    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    buttons.style.display = 'flex';
    buttons.style.float = 'right';
    const buttonMargin = '0 8px';
  
    const commentReply = document.createElement('div');
    commentReply.textContent = 'Reply';
    commentReply.style.margin = buttonMargin;
    commentReply.style.cursor = 'pointer';
    commentReply.addEventListener('click', () => {
      handleReply(postID);
    });
    buttons.appendChild(commentReply);
  
    const commentShare = document.createElement('div');
    commentShare.textContent = 'Share';
    commentShare.style.margin = buttonMargin;
    commentShare.style.cursor = 'pointer';
    commentShare.addEventListener('click', () => {
      // Handle share functionality
    });
    buttons.appendChild(commentShare);
  
    const commentEdit = document.createElement('div');
    commentEdit.textContent = 'Edit';
    commentEdit.style.margin = buttonMargin;
    commentEdit.style.cursor = 'pointer';
    commentEdit.addEventListener('click', () => {
      handleEditPost(postID, ptitle, pdesc); // Pass the post ID and current description to the edit handler
    });
    buttons.appendChild(commentEdit);
  
    const commentDelete = document.createElement('div');
    commentDelete.textContent = 'Delete';
    commentDelete.style.margin = buttonMargin;
    commentDelete.style.cursor = 'pointer';
    commentDelete.addEventListener('click', () => {
      handleDeletePost(postID);
    });
    buttons.appendChild(commentDelete);
  
    info.appendChild(buttons);
  
    topic.appendChild(info);
    infoList.appendChild(topic);
  
    return infoList;
  }
  
  // ... (your existing code for newPost)

    function appendComments(commentsData) {
      const commentsContainer = document.getElementById('commentsContainer');
    
      commentsData.forEach((comment) => {
        const commentElement = newComment(comment.author, comment.ppfp, comment.content, comment.pcount, comment._id, comment.children);
        commentsContainer.appendChild(commentElement);
      });
    }
    
    // Get the comments data from the EJS template
    const commentsData = JSON.stringify(comments);
    
    // Generate and append the comments after the page loads
    document.addEventListener('DOMContentLoaded', () => {
      appendComments(commentsData);
    });
  

    // ... (your existing code for newComment and handleReply)







  function newComment(pauthor, ppfp, pdesc, pcount, pid, children) {
    const buttonMargin = '0 8px';

    const commentAlign = document.createElement('div');
    commentAlign.className = 'comment_align';
  
    const commentForum = document.createElement('div');
    commentForum.className = 'comment_forum';
  
    const commentContainer = document.createElement('div');
    commentContainer.className = 'comment_container';
  
    const commentProfile = document.createElement('div');
    commentProfile.className = 'comment_profile';
    commentProfile.addEventListener('click', () => {
      window.location.href = `/profile/${pauthor}`;
    });
  
    const commentPfp = document.createElement('div');
    commentPfp.className = 'comment_pfp';
  
    const pfpElement = document.createElement('img');
    pfpElement.src = ppfp;
    commentPfp.appendChild(pfpElement);
    commentProfile.appendChild(commentPfp);
  
    const authorElement = document.createElement('p');
    authorElement.textContent = pauthor;
    commentProfile.appendChild(authorElement);
  
    commentContainer.appendChild(commentProfile);
  
    const descElement = document.createElement('div');
    descElement.className = 'comment_content_desc';
    descElement.textContent = pdesc;
    commentContainer.appendChild(descElement);
  
    const commentReact = document.createElement('div');
    commentReact.className = 'comment_react';
    commentReact.style.display = 'flex';
  
    const commentDelete = document.createElement('div');
    commentDelete.textContent = 'Delete';
    commentDelete.addEventListener('click', () => {
      // Handle delete functionality
    });
    commentReact.appendChild(commentDelete);
  
    const commentReply = document.createElement('div');
    commentReply.textContent = 'Reply';
    commentReply.style.margin = buttonMargin;
    commentReply.addEventListener('click', () => {
      handleReply(pid); // Pass the comment ID to the reply handler
    });
    commentReact.appendChild(commentReply);
  
    const commentShare = document.createElement('div');
    commentShare.textContent = 'Share';
    commentShare.addEventListener('click', () => {
      // Handle share functionality
    });
    commentReact.appendChild(commentShare);
  
    const commentEdit = document.createElement('div');
    commentEdit.textContent = 'Edit';
    commentEdit.addEventListener('click', () => {
      // Handle edit functionality
    });
    commentReact.appendChild(commentEdit);
    
    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'children-container';
  
    // Recursively add the children comments
    if (children && children.length > 0) {
      children.forEach((child) => {
        const childComment = newComment(child.pauthor, child.ppfp, child.pdesc, child.pcount, child.pid, child.children);
        childrenContainer.appendChild(childComment);
      });
    }

    commentContainer.appendChild(commentReact);
    commentForum.appendChild(commentContainer);
    
    // Append the children container to the commentForum if it contains nested comments
    if (childrenContainer.children.length > 0) {
      commentForum.appendChild(childrenContainer);
    }

    commentAlign.appendChild(commentForum);
    commentAlign.id = pid;
  
    return commentAlign;
  }

  function handleReply(postID) {
    const replyContent = prompt('Enter your reply:');
    if (replyContent) {
      // Send an HTTP request to your server to save the reply
      const requestBody = {
        content: replyContent,
        parentPostID: postID
      };
      fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
        .then(response => {
          if (response.ok) {
            // Handle successful reply creation
            // Reload or update the comments section if needed
            window.location.href = "/post/" + encodeURIComponent(ptitle);
          } else {
            throw new Error('Failed to create reply');
          }
        })
        .catch(error => {
          console.error(error);
          // Handle error
        });
    }
  }

  function handleDeletePost(postID) {
    // Show a confirmation dialog before deleting the post
    if (confirm('Are you sure you want to delete this post?')) {
      // Send an HTTP request to your server to update the post data
      fetch(`/api/post/${postID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isDeleted: true })
      })
        .then(response => {
          if (response.ok) {
            window.location.href = "/post/" + encodeURIComponent(ptitle);
          } else {
            throw new Error('Failed to delete the post');
          }
        })
        .catch(error => {
          console.error(error);
          // Handle error
        });
    }
  }
  
  function handleEditPost(postID, currentTitle, currentDescription) {
    const newTitle = prompt('Edit your post title:', currentTitle);
    const newDescription = prompt('Edit your post content:', currentDescription);
  
    if (newTitle !== null || newDescription !== null) {
      // Send an HTTP request to update the post on the server
      const requestBody = {
        title: newTitle,
        content: newDescription
      };
  
      fetch(`/api/post/${postID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
        .then(response => {
          if (response.ok) {
            // Handle successful post update
            // Reload the page to see the updated post details
            const encodedTitle = encodeURIComponent(newTitle); // Assuming newTitle is the updated title
            window.location.replace(`/post/${encodedTitle}`);
          } else {
            throw new Error('Failed to update post');
          }
        })
        .catch(error => {
          console.error(error);
          // Handle error
        });
    }
  }
  
  