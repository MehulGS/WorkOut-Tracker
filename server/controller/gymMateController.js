const User = require("../model/User");
const GymRoom = require("../model/GymRoom");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const INVITE_REGISTER_URL = "https://work-out-tracker-eight.vercel.app/auth/register";

const createGymGroup = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { name } = req.body || {};

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const room = await GymRoom.create({
      name: name.trim(),
      owner: userId,
      members: [userId],
      pendingInvites: [],
    });

    return res.status(201).json(room);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create group", error: error.message });
  }
};

const inviteMembersToGroup = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { roomId } = req.params;
    let { email, emails, name } = req.body || {};

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    const room = await GymRoom.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (room.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only owner can invite members" });
    }

    const rawEmails = [];

    if (email) rawEmails.push(email);
    if (Array.isArray(emails)) rawEmails.push(...emails);

    if (!rawEmails.length) {
      return res
        .status(400)
        .json({ message: "At least one email is required" });
    }

    const normalizedEmails = [
      ...new Set(
        rawEmails
          .map((e) => String(e).trim().toLowerCase())
          .filter(Boolean)
      ),
    ];

    const inviter = await User.findById(userId).select("name email");

    const results = [];

    for (const mail of normalizedEmails) {
      const existingUser = await User.findOne({ email: mail });

      if (existingUser) {
        const alreadyMember = room.members.some(
          (m) => m.toString() === existingUser._id.toString()
        );

        if (!alreadyMember) {
          room.members.push(existingUser._id);
        }

        results.push({
          email: mail,
          status: "added-member",
          userId: existingUser._id,
        });
      } else {
        if (!room.pendingInvites.includes(mail)) {
          room.pendingInvites.push(mail);
        }

        const inviterName = name || inviter?.name || "Your friend";

        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: mail,
          subject: "You are invited to join Gym Room",
          text: `${inviterName} has invited you to join their gym room. Register here: ${INVITE_REGISTER_URL}`,
        });

        results.push({ email: mail, status: "invited-pending" });
      }
    }

    await room.save();

    return res.status(200).json({
      message: "Invites processed",
      roomId: room._id,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to invite members",
      error: error.message,
    });
  }
};

const getGymGroups = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const rooms = await GymRoom.find({
      $or: [{ owner: userId }, { members: userId }],
    })
      .populate("owner", "name email image")
      .populate("members", "name email image");

    const response = rooms.map((room) => ({
      _id: room._id,
      name: room.name,
      owner: room.owner,
      totalMembers: room.members ? room.members.length : 0,
      members: room.members || [],
      createdAt: room.createdAt,
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch gym groups", error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const targetUserId = req.params?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!targetUserId) {
      return res.status(400).json({ message: "User id is required" });
    }

    const user = await User.findById(targetUserId).select(
      "name email image gender height weight BMI age dateOfBirth gymTiming createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user details", error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { roomId, memberId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roomId || !memberId) {
      return res
        .status(400)
        .json({ message: "roomId and memberId are required" });
    }

    const room = await GymRoom.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (room.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only owner can remove members from this group" });
    }

    const beforeCount = room.members.length;
    room.members = room.members.filter(
      (m) => m.toString() !== memberId.toString()
    );

    if (room.members.length === beforeCount) {
      return res.status(404).json({ message: "Member not found in group" });
    }

    await room.save();

    return res
      .status(200)
      .json({ message: "Member removed from group successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove member from group",
      error: error.message,
    });
  }
};

module.exports = {
  getGymGroups,
  getUserDetails,
  removeMember,
  createGymGroup,
  inviteMembersToGroup,
};
