var faunadb = require("faunadb"),
  q = faunadb.query;

const guestClient = new faunadb.Client({
  secret: process.env.FAUNA_GUEST_SECRET,
});

const request = async (req, res) => {
  const { type, url, name, email, description } = req.body;

  if (!type || !url || !name || !email || !description) {
    return res.status(400).json({
      error: {
        name: "missing_params",
        message: "All five parameters must be provided",
      },
    });
  }

  try {
    const report = await guestClient.query(
      q.Create(q.Collection("Report"), {
        data: {
          type,
          url,
          name,
          email,
          description,
          createdAt: q.Now(),
          updatedAt: q.Now(),
        },
      })
    );

    if (!report.ref) {
      return res.status(404).json({
        error: { name: "no_report_ref", message: "Report ref not returned" },
      });
    }

    res.status(200).json(
      JSON.stringify({
        success: {
          name: "report_created",
          message: "Report successfully created",
          report,
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
