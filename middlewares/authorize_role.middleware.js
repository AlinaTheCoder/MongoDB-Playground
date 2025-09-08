export default async function authorize_role(req, res, next) {
  try {
    const user = req.user;
    const role = user.role;
    if (role === "admin") {
      req.user = user;
      next();
      return;
    }
    return res.status(401).json({
      message: `Unauthorized to acess the resourse!`,
    });
  } catch (error) {
    console.log(`Error while authorizing the role ${error.message}`);
    res.status(500).json({
      message: "Server Error while authorizing the role!",
    });
  }
}


