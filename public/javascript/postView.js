let oldContent;
let oldTitle;
function initializeTinyMCE() {
  tinymce.init({
    selector: '#comment_text_area_id',
    menubar: 'edit   format',
    statusbar: false,
    // Add your TinyMCE configuration options here if needed
    setup: function (editor) {
      editor.on('init', function () {
        oldContent = editor.getContent();
        console.log(oldContent);
      });
    }
  });
}

function initializeTinyMCEedit() {
  tinymce.init({
    selector: '#post_img_content',
    menubar: 'edit format',
    statusbar: false,
    // Add your TinyMCE configuration options here if needed
    setup: function (editor) {
      editor.on('init', function () {
        oldContent = editor.getContent();
        console.log(oldContent);
      });
    }
  });
}


function initializeTinyMCEeditReply(pid) {
  tinymce.init({
    selector: '#' + pid,
    menubar: 'edit format',
    statusbar: false,
    // Add your TinyMCE configuration options here if needed
    setup: function (editor) {
      editor.on('init', function () {
        oldContent = editor.getContent();
        console.log(oldContent);
      });
    }
  });
}

function posthtml(postID, pauthor,ptitle,ppfp,pdesc,ppostedDate,peditedDate,prating,pmedia, preactValue, isCurrUserTheAuthor,isLoggedIn) {
    let 
    // content_list = document.createElement('div'),
    info_list = document.createElement('div'),
    topic = document.createElement('div'),
    headers = document.createElement('div'),
    span = document.createElement('span'),
    post = document.createElement('div'),
    post_img = document.createElement('span'),
    info = document.createElement('div'),
    pfp = document.createElement('img'),
    posted =document.createElement('p'),
    edited =document.createElement('p'),
    postedSpan=document.createElement('span'),
    editedSpan=document.createElement('span'),
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
    // content_list.className = 'content_list';
    info_list.className = 'info_list';
    topic.className = 'topic';
    headers.className = 'headers';
    post.className = 'post';
    post_img.className = 'post_img';
    post_img.id = 'post_img_content';
    info.className = 'info';
    comment_reply.className='comment_reply';
    comment_share.className='comment_share';
    comment_edit.className='comment_edit';
    comment_edited.className='comment_edited';
    comment_save.className='comment_save';
    comment_edit.id ="comment_edit_id";
    comment_save.id = "comment_save_id";
    buttons.className='post_button';
    comment_text_area.className='comment_text_area';
    comment_text_area_save.className='comment_text_area_save';
    comment_delete.className = 'comment_delete';
    comment_cancel.className = 'comment_cancel';

    media.src = pmedia;
    pfp.src = ppfp;
    span.innerHTML = " &bull;posted by " + pauthor;
    span.style.cursor='pointer';
    span.appendChild(pfp);
    let header_title = document.createElement('p');
    header_title.id="header_title";
    header_title.innerText=ptitle+" ";
    oldTitle=ptitle+" ";
    headers.appendChild(header_title);
    headers.appendChild(span);
     topic.appendChild(headers);
    
    post_img.innerHTML=pdesc;
    // post_img.contentEditable = true; 
    post.appendChild(post_img);
    post.appendChild( document.createElement('br'));
    post.appendChild(media);
    topic.appendChild(post);
    posted.textContent= "Posted ";
    info.appendChild(posted);
    postedSpan.textContent=ppostedDate;
    info.appendChild(postedSpan);
    if (peditedDate !== '- Not Edited') {
        edited.textContent= "Edited ";
        info.appendChild(edited);
        editedSpan.textContent=new Date(peditedDate).toLocaleString();
        info.appendChild(editedSpan);
    }
    
    span.onclick = function(){
        window.location.href = `/profile/${pauthor}`;
    }
    comment_reply.textContent="Reply";
    comment_text_area_save.textContent="Save";
    comment_cancel.textContent="Cancel";


    comment_reply.addEventListener('click', () => {
      if (isLoggedIn!=="false"){
        let textAreas = document.querySelectorAll('.comment_text_area');
        textAreas.forEach(textArea => {
            const parentElement = textArea.closest('.comment_wrapping');
            if (parentElement) {
              parentElement.removeChild(textArea);
            }
          });

          let header_remove = document.querySelector('#header_title');
          header_remove.style.border = 'none';
          header_remove.textContent=oldTitle;
          let edit_add = document.querySelectorAll('#comment_edit_id');
          edit_add.forEach(edit =>{
            edit.style.display='';
          });
          let share_remove = document.querySelectorAll('#comment_save_id');
          share_remove.forEach(share =>{
            share.style.display='none';
          });
          for (const editorId in tinymce.editors) {
            if (tinymce.editors.hasOwnProperty(editorId)) {
              const editor = tinymce.editors[editorId];
              // Remove the editor instance
              editor.setContent(oldContent);
              tinymce.remove(editor);
            }
          }
        let commentSaves = document.querySelectorAll('.cancel_save_wrap');
        // Remove each comment save element from its parent "comment_wrapping" div
        commentSaves.forEach(commentSave => {
            const parentElement = commentSave.closest('.comment_wrapping');
            if (parentElement) {
                parentElement.removeChild(commentSave);
            }
        });
                // comment_text_area.id="editor";

        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://cdn.tiny.cloud/1/no-api-key/tinymce/5/tinymce.min.js';
        scriptTag.setAttribute('referrerpolicy', 'origin');
        scriptTag.onload = initializeTinyMCE; // Call the TinyMCE initialization after the script is loaded
        document.head.appendChild(scriptTag);

        const styleTag = document.createElement('style');
        styleTag.textContent = '.tox-notification { display: none !important; }';
        document.head.appendChild(styleTag);

  
        const border = document.querySelector('.border');
        border.appendChild(comment_text_area);
        cancel_save_wrap = document.createElement('div');
        cancel_save_wrap.className='cancel_save_wrap';
        cancel_save_wrap.appendChild(comment_text_area_save);
        cancel_save_wrap.appendChild(comment_cancel);
        border.appendChild(cancel_save_wrap);
        comment_cancel.onclick=function(){
            border.removeChild(cancel_save_wrap);
            border.removeChild(comment_text_area);
            let header_remove = document.querySelector('#header_title');
          header_remove.style.border = 'none';
          header_remove.textContent=oldTitle;
          let edit_add = document.querySelectorAll('#comment_edit_id');
          edit_add.forEach(edit =>{
            edit.style.display='';
          });
          let share_remove = document.querySelectorAll('#comment_save_id');
          share_remove.forEach(share =>{
            share.style.display='none';
          });
          for (const editorId in tinymce.editors) {
            if (tinymce.editors.hasOwnProperty(editorId)) {
              const editor = tinymce.editors[editorId];
              // Remove the editor instance
              editor.setContent(oldContent);
              tinymce.remove(editor);
            }
          }
        }
        comment_text_area_save.onclick=function(){
          let newcomment = tinymce.get('comment_text_area_id').getContent();
          if (newcomment==''){
            alert("Please enter some content.");
          }else if(newcomment.includes("&lt;script&gt;") || newcomment.includes("&lt;/script&gt;")){
            alert("This comment is invalid.");
          }else{
            border.removeChild(comment_text_area);
            border.removeChild(cancel_save_wrap);
            handleReply(postID,newcomment,'a',0);
          }
        }
      } else{
        alert("Please log in")
      }
      });

    comment_share.textContent="Share";
    comment_edit.textContent="Edit";
    comment_edited.textContent="Edited";
    comment_save.textContent="Save";
    comment_save.style.display = 'none';



    comment_edit.onclick = function() {
      let textAreas = document.querySelectorAll('.comment_text_area');
      textAreas.forEach(textArea => {
          const parentElement = textArea.closest('.comment_wrapping');
          if (parentElement) {
            parentElement.removeChild(textArea);
          }else{
            const parentElement = textArea.closest('.border');
            parentElement.removeChild(textArea);
            }
        });
        let header_remove = document.querySelector('#header_title');
          header_remove.style.border = 'none';
          header_remove.textContent=oldTitle;
          let edit_add = document.querySelectorAll('#comment_edit_id');
          edit_add.forEach(edit =>{
            edit.style.display='';
          });
          let share_remove = document.querySelectorAll('#comment_save_id');
          share_remove.forEach(share =>{
            share.style.display='none';
          });
          for (const editorId in tinymce.editors) {
            if (tinymce.editors.hasOwnProperty(editorId)) {
              const editor = tinymce.editors[editorId];
              // Remove the editor instance
              editor.setContent(oldContent);
              tinymce.remove(editor);
            }
          }
      let commentSaves = document.querySelectorAll('.cancel_save_wrap');
      // Remove each comment save element from its parent "comment_wrapping" div
      commentSaves.forEach(commentSave => {
          const parentElement = commentSave.closest('.comment_wrapping');
          if (parentElement) {
              parentElement.removeChild(commentSave);
          } else{
            const border = document.querySelector('.border');
            border.removeChild(commentSave);
          }
      });
      const scriptTag = document.createElement('script');
        scriptTag.src = 'https://cdn.tiny.cloud/1/no-api-key/tinymce/5/tinymce.min.js';
        scriptTag.setAttribute('referrerpolicy', 'origin');
        scriptTag.onload = initializeTinyMCEedit; 
        document.head.appendChild(scriptTag);

        const styleTag = document.createElement('style');
        styleTag.textContent = '.tox-notification { display: none !important; }';
        document.head.appendChild(styleTag);
        comment_edit.style.display='none';
        comment_save.style.display = '';
        // post_img.contentEditable = true;
        // post_img.style.border = '1px solid red';
        header_title.contentEditable = true;
        header_title.style.border = '1px solid red';      
        buttons.appendChild(comment_save);
      
        comment_save.onclick = function() {
          var newDescription = tinymce.get('post_img_content').getContent();
          var newTitle = header_title.innerText;
          console.log(newTitle);
          if (newDescription==''){
            alert('Edited post cannot be empty, Delete it instead!');
          }else if(newDescription.includes("&lt;script&gt;") || newDescription.includes("&lt;/script&gt;")){
            alert("This comment is invalid.");
          }else if(newTitle.includes("&lt;script&gt;") || newTitle.includes("&lt;/script&gt;")){
            alert("This title is invalid.");
          }else if(newTitle.includes("<script>") || newTitle.includes("</script>")){
            alert("This title is invalid.");
          }else{
          comment_edit.style.display='';
          comment_save.style.display = 'none';
          // post_img.contentEditable = false;
          post_img.style.border = 'none';
          header_title.contentEditable = false;
          header_title.style.border = 'none';
          oldTitle=newTitle;
          // Save the content of post_img and header_title to variables

          
          handleEditPost(postID,newTitle,newDescription);
          var editDate = Date.now();
          editedSpan.textContent=new Date(editDate).toLocaleString();
          for (const editorId in tinymce.editors) {
            if (tinymce.editors.hasOwnProperty(editorId)) {
              const editor = tinymce.editors[editorId];
              // Remove the editor instance
              // editor.setContent(oldContent);
              tinymce.remove(editor);
            }
          }
          if (peditedDate == '- Not Edited') {
            info.removeChild(buttons);
            edited = document.createElement('p');
            edited.textContent= "Edited ";
            info.appendChild(edited);
            editedSpan = document.createElement('span');
            peditedDate = Date.now();
            editedSpan.textContent=new Date(editDate).toLocaleString();
            info.appendChild(editedSpan);
            info.appendChild(buttons);
          } else{
            editedSpan.textContent=new Date(editDate).toLocaleString();
          }
      
          
        };
      }
      };


    comment_delete.onclick = function() {
        handleDeletePost(postID);
        // let commentDeleteElements = document.querySelectorAll('.content_list'); // Assuming 'content_list' is the class name of the elements you want to delete.
      
        // commentDeleteElements.forEach(function(element) {
        //   element.innerHTML = '';
        // });
      
        // commentDeleteElements = document.querySelectorAll('.comment_align'); // Assuming 'comment_align' is the class name of the elements you want to delete.
      
        // commentDeleteElements.forEach(function(element) {
        //   element.innerHTML = '';
        // });
      
        // const border = document.querySelector('.border'); // Assuming 'border' is the class name of the container element where you want to append the new div.
        // const topDiv = document.createElement('div');
        // const topicDiv = document.createElement('div');
        // topicDiv.classList.add('content_delete');
        // topicDiv.textContent = 'Content Deleted';
        // border.appendChild(topDiv);
        // topDiv.appendChild(topicDiv);
        // topDiv.style.display = 'flex';
        // topDiv.style.justifyContent = 'center';
        // topDiv.style.alignItems = 'center';
        // topDiv.style.position = 'fixed';
        // topDiv.style.top = '50%';
        // topDiv.style.left = '50%';
        // topDiv.style.transform = 'translate(-50%, -50%)';
        
      };


    comment_delete.textContent="Delete";
    if(isCurrUserTheAuthor=="true"){
        buttons.appendChild(comment_delete);
    }
  
    buttons.appendChild(comment_reply);
    // buttons.appendChild(comment_share);
    if(isCurrUserTheAuthor=="true"){
        buttons.appendChild(comment_edit);
    }
    
    

    // buttons.appendChild(comment_save);
    // console.log(preactValue);
    info_list.appendChild(createReaction(prating,preactValue,postID,0,0));
    info.appendChild(buttons);
    topic.appendChild(info);
    info_list.appendChild(topic);
    const buttonschildren = buttons.children;
    for (let i = 0; i < buttonschildren.length; i++) {
        buttonschildren[i].style.display = '';
    }

    const infoChildren = info.children;
    for (let i = 0; i < infoChildren.length; i++) {
        infoChildren[i].style.display = '';
    }
    
    return info_list;
    
}



