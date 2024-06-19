import express from "express";
import dotenv from "dotenv";
import usersController from "../controller/usersController.mjs";
import passport from "../strategies/auth.mjs";
import { isUser, isAdmin } from "../middleware/roleCheck.mjs";
import jwt from "jsonwebtoken";
import { loginValidationSchema } from "../validators/userValidator.mjs";
import { validate } from "../middleware/schemaValidator.mjs";
import { userValidationSchema } from "../validators/userValidator.mjs";
import { validationResult } from "express-validator";
import { param } from "express-validator"; 

dotenv.config();

const router = express.Router();

router.post(
  "/register",
  userValidationSchema,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  usersController.createUser
);

router.post(
  "/login",
  validate(loginValidationSchema),
  passport.authenticate("local", { session: false }),
  isUser,
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, name: req.user.name, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Logged", token });
  },
  usersController.login
);


router.get("/my-procedures/:userId", usersController.getUserProcedures);

router.get(
  "/:id", 
  isUser, 
  validate([param("id").isInt().withMessage("ID must be an integer")]), 
  usersController.getprocedureDetails
);


router.delete("/:registrationId", usersController.cancelRegistration);


export default router;
