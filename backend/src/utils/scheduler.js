import schedule from "node-schedule";
import Business from "../models/businessModel.js";

// Helper function to get the date of the next occurrence of a specific weekday
const getNextWeekdayDate = (dayIndex) => {
  const today = new Date();
  const nextDay = new Date();
  nextDay.setDate(today.getDate() + ((7 - today.getDay() + dayIndex) % 7 || 7));
  return nextDay.toISOString().split("T")[0]; // Format "YYYY-MM-DD"
};

// Scheduled job to run daily at midnight
export const scheduleSlotManagement = () => {
  schedule.scheduleJob("0 0 * * *", async () => {
    try {
      const today = new Date();
      const currentDayIndex = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
      const todayDateString = today.toISOString().split("T")[0];

      // Get the next occurrence of the same day next week
      const nextWeekDateString = getNextWeekdayDate(currentDayIndex);

      // Fetch all businesses
      const businesses = await Business.find();

      for (const business of businesses) {
        // Remove today's slots
        business.slots = business.slots.filter(
          (slot) => slot.date !== todayDateString
        );

        // Add slots for the same day next week
        await Business.addSlotsForDay(
          business,
          currentDayIndex,
          nextWeekDateString
        );

        // Save the updated business document
        await business.save();
      }

      console.log("Successfully updated slots for the next week.");
    } catch (error) {
      console.error("Error updating slots for the next week:", error);
    }
  });
};