// new reply / new comment
function postreply(pauthor,ppfp,pdesc,pcount,pid,user,parentID,isLoggedIn,preactValue,createDate,editDate){
  console.log("Received arguments:", pauthor, ppfp, pdesc, pcount, pid, user, parentID, isLoggedIn, preactValue, createDate, editDate);
    let 
    comment_align = document.createElement('div'),
    comment_forum = document.createElement('div'),
    comment_container = document.createElement('div'),
    comment_profile = document.createElement('div'),
    comment_pfp = document.createElement('div'),
    pfp = document.createElement('img'),
    author =document.createElement('p'),
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
    desc =document.createElement('p'),
    
    comment_wrapping = document.createElement('div'),
    comment_cancel = document.createElement('div');
    console.log("pid"+pid);
    desc.id = pid+"here";
    comment_text_area.id = 'comment_text_area_id';
    comment_forum.id=pid;
    comment_align.className = 'comment_align';
    comment_forum.className = 'comment_forum';
    comment_container.className = 'comment_container';
    comment_profile.className = 'comment_profile';
    comment_pfp.className = 'comment_pfp';
    comment_content_desc.className = 'comment_content_desc';
    comment_react.className='comment_react';
    comment_reply.className='comment_reply';
    comment_share.className='comment_share';
    comment_edit.className='comment_edit';
    comment_edited.className='comment_edited';
    comment_save.className='comment_save';
    comment_edit.id ="comment_edit_id";
    comment_save.id = "comment_save_id";
    comment_text_area.className='comment_text_area';
    comment_text_area_save.className='comment_text_area_save';
    comment_wrapping.className='comment_wrapping';
    comment_delete.className='comment_delete';
    comment_cancel.className = 'comment_cancel';

    pfp.src = ppfp;
    comment_pfp.appendChild(pfp)
    author.textContent=pauthor;
    comment_profile.appendChild(comment_pfp);
    comment_profile.appendChild(author);
    comment_container.appendChild(comment_profile);
    desc.innerHTML=pdesc;
    comment_profile.style.cursor = 'pointer';
    if (pcount!=="N/A"){
    comment_profile.onclick = function(){
      window.location.href = `/profile/${pauthor}`;
    }
  } else{
    comment_profile.style.pointerEvents='none';
  }
    comment_content_desc.appendChild(desc);
    comment_delete.textContent="Delete";
    comment_reply.textContent="Reply";
    comment_text_area_save.textContent="Save";
    comment_cancel.textContent="Cancel";
    comment_reply.onclick = function(){
      if (isLoggedIn!=="false"){
        let textAreas = document.querySelectorAll('.comment_text_area');
        // Remove each text area from its parent "comment_wrapping" div
        textAreas.forEach(textArea => {
            const parentElement = textArea.closest('.comment_wrapping');
            if (parentElement) {
            parentElement.removeChild(textArea);
            }else{
            const parentElement = textArea.closest('.border');
            parentElement.removeChild(textArea);
            }
        });
        let header_remove = document.querySelector('#header_title');
          header_remove.style.border = 'none';
          header_remove.textContent=oldTitle;
          let edit_add = document.querySelectorAll('#comment_edit_id');
          edit_add.forEach(edit =>{
            edit.style.display='';
          });
          let share_remove = document.querySelectorAll('#comment_save_id');
          share_remove.forEach(share =>{
            share.style.display='none';
          });
          for (const editorId in tinymce.editors) {
            if (tinymce.editors.hasOwnProperty(editorId)) {
              const editor = tinymce.editors[editorId];
              // Remove the editor instance
              editor.setContent(oldContent);
              tinymce.remove(editor);
            }
          }
        let commentSaves = document.querySelectorAll('.cancel_save_wrap');
        // Remove each comment save element from its parent "comment_wrapping" div
        commentSaves.forEach(commentSave => {
            const parentElement = commentSave.closest('.comment_wrapping');
            if (parentElement) {
            parentElement.removeChild(commentSave);
            } else{
            const parentElement = commentSave.closest('.border');
            parentElement.removeChild(commentSave);
            }
        });
        // comment_text_area.id="editor";

        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://cdn.tiny.cloud/1/no-api-key/tinymce/5/tinymce.min.js';
        scriptTag.setAttribute('referrerpolicy', 'origin');
        scriptTag.onload = initializeTinyMCE; // Call the function inside the onload callback
     // Call the TinyMCE initialization after the script is loaded
        document.head.appendChild(scriptTag);

        const styleTag = document.createElement('style');
        styleTag.textContent = '.tox-notification { display: none !important; }';
        document.head.appendChild(styleTag);

  
        comment_wrapping.appendChild(comment_text_area);
        cancel_save_wrap = document.createElement('div');
        cancel_save_wrap.className='cancel_save_wrap';
        cancel_save_wrap.appendChild(comment_text_area_save);
        cancel_save_wrap.appendChild(comment_cancel);
        comment_wrapping.appendChild(cancel_save_wrap);
        comment_cancel.onclick=function(){
            comment_wrapping.removeChild(cancel_save_wrap);
            comment_wrapping.removeChild(comment_text_area);
            let header_remove = document.querySelector('#header_title');
          header_remove.style.border = 'none';
          header_remove.textContent=oldTitle;
          let edit_add = document.querySelectorAll('#comment_edit_id');
          edit_add.forEach(edit =>{
            edit.style.display='';
          });
          let share_remove = document.querySelectorAll('#comment_save_id');
          share_remove.forEach(share =>{
            share.style.display='none';
          });
          for (const editorId in tinymce.editors) {
            if (tinymce.editors.hasOwnProperty(editorId)) {
              const editor = tinymce.editors[editorId];
              // Remove the editor instance
              editor.setContent(oldContent);
              tinymce.remove(editor);
            }
          }
        }
        comment_text_area_save.onclick=function(){
          console.log("hi");
            let newcomment = tinymce.get('comment_text_area_id').getContent();
            console.log(newcomment);
            if (newcomment==''){
              alert("Please enter some content.");
            }else if(newcomment.includes("&lt;script&gt;") || newcomment.includes("&lt;/script&gt;")){
              alert("This comment is invalid.");
            }else{
            comment_wrapping.removeChild(comment_text_area);
            comment_wrapping.removeChild(cancel_save_wrap);
            handleReply(pid,newcomment,parentID,1);
            }
        }
      }else{
        alert("Please log in")
      }
   
    }
    if (user==pauthor){
      comment_react.appendChild(comment_delete);
    }
    if (pcount!=="N/A"){
      comment_react.appendChild(comment_reply);
    }
    comment_share.textContent="Share";
    // comment_react.appendChild(comment_share);
    comment_edit.textContent="Edit";
    comment_edited.textContent="Edited";
    comment_save.textContent="Save";
    comment_delete.onclick = function() {
        // author.textContent="Deleted";
        // pfp.src="";
        // desc.textContent="Deleted";
        // count.textContent="Deleted";
        handleDeleteComment(pid);
        



    };
    comment_edit.onclick = function() {
      let textAreas = document.querySelectorAll('.comment_text_area');
      textAreas.forEach(textArea => {
          const parentElement = textArea.closest('.comment_wrapping');
          if (parentElement) {
            parentElement.removeChild(textArea);
          } else{
            const parentElement = document.querySelector('.border');
            parentElement.removeChild(textArea);
            }
        });
        let header_remove = document.querySelector('#header_title');
          header_remove.style.border = 'none';
          header_remove.textContent=oldTitle;
          let edit_add = document.querySelectorAll('#comment_edit_id');
          edit_add.forEach(edit =>{
            edit.style.display='';
          });
          let share_remove = document.querySelectorAll('#comment_save_id');
          share_remove.forEach(share =>{
            share.style.display='none';
          });
          for (const editorId in tinymce.editors) {
            if (tinymce.editors.hasOwnProperty(editorId)) {
              const editor = tinymce.editors[editorId];
              // Remove the editor instance
              editor.setContent(oldContent);
              tinymce.remove(editor);
            }
          }
      let commentSaves = document.querySelectorAll('.cancel_save_wrap');
      // Remove each comment save element from its parent "comment_wrapping" div
      commentSaves.forEach(commentSave => {
          let parentElement = commentSave.closest('.comment_wrapping');
          if (parentElement) {
              parentElement.removeChild(commentSave);
          } else{
            parentElement = document.querySelector('.border');
            parentElement.removeChild(commentSave);
          }
      });
      const scriptTag = document.createElement('script');
        scriptTag.src = 'https://cdn.tiny.cloud/1/no-api-key/tinymce/5/tinymce.min.js';
        scriptTag.setAttribute('referrerpolicy', 'origin');
        scriptTag.onload = function() {
          console.log(desc.id);
          initializeTinyMCEeditReply(desc.id);
        };
        document.head.appendChild(scriptTag);

        const styleTag = document.createElement('style');
        styleTag.textContent = '.tox-notification { display: none !important; }';
        document.head.appendChild(styleTag);
        comment_save.style.display = '';
        comment_edit.style.display='none';
        desc.contentEditable = true; 
        // desc.style.border = '1px solid red'; 
        comment_react.appendChild(comment_save);
        // comment_content_desc.appendChild(comment_edited);
        comment_save.onclick=function(){
          var newCommentContent = tinymce.get(desc.id).getContent();
          // console.log("here"+newCommentContent);
          if (newCommentContent==''){
              alert('Edited post cannot be empty, Delete it instead!');
          } else if(newCommentContent.includes("&lt;script&gt;") || newCommentContent.includes("&lt;/script&gt;")){
            alert("This comment is invalid.");
          }else{        
            comment_save.style.display = 'none';
            comment_edit.style.display='';
            desc.contentEditable = false;
            console.log(newCommentContent);
            for (const editorId in tinymce.editors) {
              if (tinymce.editors.hasOwnProperty(editorId)) {
                const editor = tinymce.editors[editorId];
                // Remove the editor instance
                // editor.setContent(oldContent);
                tinymce.remove(editor);
              }
            }
            // desc.style.border = 'none'; 
            //let isEdited = false;
            handleEditComment(pid, newCommentContent ); 
            // console.log(editDate);
            
            if(editDate !==''){
              dates.removeChild(edited);
              dates.removeChild(editedSpan);
            }
              edited = document.createElement('p');
              edited.textContent= "Edited ";
              dates.appendChild(edited);
              editedSpan = document.createElement('span');
              editDate = Date.now();
              editedSpan.textContent=new Date(editDate).toLocaleString();
              dates.appendChild(editedSpan);
        }
      }

    };
    if (user==pauthor){
      comment_react.appendChild(comment_edit);
    }
    let dates = document.createElement('div');
    dates.className= 'comment_dates';
    if (createDate!==''){
    let posted = document.createElement('p');
    posted.textContent= "Posted ";
    dates.appendChild(posted);
    let postedSpan = document.createElement('span');
    postedSpan.textContent=new Date(createDate).toLocaleString();;
    dates.appendChild(postedSpan);
    }
    let edited;
    let editedSpan;
    if (editDate !== '') {
      console.log(editDate);
        edited = document.createElement('p');
        edited.textContent= "Edited ";
        dates.appendChild(edited);
        editedSpan = document.createElement('span');
        editedSpan.textContent=new Date(editDate).toLocaleString();
        dates.appendChild(editedSpan);
    }
    comment_content_desc.appendChild(dates);
    comment_content_desc.appendChild(comment_react);
    comment_container.appendChild(comment_content_desc);
    // console.log(preactValue);
    if (pcount!=="N/A"){
	    comment_forum.appendChild(createReaction(pcount,preactValue,pid,1,0));
    } else{
      comment_forum.appendChild(createReaction(pcount,preactValue,pid,1,1));
    }
    comment_forum.appendChild(comment_container);
    comment_wrapping.appendChild(comment_forum);
    comment_align.appendChild(comment_wrapping);
    comment_align.id = pid;

	desc.setAttribute('align', 'justify');
    return comment_align;

}

