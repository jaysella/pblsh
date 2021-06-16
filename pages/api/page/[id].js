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
        message: "A valid page id must be provided",
      },
    });
  }

  if (isNaN(id)) {
    return res.status(400).json({
      error: {
        name: "invalid_id",
        message: "The requested page does not exist",
      },
    });
  }

  try {
    const page = await guestClient.query(
      q.Map(
        q.Paginate(q.Ref(q.Collection("Page"), id)),
        q.Lambda(
          "page",
          q.Let(
            {
              page: q.Get(q.Var("page")),
              folder: q.Get(q.Select(["data", "folder"], q.Var("page"))),
              owner: q.Get(q.Select(["data", "owner"], q.Var("page"))),
            },
            {
              page: q.Var("page"),
              folder: q.Var("folder"),
              owner: q.Var("owner"),
            }
          )
        )
      )
    );

    if (!page || !(page.data.length > 0)) {
      return res.status(400).json({
        error: {
          name: "no_page",
          message: "The requested page does not exist",
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

export default request;
