import User from "../../models/User.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";

// GET /api/users — seeded users for the "acting as" switcher.
export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: 1 }).select("name avatar").lean();
  sendSuccess(res, users);
});

export default listUsers;
