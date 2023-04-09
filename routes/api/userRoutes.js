const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  removeUser,
  addNewFriend,
  removeFriend,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).put(updateUser).delete(removeUser);

// /api/users/:userId/friends/
router.route('/:userId/friends/:friendId').post(addNewFriend).delete(removeFriend);

// /api/users/:userId/friends/:friendId
//router.route(':userId/friends/:friendId').delete(removeFriend);

module.exports = router;