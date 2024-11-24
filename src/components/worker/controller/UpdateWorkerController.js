import WorkerModel from "../model/WorkerModel.js";
import db from "../../../config/db.js";

const updateWorker = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const workerId = req.query.worker_id;
    const {
      wrk_name,
      wrk_contact,
      wrk_address,
      wrk_department,
      wrk_opening_status,
    } = req.body;

    // Validate required fields
    if (!workerId) {
      return res.status(400).json({
        status: 400,
        message: "worker_id is required in query parameters",
      });
    }

    // Update main worker data
    const [updatedRowCount] = await WorkerModel.update(
      {
        wrk_name,
        wrk_contact,
        wrk_address,
        wrk_department,
        wrk_opening_status,
      },
      { where: { id: workerId }, transaction: t }
    );

    if (!updatedRowCount) {
      await t.rollback();
      return res
        .status(404)
        .json({ status: 404, message: "Worker not found or no changes made" });
    }

    await t.commit(); // Commit transaction
    return res.status(200).json({
      status: 200,
      message: "Worker updated successfully",
    });
  } catch (error) {
    await t.rollback(); // Rollback transaction on error
    console.error("Error in updateWorker:", error);
    return res.status(500).json({
      status: 500,
      message: `Server error: ${error.message}`,
    });
  }
};

export default updateWorker;
