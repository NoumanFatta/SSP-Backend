import { body, validationResult } from "express-validator";
import Leave from "../models/leave.js";
import { isThisAdmin, tokenExtractor } from "../utils/authHelpers.js";
import { sendResponse, serverError } from "../utils/serverResponse.js";
import router from "./course.js";
import multer from "multer";

// ROUTE : 1 POST ADD LEAVE APPLICATION
router.post(
  "/addLeave",
  tokenExtractor,
  multer().single("leaveImage"),
  [
    //validation
    body("subject", "Subject is requrired").notEmpty(),
    body("description", "Description is required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return badRequest(res, { error: errors.array() });
    }
    try {
      const { subject, description } = req.body;
      if (req.file) {
        const mimeType = req.file.mimetype;
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const image = `data:${mimeType};base64,${b64}`;
        let leave = await Leave.create({
          user: req.user.id,
          subject,
          description,
          image,
        });
        return sendResponse(res, 201, { leave });
      } else {
        let leave = await Leave.create({
          user: req.user.id,
          subject,
          description,
        });
        return sendResponse(res, 201, { leave });
      }
    } catch (error) {
      return serverError(error, res);
    }
  }
);

// ROUTE : 2 Get request status update
router.post(
  "/updateLeave/:leaveId",
  tokenExtractor,
  isThisAdmin,
  async (req, res) => {
    try {
      const { leaveId } = req.params;
      const { response } = req.body;
      const result = await Leave.findOneAndUpdate(
        { _id: leaveId },
        { status: response },
        { new: true }
      );
      // const { user } = req;
      // let leave = await Leave.findById(leaveId);
      res.send(result);
      // leave.status = response;
      // leave.save();
      // leave.updatedBy = user.id;
      // leave.save();
      // sendResponse(res, 201, { message: "Response has saved" });
    } catch (error) {
      return serverError(error, res);
    }
  }
);

// ROUTE : 3 Get all applications
router.get("/getLeaves", tokenExtractor, isThisAdmin, async (req, res) => {
  try {
    let leaves = await Leave.find({ status: "pending" })
      .populate({ path: "user", select: "name email fullName fatherName" })
      .exec();
    sendResponse(res, 200, { leaves });
  } catch (error) {
    return serverError(error, res);
  }
});

// ROUTE : 4 Get my requests
router.get("/getMyLeaves", tokenExtractor, async (req, res) => {
  try {
    const { user } = req;
    let leaves = await Leave.find({ user: user.id });
    sendResponse(res, 200, { leaves });
  } catch (error) {
    return serverError(error, res);
  }
});

export default router;