function profilePost(pauthor,ppfp,pdesc,pcount,pid,phtml){
    let 
    comment_align = document.createElement('div'),
    comment_forum = document.createElement('div'),
    comment_container = document.createElement('div'),
    comment_profile = document.createElement('div'),
    comment_pfp = document.createElement('div'),
    pfp = document.createElement('img'),
    author =document.createElement('p'),
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
    desc =document.createElement('p'),
    comment_wrapping = document.createElement('div');

    comment_text_area.id = 'comment_text_area_id';

    comment_align.className = 'comment_align';
    comment_forum.className = 'comment_forum';
    comment_container.className = 'comment_container';
    comment_profile.className = 'comment_profile';
    comment_pfp.className = 'comment_pfp';
    comment_content_desc.className = 'comment_content_desc';
    comment_react.className='comment_react';
    comment_like.className='comment_like';
    comment_count.className='comment_count';
    comment_dislike.className='comment_dislike';
    comment_reply.className='comment_reply';
    comment_share.className='comment_share';
    comment_edit.className='comment_edit';
    comment_edited.className='comment_edited';
    comment_save.className='comment_save';
    comment_text_area.className='comment_text_area';
    comment_text_area_save.className='comment_text_area_save';
    comment_wrapping.className='comment_wrapping';
    comment_delete.className='comment_delete';

    pfp.src = ppfp;
    comment_pfp.appendChild(pfp)
    author.textContent=pauthor;
    comment_profile.appendChild(comment_pfp);
    comment_profile.appendChild(author);
    comment_container.appendChild(comment_profile);
    desc.innerHTML=pdesc;
    desc.onclick = function() {
        window.location.href = phtml;
    };
    desc.style.cursor = "pointer";
    comment_content_desc.appendChild(desc);
    comment_react.appendChild(comment_like);
    comment_count.textContent=pcount;
    comment_react.appendChild(comment_count);
    comment_react.appendChild(comment_dislike);
    comment_delete.textContent="Delete";
    comment_reply.textContent="Reply";
    comment_text_area_save.textContent="Save";
    comment_reply.onclick = function(){
        comment_wrapping.appendChild(comment_text_area);
        comment_wrapping.appendChild(comment_text_area_save);
        comment_text_area_save.onclick=function(){
            let text_area_value = document.getElementById('comment_text_area_id');
            let newcomment = text_area_value.value;
            comment_wrapping.removeChild(comment_text_area);
            comment_wrapping.removeChild(comment_text_area_save);
            comment_align.append(postreply(pauthor,ppfp,newcomment,0,pid+.1));
        }
    }
    comment_react.appendChild(comment_delete);
    comment_react.appendChild(comment_reply);
    comment_share.textContent="Share";
    comment_react.appendChild(comment_share);
    comment_edit.textContent="Edit";
    comment_edited.textContent="Edited";
    comment_save.textContent="Save";
    comment_delete.onclick = function() {
        author.textContent="Deleted";
        pfp.src="";
        desc.textContent="Deleted";
        count.textContent="Deleted";
    };
    comment_react.appendChild(comment_edit);
    comment_edit.onclick = function() {
     
        comment_save.style.display = '';
        desc.contentEditable = true; 
        
        comment_react.appendChild(comment_save);
        comment_content_desc.appendChild(comment_edited);
        comment_save.onclick=function(){
            comment_save.style.display = 'none';
            desc.contentEditable = false;
        }
    };
    
    // comment_content_desc.appendChild(comment_react);
    comment_container.appendChild(comment_content_desc);
    comment_forum.appendChild(comment_container);
    comment_wrapping.appendChild(comment_forum);
    comment_align.appendChild(comment_wrapping);
    comment_align.id = pid;
    return comment_align;

}

