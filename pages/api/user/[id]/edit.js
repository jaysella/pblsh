import { withApiAuthRequired } from "@auth0/nextjs-auth0";

var faunadb = require("faunadb"),
  q = faunadb.query;

const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

const request = async (req, res) => {
  const {
    query: { id },
  } = req;

  const { email, avatar, nickname, name } = req.body;

  if (!id || !email || !nickname || !name) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "All three parameters must be provided",
      },
    });
  }

  try {
    const user = await guestClient.query(
      q.Update(q.Ref(q.Collection("People"), id), {
        data: { email, avatar, nickname, name },
      })
    );

    if (!user.ref) {
      return res.status(404).json({
        error: { name: "no_user_ref", message: `User ref not returned` },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: {
          name: "user_updated",
          message: "User successfully updated",
        },
      })
    );
  } catch (error) {
    console.error(error);
    res
      .status(error.requestResult.statusCode)
      .json({ error: "database_error", message: error.message });
  }
};

export default withApiAuthRequired(request);
