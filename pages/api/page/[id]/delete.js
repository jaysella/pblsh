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

  const { userId } = req.body;

  if (!id || !userId) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "All parameters must be provided",
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
