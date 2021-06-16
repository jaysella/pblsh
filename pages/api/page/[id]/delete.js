import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

var faunadb = require("faunadb"),
  q = faunadb.query;

const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

const request = async (req, res) => {
  const {
    user: { sub },
  } = await getSession(req, res);

  const {
    query: { id },
  } = req;

  const { userId, userSub } = req.body;

  if (!sub || !id || !userId || !userSub) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "All parameters must be provided",
      },
    });
  }

  if (userSub != sub) {
    return res.status(401).json({
      error: {
        name: "unauthorized",
        message: "This user is not authorized to perform the requested action",
      },
    });
  }

  try {
    const page = await guestClient.query(
      q.Delete(q.Ref(q.Collection("Page"), id))
    );

    if (!page.ref) {
      return res.status(404).json({
        error: { name: "no_page_ref", message: `Page ref not returned` },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: {
          name: "page_deleted",
          message: "Page successfully deleted",
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
