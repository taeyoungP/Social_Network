const User = require('../models/User');

module.exports = {
    // get all users
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    // get single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // create a new user
    createUser(req, res) {
        User.create(req.body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.status(500).json(err));
    },
    // update a user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // remove a user
    removeUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // add new friend to friendlist
    addNewFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.body } },
            { runValidators: true, new: true }
          )
            .then((video) =>
              !video
                ? res.status(404).json({ message: 'No User with this id!' })
                : res.json(video)
            )
            .catch((err) => res.status(500).json(err));
    },
    // remove a friend from friendlist
    removeFriend(req, res){
        User.findOneAndUpdate(
            { _id: req.params.videoId },
            { $pull: { friends: { _id: req.params.friendId } } }, //friend uses User model, so use _id matches to friendId
            { runValidators: true, new: true }
          )
            .then((video) =>
              !video
                ? res.status(404).json({ message: 'No video with this id!' })
                : res.json(video)
            )
            .catch((err) => res.status(500).json(err));
    },
};

/*
// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).put(updateUser).delete(removeUser);

// /api/users/:userId/friends/
router.route(':userId/friends/:friendId').post(addNewFriend);

// /api/users/:userId/friends/:friendId
router.route(':userId/friends/:friendId').delete(removeFriend);
*/