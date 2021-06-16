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

  const { published, contentTiptap } = req.body;

  if (!id || !contentTiptap) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "All parameters must be provided",
      },
    });
  }

  // const folderId = folder[0].value;

  try {
    const page = await guestClient.query(
      q.Update(q.Ref(q.Collection("Page"), id), {
        data: {
          contentTiptap,
          published,
          // folder: q.Ref(q.Collection("Folder"), folderId),
          updatedAt: q.Now(),
        },
      })
    );

    if (!page.ref) {
      return res.status(404).json({
        error: { name: "no_page_ref", message: `Page ref not returned` },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: {
          name: "page_updated",
          message: "Page successfully updated",
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
