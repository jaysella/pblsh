import { withApiAuthRequired } from "@auth0/nextjs-auth0";

var faunadb = require("faunadb"),
  q = faunadb.query;

const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

const request = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "A valid email must be provided",
      },
    });
  }

  try {
    const user = await guestClient.query(
      q.Get(q.Match(q.Index("people_by_email"), email))
    );

    if (!user) {
      return res.status(400).json({
        error: {
          name: "no_user",
          message: "The requested user does not exist",
        },
      });
    }

    if (!user.ref) {
      return res.status(400).json({
        error: {
          name: "no_user_ref",
          message: "User ref not returned",
        },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: { name: "user_found", message: "User located", user },
      })
    );
  } catch (error) {
    if (error.message === "instance not found") {
      return res.status(400).json({
        error: {
          name: "no_user",
          message: "The requested user does not exist",
        },
      });
    }

    console.error(error);
    res.status(error.requestResult.statusCode).json({
      error: { name: "database_error", message: error.message },
    });
  }
};

export default withApiAuthRequired(request);
