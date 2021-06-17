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

  const { followerId } = req.body;
  const followeeId = id;

  if (!followeeId || !followerId) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "All parameters must be provided",
      },
    });
  }

  try {
    const relationship = await guestClient.query(
      q.Create(q.Collection("Relationships"), {
        data: {
          followee: q.Ref(q.Collection("People"), followeeId),
          follower: q.Ref(q.Collection("People"), followerId),
        },
      })
    );

    if (!relationship.ref) {
      return res.status(404).json({
        error: {
          name: "no_relationship_ref",
          message: `Relationship ref not returned`,
        },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: {
          name: "relationship_created",
          message: "Relationship successfully created",
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
