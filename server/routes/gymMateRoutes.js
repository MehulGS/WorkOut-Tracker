const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  getGymGroups,
  getUserDetails,
  removeMember,
  createGymGroup,
  inviteMembersToGroup,
} = require("../controller/gymMateController");
const {
  createGroupBodyPart,
  createGroupExercise,
  logGroupSet,
  getGroupBodyPartsWithExercises,
  getGroupExerciseOverview,
  deleteGroupExercise,
} = require("../controller/groupExerciseController");

const router = express.Router();

router.get("/groups", auth, getGymGroups);
router.get("/user/:id", auth, getUserDetails);

router.post("/groups", auth, createGymGroup);
router.post("/groups/:roomId/invite", auth, inviteMembersToGroup);

router.post("/groups/:roomId/body-part", auth, createGroupBodyPart);
router.post("/groups/:roomId/exercise", auth, createGroupExercise);
router.post("/groups/:roomId/set", auth, logGroupSet);
router.get("/groups/:roomId/body-parts", auth, getGroupBodyPartsWithExercises);
router.get("/groups/:roomId/exercise/:exerciseId/overview", auth, getGroupExerciseOverview);
router.delete("/groups/:roomId/exercise/:exerciseId", auth, deleteGroupExercise);
router.delete("/groups/:roomId/member/:memberId", auth, removeMember);

module.exports = router;
