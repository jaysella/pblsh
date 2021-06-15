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
    const folders = await guestClient.query(
      q.Map(
        q.Paginate(
          q.Match(q.Index("folders_by_user"), q.Ref(q.Collection("User"), id))
        ),
        q.Lambda(["ref"], q.Get(q.Var("ref")))
      )
    );

    if (!folders) {
      return res.status(400).json({
        error: {
          name: "no_user_folders",
          message: "No folders for the requested user were found",
        },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: {
          name: "user_folders_found",
          message: "User's folders located",
          folders,
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

export default request;
