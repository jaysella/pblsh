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
        message: "A valid folder id must be provided",
      },
    });
  }

  try {
    const folder = await guestClient.query(
      q.Get(q.Ref(q.Collection("Folder"), id))
    );

    if (!folder) {
      return res.status(400).json({
        error: {
          name: "no_folder",
          message: "The requested folder does not exist",
        },
      });
    }

    if (!folder.ref) {
      return res.status(400).json({
        error: {
          name: "no_folder_ref",
          message: "Folder ref not returned",
        },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: { name: "folder_found", message: "Folder located", folder },
      })
    );
  } catch (error) {
    if (error.message === "instance not found") {
      return res.status(400).json({
        error: {
          name: "no_folder",
          message: "The requested folder does not exist",
        },
      });
    }

    console.error(error);
    res.status(error.requestResult.statusCode).json({
      error: { name: "database_error", message: error.message },
    });
  }
};