function handleReply(postID,replyContent,parentID,checker) {
  //const mongoose = require('mongoose');

    if (replyContent) {
      // Send an HTTP request to your server to save the reply
      var requestBody;
      if (checker==0){
         requestBody = {
          content: replyContent,
          parentPostID: postID
        };
      } 
      if (checker==1){
         requestBody = {
          content: replyContent,
          parentPostID: parentID,
          parentCommentID: postID
        };
      } 
      
      fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
        .then(response => response.json()) // Parse the response JSON
        .then(data => {
          // Handle successful reply creation
          console.log(data); // Log the response data for debugging purposes
          for (const editorId in tinymce.editors) {
            if (tinymce.editors.hasOwnProperty(editorId)) {
              const editor = tinymce.editors[editorId];
              // Remove the editor instance
              editor.setContent(oldContent);
              tinymce.remove(editor);
            }
          }
          const commentData = data.data; // Access the nested comment data object
          let border;
          if(commentData.parentCommentID){
            border= '#' + commentData.parentCommentID;
          }else{
            border= document.querySelector('.border');
          }
          let commentElement = postreply(commentData.pauthor, commentData.ppfp, commentData.pdesc, 0, commentData.pid, 
                                commentData.user.username, commentData.parentID, commentData.isLoggedIn, 0, commentData.createDate, '');
          $(border).append(commentElement);
          console.log("commented successfuly!");
        })
        .catch(error => {
          console.error(error);
          // Handle error
        });
    }
  }
