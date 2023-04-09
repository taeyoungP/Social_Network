const User = require('../models/User');
const Thought = require('../models/Thought');

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
            .populate({ path: 'thoughts', select: '-__v' })
            .populate({ path: 'friends', select: '-__v' })
            //.populate('thoughts')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err)
            });
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
    // https://stackoverflow.com/questions/70398602/mongoose-deletemany-using-id-on-nodejs
    // https://stackoverflow.com/questions/18566590/remove-multiple-documents-from-mongo-in-a-single-query
    removeUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: 'No user with that ID' });
                }
                const thoughtList = user.thoughts.map((thought) => thought._id); //get and create arrayList of thoughts ids of that user
                return Thought.deleteMany({ _id: { $in: thoughtList } }) //delete thoughts that are 
                    .then(() =>
                        user.delete() //after deleting all related thoughts, then finally delete that user
                    );
            })
            .then(() => res.json({ message: 'User removed' }))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err)
            });
    },
    // add new friend to friendlist
    addNewFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No User with this id!' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // remove a friend from friendlist
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } }, //friend uses User model, so use _id matches to friendId
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No User with this id!' })
                    : res.json({ message: 'Friend removed' })
            )
            .catch((err) => res.status(500).json(err));
    },
};