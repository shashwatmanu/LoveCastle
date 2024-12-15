import express from "express";
import upload from "../helpers/multer.js";

import { updateProfile, getProfiles, handleSwipe, getUserMatches, handleMatchResult, unlockChallenge, sendDirectChallenge, respondToChallenge, unmatchUsers, fetchChallenges } from "../controllers/user.controllers.js";


const router = express.Router();

router.put(
  "/update-profile",
  upload.array("photos", 3),
  updateProfile
);

router.get("/fetch-profiles", getProfiles);

router.post("/handle-swipe", handleSwipe);

router.get('/matches', getUserMatches)

router.get('/challenges', fetchChallenges)

router.post('/post-game', handleMatchResult)

router.post("/unlock-challenge", unlockChallenge);

router.post("/send-challenge", sendDirectChallenge);

router.post("respond-challenge", respondToChallenge);

router.post("unmatch", unmatchUsers);

  

export default router;
