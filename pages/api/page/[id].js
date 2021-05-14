// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
var faunadb = require("faunadb"),
  q = faunadb.query;

const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

export default async (req, res) => {
  const {
    query: { id },
  } = req;

  if (!id) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "A valid page id must be provided",
      },
    });
  }

  try {
    const page = await guestClient.query(
      q.Get(q.Ref(q.Collection("Page"), id))
    );

    if (!page) {
      return res.status(400).json({
        error: {
          name: "no_page",
          message: "The requested page does not exist",
        },
      });
    }

    if (!page.ref) {
      return res.status(400).json({
        error: {
          name: "no_page_ref",
          message: "Page ref not returned",
        },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: { name: "page_found", message: "Page located", page },
      })
    );
  } catch (error) {
    if (error.message === "instance not found") {
      return res.status(400).json({
        error: {
          name: "no_page",
          message: "The requested page does not exist",
        },
      });
    }

    console.error(error);
    res.status(error.requestResult.statusCode).json({
      error: { name: "database_error", message: error.message },
    });
  }
};
