var faunadb = require("faunadb"),
  q = faunadb.query;

const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

export default async (req, res) => {
  const { userId, title } = req.body;

  if (!userId || !title) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "Both parameters must be provided",
      },
    });
  }

  try {
    const defaultFolder = await guestClient.query(
      q.Paginate(
        q.Intersection(
          q.Match(
            q.Index("folders_by_user"),
            q.Ref(q.Collection("User"), userId)
          ),
          q.Match(q.Index("folders_by_name"), "Uncategorized")
        )
      )
    );

    if (!defaultFolder.data) {
      return res.status(404).json({
        error: {
          name: "no_default_folder_ref",
          message: "Default folder ref not returned",
        },
      });
    }

    const page = await guestClient.query(
      q.Create(q.Collection("Page"), {
        data: {
          title,
          published: false,
          owner: q.Ref(q.Collection("User"), userId),
          folder: defaultFolder.data[0],
          createdAt: q.Now(),
          updatedAt: q.Now(),
        },
      })
    );

    if (!page.ref) {
      return res.status(404).json({
        error: { name: "no_page_ref", message: "Page ref not returned" },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: {
          name: "page_created",
          message: "Page successfully created",
          page,
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
