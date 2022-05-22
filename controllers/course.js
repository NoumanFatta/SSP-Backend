import { Router } from "express";
import { body, validationResult } from "express-validator";
import Course from "../models/course.js";
import Form from "../models/form.js";
import { isThisAdmin, tokenExtractor } from "../utils/authHelpers.js";
import {
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
router.post("/applyCourse", tokenExtractor, async (req, res) => {
  try {
    const { courseId } = req.body;
    const { user } = req;
    const isApplied = await Course.findOne({
      _id: courseId,
      appliedStudents: user.id,
    });
    if (isApplied) {
      return res
        .status(409)
        .send({ message: "you have already applied for this course" });
    }
    await Course.findOneAndUpdate(
      { _id: courseId },
      { $push: { appliedStudents: user.id } },
      { new: true }
    );
    const course = new Form({ course: courseId, user: user.id });
    await course.save();
    res.send({ message: "Successfully applied" });
    // sendResponse(res, 201, { form });
  } catch (error) {
    return serverError(error, res);
  }
});
// router.post("/applyCourse/:courseId", tokenExtractor, async (req, res) => {
//   try {
//     const {
//       name,
//       city,
//       fatherName,
//       email,
//       phone,
//       cnic,
//       fatherCnic,
//       dob,
//       gender,
//       address,
//       lastQualification,
//       image,
//     } = req.body;
//     const { courseId } = req.params;
//     const { user } = req;
//     if (req.isAdmin) {
//       return badRequest(res, { error: "Admin can not  apply" });
//     }
//     let course = await Course.findById(courseId);
//     let student = await Auth.findById(user.id);
//     if (!student) {
//       return badRequest(res, { error: "Student Not Found" });
//     }
//     let alreadyAppliedStudent = await Auth.findOne({
//       appliedCourses: { $in: courseId },
//     });
//     if (!!alreadyAppliedStudent) {
//       return badRequest(res, { error: "Already applied in course" });
//     }
//     let alreadyAppliedCourse = await Course.findOne({
//       appliedStudents: { $in: user.id },
//     });
//     if (!!alreadyAppliedCourse) {
//       return badRequest(res, { error: "Already applied in course" });
//     }
//     if (!course) {
//       return badRequest(res, { error: "Course Not Found" });
//     }

//     const form = await Form.create({
//       city,
//       fatherName,
//       email,
//       phone,
//       cnic,
//       fatherCnic,
//       dob,
//       gender,
//       address,
//       lastQualification,
//       image,
//       name,
//       course: courseId,
//     });

//     // updating student applied courses
//     student.appliedCourses.addToSet(courseId);
//     student.save();

//     // udpating course
//     course.appliedStudents.addToSet(student.id);
//     course.save();

//     sendResponse(res, 201, { form });
//   } catch (error) {
//     return serverError(error, res);
//   }
// });

// ROUTE : 4 update course status
router.get("/students", tokenExtractor, isThisAdmin, async (req, res) => {
  try {
    const result = await Form.find()
      .populate({ path: "user" , select: "email roleNo"})
      .populate({ path: "course", select: "title" });
    sendResponse(res, 201, { result });
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
      const { status } = req.body;
      const { courseId } = req.params;
      const newCourse = {};
      if (status != undefined) newCourse.status = status;
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
