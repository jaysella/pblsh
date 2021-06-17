import { withApiAuthRequired } from "@auth0/nextjs-auth0";

var faunadb = require("faunadb"),
  q = faunadb.query;

const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

const request = async (req, res) => {
  // implement pagination?

  try {
    const users = await guestClient.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("User"))),
        q.Lambda((user) => q.Get(user))
      )
    );

    if (!users) {
      return res.status(400).json({
        error: {
          name: "no_users",
          message: "No users were found",
        },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: {
          name: "users_found",
          message: "Users located",
          users,
        },
      })
    );
  } catch (error) {
    console.error(error);
    res.status(error.requestResult.statusCode).json({
      error: { name: "database_error", message: error.message },
    });
  }
};

export default withApiAuthRequired(request);
