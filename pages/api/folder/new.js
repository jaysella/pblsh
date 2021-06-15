var faunadb = require("faunadb"),
  q = faunadb.query;

const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

const request = async (req, res) => {
  const { userId, name } = req.body;

  if (!userId || !name) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "Both parameters must be provided",
      },
    });
  }

  try {
    const folder = await guestClient.query(
      q.Create(q.Collection("Folder"), {
        data: {
          name,
          owner: q.Ref(q.Collection("User"), userId),
          createdAt: q.Now(),
          updatedAt: q.Now(),
        },
      })
    );

    if (!folder.ref) {
      return res.status(404).json({
        error: { name: "no_folder_ref", message: "Folder ref not returned" },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: {
          name: "folder_created",
          message: "Folder successfully created",
          folder,
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

export default request;
