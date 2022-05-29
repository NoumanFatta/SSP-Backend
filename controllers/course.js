import { Router } from "express";
import { body, validationResult } from "express-validator";
import Course from "../models/course.js";
import Form from "../models/form.js";
import { isThisAdmin, tokenExtractor } from "../utils/authHelpers.js";
import { v4 as uuidv4 } from "uuid";

import {
  alreadyExists,
  badRequest,
  sendResponse,
  serverError,
} from "../utils/serverResponse.js";

const router = Router();

// ROUTE : 1 POST ADD COURSE
router.post(
  "/auth/addCourse",
  tokenExtractor,
  isThisAdmin,
  [
    //validation
    body("courseTitle", "Course Title is requrired").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return badRequest(res, { error: errors.array() });
    }
    try {
      const {
        body: { title, status },
        user,
      } = req;
      let course = await Course.findOne({ title });
      if (course) {
        return badRequest(res, { error: "Name already assigned to a course" });
      }
      course = await Course.create({
        title,
        status,
        admin: user.id,
      });
      sendResponse(res, 201, { data: course });
    } catch (error) {
      return serverError(error, res);
    }
  }
);

// ROUTE : 2 Get Courses

router.get("/getCourses", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return badRequest(res, { error: errors.array() });
  }
  try {
    const courses = await Course.find();
    sendResponse(res, 200, { courses });
  } catch (error) {
    return serverError(error, res);
  }
});

// ROUTE : 3 Apply in course
router.post("/applyCourse", async (req, res) => {
  try {
    let roleNumber;
    const getLastRoleNumber = await Form.findOne().sort({ _id: -1 }).limit(1);
    if (getLastRoleNumber?.roleNumber) {
      roleNumber = Number(getLastRoleNumber.roleNumber) + 1;
    } else {
      roleNumber = 1;
    }
    const form = new Form({ ...req.body, roleNumber });
    const result = await form.save();
    return res.send(result);
  } catch (error) {
    return alreadyExists(res, { error: error.message });
  }
});


router.get("/students", tokenExtractor, isThisAdmin, async (req, res) => {
  try {
    const result = await Form.find()
      .populate({ path: "course" })
      .select({ _id: 0, __v: 0 });
    sendResponse(res, 201, result);
  } catch (error) {
    return serverError(error, res);
  }
});
router.post(
  "/auth/updateCourse/:courseId",
  tokenExtractor,
  isThisAdmin,
  async (req, res) => {
    try {
      const { status,title } = req.body;
      const { courseId } = req.params;
      const newCourse = {};
      if (status != undefined) newCourse.status = status;
      if (title != undefined) newCourse.title = title;
      let course = await Course.findByIdAndUpdate(
        courseId,
        { $set: newCourse },
        { new: true }
      );
      sendResponse(res, 201, { course });
    } catch (error) {
      return serverError(error, res);
    }
  }
);

export default router;
