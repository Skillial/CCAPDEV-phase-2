MCO2 Specs 2 (Forum) (.txt version)
Grp Members:
Cabrera, Jean
Dy, Sealtiel
Lu, Bentley
Ong, Camron

Please do run an `npm i` before running `node index.js` or `nodemon index.js` (if you have nodemon).
(necessary to install all the node modules (since the folder was included in the .gitignore) )

http://localhost:3000 or http://localhost:3000/index will both lead to the homepage.


Login information (though you can make your own account(s) as well)
Format: <Username> - <Password>
1. JingLiu  - Password1
2. Paimon   - 1mpacT
3. Serval   - L4ndau
4. NotSeele - Password1
5. Clara    - Sv4rog
6. iMissHer - IReallyMissHer1
Note that both usernames and passwords are case-sensitive.

Note also that when creating an account (or editing account information):
1. Usernames must only contain alphanumeric characters.
2. Passwords should be 6 characters long, containing at least one uppercase, lowercase, and number in it.

Note also, that caching is implemented in the /index route. It's set to expire every minute, and should be refreshing when new posts/reacts are made, and when reacts are changed (vote up to down, etc). Post edits by other users (ie, user A is logged in, user B edits a post) will not make user A's cache expire automatically.

PROFILE PICTURES WILL ONLY 100% WORK IN GOOGLE CHROME. 

