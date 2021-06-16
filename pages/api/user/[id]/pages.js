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
        message: "A valid user id must be provided",
      },
    });
  }

  try {
    const pages = await guestClient.query(
      q.Map(
        q.Paginate(
          q.Match(q.Index("pages_by_user"), q.Ref(q.Collection("User"), id))
        ),
        q.Lambda(
          "page",
          q.Let(
            {
              page: q.Get(q.Var("page")),
              folder: q.Get(q.Select(["data", "folder"], q.Var("page"))),
            },
            {
              page: q.Var("page"),
              folder: q.Var("folder"),
            }
          )
        )
      )
    );

    if (!pages) {
      return res.status(400).json({
        error: {
          name: "no_user_pages",
          message: "No pages for the requested user were found",
        },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: {
          name: "user_pages_found",
          message: "User's pages located",
          pages,
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
