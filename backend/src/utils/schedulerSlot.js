import schedule from "node-schedule";
import Slot from "../models/slotModel.js"; // Adjust the path to your Slot model

// Scheduled job to run daily at 00:00
export const cleanupJob = () => {
  schedule.scheduleJob("00 00 * * *", async () => {
    try {
      const currentDate = new Date();

      // Delete expired slots
      const result = await Slot.deleteMany({
        reservationDate: { $lt: currentDate },
      });

      // Log how many expired slots were deleted
      console.log(
        `Cleanup completed. Deleted ${result.deletedCount} expired slots.`
      );
    } catch (error) {
      // Log any errors that occur during the cleanup
      console.error("Error during cleanup:", error);
    }
  });
};
