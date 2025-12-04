const User = require("../model/User");
const GymRoom = require("../model/GymRoom");
const BodyPart = require("../model/BodyPart");
const Exercise = require("../model/Exercise");
const SetLog = require("../model/SetLog");
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

const deleteGymGroup = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { roomId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    const room = await GymRoom.findById(roomId).select("owner");

    if (!room) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (room.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only owner can delete this group" });
    }

    // Clean up related group data
    await Promise.all([
      BodyPart.deleteMany({ gymRoom: roomId }),
      Exercise.deleteMany({ gymRoom: roomId }),
      SetLog.deleteMany({ gymRoom: roomId }),
      GymRoom.findByIdAndDelete(roomId),
    ]);

    return res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete group",
      error: error.message,
    });
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
        const inviterEmail = inviter?.email;

        const html = `
          <div style="margin:0;padding:0;background-color:#ffffff;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#ffffff;padding:24px 0;">
              <tr>
                <td align="center" style="padding:0 12px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:520px;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;">
                    <tr>
                      <td style="padding-bottom:16px;border-bottom:1px solid #e5e7eb;">
                        <h1 style="margin:0;font-size:20px;font-weight:600;color:#111827;">You have been invited to a Gym Room</h1>
                        <p style="margin:8px 0 0;font-size:13px;color:#4b5563;">
                          ${inviterName} has invited you to join their workout group${room.name ? ` <strong style="color:#111827;">${room.name}</strong>` : ""}.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top:16px;">
                        <p style="margin:0 0 12px;font-size:13px;color:#374151;">
                          Join the group to track workouts together, share progress and stay consistent with your training.
                        </p>
                        <p style="margin:0 0 20px;font-size:13px;color:#4b5563;">
                          Click the button below to create your account and join the room.
                        </p>
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
                          <tr>
                            <td align="center" style="border-radius:999px;background-color:#10b981;border:1px solid #059669;">
                              <a href="${INVITE_REGISTER_URL}" style="display:inline-block;padding:10px 22px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;">
                                Join Gym Room
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin:0 0 8px;font-size:11px;color:#6b7280;">
                          If the button doesn't work, copy and paste this link into your browser:
                        </p>
                        <p style="margin:0 0 16px;font-size:11px;color:#4b5563;word-break:break-all;">
                          ${INVITE_REGISTER_URL}
                        </p>
                        ${inviterEmail
                          ? `<p style="margin:0;font-size:11px;color:#6b7280;">This invite was sent to you by <strong style="color:#111827;">${inviterName}</strong> (${inviterEmail}).</p>`
                          : `<p style="margin:0;font-size:11px;color:#6b7280;">This invite was sent to you by <strong style="color:#111827;">${inviterName}</strong>.</p>`
                        }
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top:16px;border-top:1px solid #e5e7eb;">
                        <p style="margin:0;font-size:10px;color:#9ca3af;text-align:center;">
                          You're receiving this email because someone added you as a potential member of a Gym Room.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: mail,
          subject: room.name
            ? `You are invited to join "${room.name}" on Gym Room`
            : "You are invited to join a Gym Room",
          text: `${inviterName} has invited you to join their gym room. Register here: ${INVITE_REGISTER_URL}`,
          html,
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
  deleteGymGroup,
};
