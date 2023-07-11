# MCO1 Specs 2 (Forum)
Main/Home page: index.html
Grp Members:
Cabrera, Jean
Dy, Sealtiel
Lu, Bentley
Ong, Camron

### Hardcoded Usernames and Passwords Info:
Usernames:
1. denial
1. Ecola
2. Kinkey
4. Matrix
5. poop bandit

Password: `password`         (same password for all hardcoded users)


Note that both usernames and password(s) are case-sensitive!

#### Things to note:
1. Sometimes an error will occcur due to form interaction, wherein the url would have a `?` at the end. This is believed to be an issue with HTML forms and will "hopefully" be fixed via backend.
2. New users can sign up and log in, but only the 5 hardcoded users may post/reply/edit/delete/edit their profile as of this MCO.
3. Logins will also only work on the current webpage. For instance, user `denial` can log in on the index, but s/he would need to log in again if they were to move to a different html page of the project. This will also be properly implemented in the future when the backend can be implemented.
Basically, problems that heavily require external data will be fully implemented in MCO2.

## --End of README--

<br /><br /><br /><br /><br />



<br /><br /><br /><br /><br />
# 
# CCAPDEV MCO Specifications
## Forum Web Application
The following describes the features of a forum web application. Groups may choose to either design the forum web application as a general-interest forum or one that is more catered towards a specific interest group. The minimum features required to be implemented for this project is as follows:
### View all posts
- Upon visiting the web page, an unregistered visitor may see the 15-20 most recently* uploaded post titles and a post description snippet. The user can see the next set of uploaded posts, it is up to the group whether to implement this in the same (auto-load) or another page. Clicking the post title will let the user view the post and the comments (see: view a post).
- The user may also see the most popular post based on a calculated ranking.

### Register
- A visitor must register if they want to post or comment. Here, a visitor must enter their username and their password.
### View a user profile
- Each user has their own page which shows their profile publicly. On the same page, a visitor may see the user’s username, profile picture, and a short description. They may also see a portion of the user’s latest posts and comments. The visitor may opt to see the rest of the posts and comments of the user.
### Edit Profile
- A user that is logged in may edit their user profile, wherein they can add / modify a profile picture, and provide a short description (can be left empty).
### Login
- After registering properly, a visitor may log-in. Upon logging in, the user can start posting and commenting. The user is given the option to be “remembered” by the website. When the user chooses this option, every log in and visit to the website will extend their “remember” period by 3 weeks.
### Logout
- The user may log out from their account. This should cut short the “remember” period if it exists, and clears any session-related data.
### Post
- A user may make a text post. They must give a title for the post, and the body of the post. Additional points will be given for allowing markup (e.g., rich text editing) without the risk of cross site-scripting.
### View a post
- A user may view any post they have a link to. This will load the title, the body of the post, and the comments of the post. 
### Comment
- A user can comment on any post, including their own. They may also reply to another user’s comments, and the comments can nest indefinitely.
### Edit / Delete a post
- The owner of the post may edit their posts at any point. Edited posts should have an indication that it has been edited.
- The owner of the post may delete their post as well.
### Edit / Delete a comment
- The owner of the comment may edit their comments at any point. Edited comments should have an indication that it has been edited.
- The owner of the comment may delete their comment.
### Upvote / Downvote
- A user can upvote / downvote a post or a comment (including their own) once.
### Search
- A visitor/user can search for posts by similarities in the title or the post body. By entering a search phrase/word, all posts containing it will appear as results.
### General
- Good user experience. Visitors can easily navigate without help, all information is easy to access. Good visual design. Design suits the theme of the application, and is cohesive and consistent across the whole application


Jamboard: https://jamboard.google.com/d/1IdXhSRwtLdnWCnfgTGK25O5eCv7DrRArRAx1RUriSQc/edit?usp=sharing


