const UserModel = require("../models/user.model");

exports.addFriend = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user._id;
  console.log(`friend: ${friendId} user: ${userId}`);
  try {
    if (userId === friendId)
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend" });
    const user = await UserModel.findById(userId);
    const friend = await UserModel.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }
    if (user.friends.includes(friendId))
      return res.status(400).json({ message: "Friend already added" });
    if (user.friendRequests.includes(friendId)) {
      user.friends.push(friendId);
      friend.friends.push(userId);
      user.friendRequests = user.friendRequests.filter(
        (id) => friendId !== id.toString()
      );
      friend.friendRequests = friend.friendRequests.filter(
        (id) => userId !== id.toString()
      );
      await user.save();
      await friend.save();
      return res.status(200).json({ message: "Friend request accepted" });
    }
    if (!friend.friendRequests.includes(userId)) {
      friend.friendRequests.push(userId);
      await friend.save();
      return res.status(200).json({ message: "Friend request sent" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while adding friend" });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;
    const user = await UserModel.findById(userId);
    const friend = await UserModel.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }
    if (!user.friendRequests.includes(friendId)) {
      return res
        .status(400)
        .json({ message: "No friend request from this user" });
    }
    user.friends.push(friendId);
    friend.friends.push(userId);
    user.friendRequests = user.friendRequests.filter(
      (id) => friendId !== id.toString()
    );
    friend.friendRequests = friend.friendRequests.filter(
      (id) => userId !== id.toString()
    );
    await user.save();
    await friend.save();
    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error while accepting friend request",
    });
  }
};
