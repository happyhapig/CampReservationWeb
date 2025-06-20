const User = require('../models/model_user.js');
const { getCollection } = require("../db/db");
const collectionUser = () => getCollection("user");

exports.handleGuestLogin = async (req, res) => {
  try {
    const { guestId } = req.body;

    if (!guestId) {
      return res.status(400).json({ error: "guestId is required" });
    }

    const userCollection = collectionUser();

    let user = await userCollection.findOne({ guestId });

    if (!user) {
      const result = await userCollection.insertOne({
        type: 'guest',
        guestId,
        createdAt: new Date(),
        lastLoginAt: new Date()
      });

      user = await userCollection.findOne({ _id: result.insertedId });
    } else {
      await userCollection.updateOne(
        { _id: user._id },
        { $set: { lastLoginAt: new Date() } }
      );
    }

    res.json({
      userId: user._id,
      type: user.type,
      message: "Guest login successful"
    });

  } catch (error) {
    console.error("Guest login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.handleGoogleLogin = async (req, res) => {
  const { googleId, email, name } = req.body;

  const userCollection = collectionUser();

  try {
    let user = await userCollection.findOne({ googleId });

    if (!user) {
      const result = await userCollection.insertOne({
        type: 'google',
        googleId,
        email,
        name,
        createdAt: new Date(),
        lastLoginAt: new Date(),    
      });

      user = await userCollection.findOne({ _id: result.insertedId });

    } else {
      await userCollection.updateOne(
        { _id: user._id },
        { $set: { lastLoginAt: new Date() } }
      );
    }

    return res.status(200).json({
      userId: user._id,
      type: user.type,
      message: 'Google login successful',
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};