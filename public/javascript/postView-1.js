function newPost(pauthor, ptitle, ppfp, pdesc, pposted, pedited, pcount, pmedia) {
    let
      info_list = document.createElement('div'),
      topic = document.createElement('div'),
      headers = document.createElement('div'),
      span = document.createElement('span'),
      post = document.createElement('div'),
      post_img = document.createElement('span'),
      info = document.createElement('div'),
      pfp = document.createElement('img'),
      posted = document.createElement('p'),
      edited = document.createElement('p'),
      postedSpan = document.createElement('span'),
      editedSpan = document.createElement('span'),
      media = document.createElement('img'),
      comment_reply = document.createElement('div'),
      comment_share = document.createElement('div'),
      comment_edit = document.createElement('div'),
      comment_edited = document.createElement('div'),
      comment_save = document.createElement('div'),
      comment_text_area_save = document.createElement('div'),
      comment_text_area = document.createElement('textarea'),
      buttons = document.createElement('div'),
      comment_delete = document.createElement('div'),
      comment_cancel = document.createElement('div');
  
    comment_text_area.id = 'comment_text_area_id';
  
    info_list.className = 'info_list';
    topic.className = 'topic';
    headers.className = 'headers';
    post.className = 'post';
    post_img.className = 'post_img';
    info.className = 'info';
    comment_reply.className = 'comment_reply';
    comment_share.className = 'comment_share';
    comment_edit.className = 'comment_edit';
    comment_edited.className = 'comment_edited';
    comment_save.className = 'comment_save';
    buttons.className = 'post_button';
    comment_text_area.className = 'comment_text_area';
    comment_text_area_save.className = 'comment_text_area_save';
    comment_delete.className = 'comment_delete';
    comment_cancel.className = 'comment_cancel';
  
    media.src = pmedia;
    pfp.src = ppfp;
    span.innerHTML = " &bull;posted by " + pauthor;
    span.style.cursor = 'pointer';
    span.appendChild(pfp);
    headers.textContent = ptitle + " ";
    headers.appendChild(span);
    topic.appendChild(headers);
  
    post_img.textContent = pdesc;
    post.appendChild(post_img);
    post.appendChild(document.createElement('br'));
    post.appendChild(media);
    topic.appendChild(post);
    posted.textContent = "Posted ";
    info.appendChild(posted);
    postedSpan.textContent = pposted;
    info.appendChild(postedSpan);
    edited.textContent = "Edited ";
    info.appendChild(edited);
    editedSpan.textContent = pedited;
    info.appendChild(editedSpan);
  
    span.onclick = function () {
      window.location.href = "../../user_profiles/" + pauthor + ".html";
    }
  
    comment_reply.textContent = "Reply";
    comment_text_area_save.textContent = "Save";
    comment_cancel.textContent = "Cancel";
    comment_reply.onclick = function () {
      let textAreas = document.querySelectorAll('.comment_text_area');
      textAreas.forEach(textArea => {
        const parentElement = textArea.closest('.comment_wrapping');
        if (parentElement) {
          parentElement.removeChild(textArea);
        }
      });
  
      let commentSaves = document.querySelectorAll('.cancel_save_wrap');
      commentSaves.forEach(commentSave => {
        const parentElement = commentSave.closest('.comment_wrapping');
        if (parentElement) {
          parentElement.removeChild(commentSave);
        }
      });
  
      const border = document.querySelector('.border');
      border.appendChild(comment_text_area);
      cancel_save_wrap = document.createElement('div');
      cancel_save_wrap.className = 'cancel_save_wrap';
      cancel_save_wrap.appendChild(comment_text_area_save);
      cancel_save_wrap.appendChild(comment_cancel);
      border.appendChild(cancel_save_wrap);
      comment_cancel.onclick = function () {
        border.removeChild(cancel_save_wrap);
        border.removeChild(comment_text_area);
      }
      comment_text_area_save.onclick = function () {
        let text_area_value = document.getElementById('comment_text_area_id');
        let newcomment = text_area_value.value;
        border.removeChild(comment_text_area);
        border.removeChild(cancel_save_wrap);
        const commentAlignElement = document.querySelector('.comment_align');
        if (commentAlignElement) {
          const commentAlignId = commentAlignElement.id;
          console.log(commentAlignId);
          border.append(postreply("Ecola", "../sample users/Ecola.jpg", newcomment, 0, commentAlignId + 1));
        }
      }
    }
  
    buttons.appendChild(comment_reply);
    comment_share.textContent = "Share";
    buttons.appendChild(comment_share);
    comment_edit.textContent = "Edit";
    comment_edited.textContent = "Edited";
    comment_save.textContent = "Save";
    comment_save.style.display = 'none';
    comment_edit.onclick = function () {
      comment_save.style.display = 'block';
      post_img.contentEditable = true;
      buttons.appendChild(comment_save);
      comment_save.onclick = function () {
        comment_save.style.display = 'none';
        post_img.contentEditable = false;
      }
    };
    comment_delete.onclick = function () {
      let commentDeleteElements = document.querySelectorAll('.content_list');
      commentDeleteElements.forEach(function (element) {
        element.innerHTML = '';
      });
  
      commentDeleteElements = document.querySelectorAll('.comment_align');
      commentDeleteElements.forEach(function (element) {
        element.innerHTML = '';
      });
  
      const border = document.querySelector('.border');
      const topDiv = document.createElement('div');
      const topicDiv = document.createElement('div');
      topicDiv.classList.add('content_delete');
      topicDiv.textContent = 'Content Deleted';
      border.appendChild(topDiv);
      topDiv.appendChild(topicDiv);
      topDiv.style.display = 'flex';
      topDiv.style.justifyContent = 'center';
      topDiv.style.alignItems = 'center';
      topDiv.style.position = 'fixed';
      topDiv.style.top = '50%';
      topDiv.style.left = '50%';
      topDiv.style.transform = 'translate(-50%, -50%)';
    };
  
    comment_delete.textContent = "Delete";
    buttons.appendChild(comment_delete);
    buttons.appendChild(comment_reply);
    buttons.appendChild(comment_share);
    buttons.appendChild(comment_edit);
  
    info_list.appendChild(createReaction(pcount));
    info.appendChild(buttons);
    topic.appendChild(info);
    info_list.appendChild(topic);
    const buttonschildren = buttons.children;
    for (let i = 0; i < buttonschildren.length; i++) {
      buttonschildren[i].style.display = 'inline';
    }
  
    const infoChildren = info.children;
    for (let i = 0; i < infoChildren.length; i++) {
      infoChildren[i].style.display = 'inline';
    }
  
    return info_list;
  }
  
  function postreply(pauthor, ppfp, pdesc, pcount, pid) {
    let
      comment_align = document.createElement('div'),
      comment_forum = document.createElement('div'),
      comment_container = document.createElement('div'),
      comment_profile = document.createElement('div'),
      comment_pfp = document.createElement('div'),
      pfp = document.createElement('img'),
      author = document.createElement('p'),
      comment_content_desc = document.createElement('div'),
      comment_react = document.createElement('div'),
      comment_reply = document.createElement('div'),
      comment_share = document.createElement('div'),
      comment_delete = document.createElement('div'),
      comment_edit = document.createElement('div'),
      comment_edited = document.createElement('div'),
      comment_save = document.createElement('div'),
      comment_text_area_save = document.createElement('div'),
      comment_text_area = document.createElement('textarea'),
      desc = document.createElement('p'),
      comment_wrapping = document.createElement('div'),
      comment_cancel = document.createElement('div');
  
    comment_text_area.id = 'comment_text_area_id';
  
    comment_align.className = 'comment_align';
    comment_forum.className = 'comment_forum';
    comment_container.className = 'comment_container';
    comment_profile.className = 'comment_profile';
    comment_pfp.className = 'comment_pfp';
    comment_content_desc.className = 'comment_content_desc';
    comment_react.className = 'comment_react';
    comment_reply.className = 'comment_reply';
    comment_share.className = 'comment_share';
    comment_edit.className = 'comment_edit';
    comment_edited.className = 'comment_edited';
    comment_save.className = 'comment_save';
    comment_text_area.className = 'comment_text_area';
    comment_text_area_save.className = 'comment_text_area_save';
    comment_wrapping.className = 'comment_wrapping';
    comment_delete.className = 'comment_delete';
    comment_cancel.className = 'comment_cancel';
  
    pfp.src = ppfp;
    comment_pfp.appendChild(pfp);
    author.textContent = pauthor;
    comment_profile.appendChild(comment_pfp);
    comment_profile.appendChild(author);
    comment_container.appendChild(comment_profile);
    desc.textContent = pdesc;
    comment_profile.style.cursor = 'pointer';
    comment_profile.onclick = function () {
      window.location.href = "../../user_profiles/" + pauthor + ".html";
    }
    comment_content_desc.appendChild(desc);
    comment_delete.textContent = "Delete";
    comment_reply.textContent = "Reply";
    comment_text_area_save.textContent = "Save";
    comment_cancel.textContent = "Cancel";
    comment_reply.onclick = function () {
      let textAreas = document.querySelectorAll('.comment_text_area');
      textAreas.forEach(textArea => {
        const parentElement = textArea.closest('.comment_wrapping');
        if (parentElement) {
          parentElement.removeChild(textArea);
        } else {
          const parentElement = textArea.closest('.border');
          parentElement.removeChild(textArea);
        }
      });
  
      let commentSaves = document.querySelectorAll('.cancel_save_wrap');
      commentSaves.forEach(commentSave => {
        const parentElement = commentSave.closest('.comment_wrapping');
        if (parentElement) {
          parentElement.removeChild(commentSave);
        } else {
          const parentElement = commentSave.closest('.border');
          parentElement.removeChild(commentSave);
        }
      });
  
      comment_wrapping.appendChild(comment_text_area);
      comment_wrapping.appendChild(comment_text_area_save);
      comment_text_area_save.onclick = function () {
        let text_area_value = document.getElementById('comment_text_area_id');
        let newcomment = text_area_value.value;
        comment_wrapping.removeChild(comment_text_area);
        comment_wrapping.removeChild(comment_text_area_save);
        comment_align.append(postreply("Ecola", "../sample users/Ecola.jpg", newcomment, 0, pid + 1));
      }
    }
  
    comment_react.appendChild(comment_delete);
    comment_react.appendChild(comment_reply);
    comment_share.textContent = "Share";
    comment_react.appendChild(comment_share);
    comment_edit.textContent = "Edit";
    comment_edited.textContent = "Edited";
    comment_save.textContent = "Save";
    comment_delete.onclick = function () {
      author.textContent = "Deleted";
      pfp.src = "";
      desc.textContent = "Deleted";
      count.textContent = "Deleted";
    }
    comment_edit.onclick = function () {
      comment_save.style.display = 'block';
      desc.contentEditable = true;
      comment_react.appendChild(comment_save);
      comment_content_desc.appendChild(comment_edited);
      comment_save.onclick = function () {
        comment_save.style.display = 'none';
        desc.contentEditable = false;
      }
    }
    comment_react.appendChild(comment_edit);
    comment_container.appendChild(comment_content_desc);
    comment_forum.appendChild(comment_container);
    comment_wrapping.appendChild(comment_forum);
    comment_align.appendChild(comment_wrapping);
    comment_align.id = pid;
    return comment_align;
  }
  
  function profpost(pauthor, ppfp, pdesc, pcount, pid, phtml) {
    let
      comment_align = document.createElement('div'),
      comment_forum = document.createElement('div'),
      comment_container = document.createElement('div'),
      comment_profile = document.createElement('div'),
      comment_pfp = document.createElement('div'),
      pfp = document.createElement('img'),
      author = document.createElement('p'),
      comment_content_desc = document.createElement('div'),
      comment_react = document.createElement('div'),
      comment_like = document.createElement('div'),
      comment_count = document.createElement('div'),
      comment_dislike = document.createElement('div'),
      comment_reply = document.createElement('div'),
      comment_share = document.createElement('div'),
      comment_delete = document.createElement('div'),
      comment_edit = document.createElement('div'),
      comment_edited = document.createElement('div'),
      comment_save = document.createElement('div'),
      comment_text_area_save = document.createElement('div'),
      comment_text_area = document.createElement('textarea'),
      desc = document.createElement('p'),
      comment_wrapping = document.createElement('div');
  
    comment_text_area.id = 'comment_text_area_id';
  
    comment_align.className = 'comment_align';
    comment_forum.className = 'comment_forum';
    comment_container.className = 'comment_container';
    comment_profile.className = 'comment_profile';
    comment_pfp.className = 'comment_pfp';
    comment_content_desc.className = 'comment_content_desc';
    comment_react.className = 'comment_react';
    comment_like.className = 'comment_like comment_like-hover';
    comment_count.className = 'comment_count';
    comment_dislike.className = 'comment_dislike comment_dislike-hover';
    comment_reply.className = 'comment_reply';
    comment_share.className = 'comment_share';
    comment_edit.className = 'comment_edit';
    comment_edited.className = 'comment_edited';
    comment_save.className = 'comment_save';
    comment_text_area.className = 'comment_text_area';
    comment_text_area_save.className = 'comment_text_area_save';
    comment_wrapping.className = 'comment_wrapping';
    comment_delete.className = 'comment_delete';
  
    pfp.src = ppfp;
    comment_pfp.appendChild(pfp);
    author.textContent = pauthor;
    comment_profile.appendChild(comment_pfp);
    comment_profile.appendChild(author);
    comment_container.appendChild(comment_profile);
    desc.textContent = pdesc;
    desc.onclick = function () {
      window.location.href = phtml;
    };
    desc.style.cursor = "pointer";
    comment_content_desc.appendChild(desc);
    comment_react.appendChild(comment_like);
    comment_count.textContent = pcount;
    comment_react.appendChild(comment_count);
    comment_react.appendChild(comment_dislike);
    comment_delete.textContent = "Delete";
    comment_reply.textContent = "Reply";
    comment_text_area_save.textContent = "Save";
    comment_cancel.textContent = "Cancel";
    comment_reply.onclick = function () {
      comment_wrapping.appendChild(comment_text_area);
      comment_wrapping.appendChild(comment_text_area_save);
      comment_text_area_save.onclick = function () {
        let text_area_value = document.getElementById('comment_text_area_id');
        let newcomment = text_area_value.value;
        comment_wrapping.removeChild(comment_text_area);
        comment_wrapping.removeChild(comment_text_area_save);
        comment_align.append(postreply(pauthor, ppfp, newcomment, 0, pid + .1));
      }
    }
    comment_react.appendChild(comment_delete);
    comment_react.appendChild(comment_reply);
    comment_share.textContent = "Share";
    comment_react.appendChild(comment_share);
    comment_edit.textContent = "Edit";
    comment_edited.textContent = "Edited";
    comment_save.textContent = "Save";
    comment_delete.onclick = function () {
      author.textContent = "Deleted";
      pfp.src = "";
      desc.textContent = "Deleted";
      count.textContent = "Deleted";
    }
    comment_edit.onclick = function () {
      comment_save.style.display = 'block';
      desc.contentEditable = true;
      comment_react.appendChild(comment_save);
      comment_content_desc.appendChild(comment_edited);
      comment_save.onclick = function () {
        comment_save.style.display = 'none';
        desc.contentEditable = false;
      }
    }
    comment_react.appendChild(comment_edit);
    comment_container.appendChild(comment_content_desc);
    comment_forum.appendChild(comment_container);
    comment_wrapping.appendChild(comment_forum);
    comment_align.appendChild(comment_wrapping);
    comment_align.id = pid;
    return comment_align;
  }
  
  function profButton() {
    const editButton = document.getElementById('edit_Button');
    const saveButton = document.getElementById('save_Button');
    const prof_info = document.getElementById('prof_info');
    saveButton.style.display = 'none';
    editButton.onclick = function () {
      let currentURL = window.location.href;
      if (isLoggedIn === true){
        prof_info.setAttribute('contenteditable', 'true');
        saveButton.style.display = 'block';
      } else {
        alert("You need to log in first");
      }
    };
  
    saveButton.addEventListener('click', function () {
      saveButton.style.display = 'none';
      prof_info.setAttribute('contenteditable', 'false');
    });
  }
  