function handleDeleteComment(commentID) {
    // Show a confirmation dialog before deleting the commenttastatas
    if (confirm('Are you sure you want to delete this comment?')) {
      // Send an HTTP request to your server to update the commentt data
      fetch(`/api/comment/${commentID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isDeleted: true })
      })
        .then(response => {
          if (response.ok) {
            window.location.reload();
          } else {
            throw new Error('Failed to delete the comment');
          }
        })
        .catch(error => {
          console.error(error);
          // Handle error
        });
    }
}
  
function handleEditComment(commentID, newContent) {
    // const newContent = prompt('Edit your comment content:', currentContent);
  
    if (newContent !== null) {
      // Send an HTTP request to update the post on the server
      const requestBody = {
        content: newContent
      };
  
      fetch(`/api/comment/${commentID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
        .then(response => {
          if (response.ok) {
            for (const editorId in tinymce.editors) {
            if (tinymce.editors.hasOwnProperty(editorId)) {
              const editor = tinymce.editors[editorId];
              // Remove the editor instance
              editor.setContent(oldContent);
              tinymce.remove(editor);
            }
          }
            //return true;
            let date = Date.now();
            
            let comment_dates; //why the fuck is it named like this




          } else {
            throw new Error('Failed to update comment');
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
            //window.location.href = "/post/" + encodeURIComponent(pid);
            window.location.reload();
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

function handleEditPost(postID, newTitle,newDescription) {
  
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
            //const encodedTitle = encodeURIComponent(newTitle); // Assuming newTitle is the updated title
            //window.location.replace(`/post/${encodedTitle}`);
            // window.location.reload();
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

  