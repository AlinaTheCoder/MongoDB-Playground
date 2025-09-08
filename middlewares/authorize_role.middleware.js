async function authorize_role(req, res, next) {
  try {
    //  alina look carefully i have to pass the role so that i could get the u-id next as well
    const user = req.user;
    const role = user.role;
    if (role === "admin") {
      // i don't know if i'm doing right or not
      req.user = user;
      return next();
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
