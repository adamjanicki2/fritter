# Fritter

## API route Documentation

### New endpoints

#### `GET /api/comments?parentId=PARENTID` - Get all comments under a parent

**Returns:**

- An array of all the comments on the given parent

**Throws**

- `400` if no parentId given

#### `POST /api/comments` - Post a comment

**Body:**

- `content` _{string}_ - The content of the comment
- `parentId` _{string}_ - The id of the parent
- `parentType` _{"comment" | "freet"}_ the type of parent

**Returns**

- A success message
- A object with the created comment

**Throws**

- `400` if incorrent parent type supplied
- `403` if user not logged in
- `404` if parent does not exist
- `413`if content is too long

#### `DELETE /api/comments?commentId=COMMENTID` - Delete an existing comment

**Returns**

- A success message

**Throws**

- `400` if no commentId supplied

---

#### `GET /api/followers?userId=USERID` - Get follower info for a user

**Returns**

- Follower info for the given user; i.e. number of followers and followees

**Throws**

- `400` if userId not supplied

#### `POST /api/followers` - Follow a user

**Body**

- `follower` _{string}_ - the id of the follower
- `followee` _{string}_ - the id of the followee

**Returns**

- the newly created follower entry

**Throws**

- `403` if user not logged in
- `404` if if user a already follows user b

#### `DELETE /api/followers?followerId=FOLLOWERID` - delete a follower

**Returns**

- a success message

**Throws**

- `403` if user not logged in
- `400` if no followerId supplied

---

#### `GET /api/likes?parentId=PARENTID` - check if current user has liked an item

**Returns**

- boolean whether or not the current user has liked the item

**Throws**

- `400` if parentId not provided
- `403` if user not signed in
- `404` if parent does not exist

#### `POST /api/likes` - create a new like

**Body**

- `parentId` _{string}_ - the id of the item to like
- `parentType` _{"comment" | "freet"}_ - the type of parent

**Returns**

- the newly created like

**Throws**

- `403` if user not logged in
- `400` if incorrect parentType supplied
- `404` if parent does not exist

#### `DELETE /api/likes?likeId=LIKEID` - delete a like

**Returns**

- a success message

**Throws**

- `403` if user not logged in
- `400` if no likeId supplied

---

#### `GET /api/flags?parentId=PARENTID` - check if current user has flagged an item

**Returns**

- boolean whether or not the current user has flagged the item

**Throws**

- `400` if parentId not provided
- `403` if user not signed in
- `404` if parent does not exist

#### `POST /api/flags` - create a new flag

**Body**

- `parentId` _{string}_ - the id of the item to flag
- `parentType` _{"comment" | "freet"}_ - the type of parent

**Returns**

- the newly created flag

**Throws**

- `403` if user not logged in
- `400` if incorrect parentType supplied
- `404` if parent does not exist

#### `DELETE /api/flags?flagId=FLAGID` - delete a flag

**Returns**

- a success message

**Throws**

- `403` if user not logged in
- `400` if no flagId supplied

---

#### `GET /api/goodSportScores` - get the signed-in user's good sport score

**Returns**

- a user's good sport score

**Throws**

- `403` if user is not logged in

---

### Starter code endpoints

#### `GET /`

This renders the `index.html` file that will be used to interact with the backend

#### `GET /api/freets` - Get all the freets

**Returns**

- An array of all freets sorted in descending order by date modified

#### `GET /api/freets?author=USERNAME` - Get freets by author

**Returns**

- An array of freets created by user with username `author`

**Throws**

- `400` if `author` is not given
- `404` if `author` is not a recognized username of any user

#### `POST /api/freets` - Create a new freet

**Body**

- `content` _{string}_ - The content of the freet

**Returns**

- A success message
- A object with the created freet

**Throws**

- `403` if the user is not logged in
- `400` If the freet content is empty or a stream of empty spaces
- `413` If the freet content is more than 140 characters long

#### `DELETE /api/freets/:freetId?` - Delete an existing freet

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
- `403` if the user is not the author of the freet
- `404` if the freetId is invalid

#### `PUT /api/freets/:freetId?` - Update an existing freet

**Body**

- `content` _{string}_ - The new content of the freet

**Returns**

- A success message
- An object with the updated freet

**Throws**

- `403` if the user is not logged in
- `404` if the freetId is invalid
- `403` if the user is not the author of the freet
- `400` if the new freet content is empty or a stream of empty spaces
- `413` if the new freet content is more than 140 characters long

#### `POST /api/users/session` - Sign in user

**Body**

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with user's details (without password)

**Throws**

- `403` if the user is already logged in
- `400` if username or password is not in correct format format or missing in the req
- `401` if the user login credentials are invalid

#### `DELETE /api/users/session` - Sign out user

**Returns**

- A success message

**Throws**

- `403` if user is not logged in

#### `POST /api/users` - Create an new user account

**Body**

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with the created user's details (without password)

**Throws**

- `403` if there is a user already logged in
- `400` if username or password is in the wrong format
- `409` if username is already in use

#### `PUT /api/users` - Update a user's profile

**Body** _(no need to add fields that are not being changed)_

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with the update user details (without password)

**Throws**

- `403` if the user is not logged in
- `400` if username or password is in the wrong format
- `409` if the username is already in use

#### `DELETE /api/users` - Delete user

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
