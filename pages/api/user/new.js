var faunadb = require("faunadb"),
  q = faunadb.query;

const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

export default async (req, res) => {
  // res.status(200).json(JSON.stringify(req.body));
  const { auth0Id, email, nickname, name, setupCompleted } = req.body;

  if (!auth0Id || !email || !nickname || !name || !setupCompleted) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "All five parameters must be provided",
      },
    });
  }

  try {
    const existingEmail = await guestClient.query(
      // Exists returns boolean, Casefold returns normalize string
      q.Exists(q.Match(q.Index("user_by_email"), q.Casefold(email)))
    );

    if (existingEmail) {
      return res.status(400).json({
        error: {
          name: "email_exists",
          message: `This email, ${email}, is already registered to a user`,
        },
      });
    }

    const user = await guestClient.query(
      q.Create(q.Collection("User"), {
        data: { auth0Id, email, nickname, name, setupCompleted },
      })
    );

    if (!user.ref) {
      return res.status(404).json({
        error: { name: "no_user_ref", message: `User ref not returned` },
      });
    } else {
      const defaultFolder = await guestClient.query(
        q.Create(q.Collection("Folder"), {
          data: {
            name: "Uncategorized",
            owner: user.ref,
            createdAt: q.Now(),
            updatedAt: q.Now(),
          },
        })
      );

      if (!defaultFolder.ref) {
        return res.status(404).json({
          error: { name: "no_folder_ref", message: `Folder ref not returned` },
        });
      }
    }

    res.status(200).json(
      JSON.stringify({
        success: {
          name: "user_created",
          message: "User successfully created",
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
