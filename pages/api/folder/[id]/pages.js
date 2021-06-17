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

  if (!id) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "A valid folder id must be provided",
      },
    });
  }

  try {
    const pages = await guestClient.query(
      q.Map(
        q.Paginate(
          q.Match(
            q.Index("pages_by_folder"),
            q.Ref(q.Collection("Folders"), id)
          )
        ),
        q.Lambda(["ref"], q.Get(q.Var("ref")))
      )
    );

    if (!pages) {
      return res.status(400).json({
        error: {
          name: "no_pages",
          message: "No pages were found in the requested folder",
        },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: { name: "pages_found", message: "Pages located", pages },
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
