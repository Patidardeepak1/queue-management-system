import schedule from "node-schedule";
import Business from "../models/businessModel.js";

// const getNextWeekdayDate = (dayIndex) => {
//   const today = new Date();
//   const nextDay = new Date();
//   nextDay.setDate(today.getDate() + ((7 - today.getDay() + dayIndex) % 7 || 7));
//   return nextDay.toISOString().split("T")[0];
// };

// export const scheduleSlotManagement = () => {
//   schedule.scheduleJob("17 11 * * *", async () => {
//     console.log("Scheduled job triggered at:", new Date().toISOString());
//     try {
//       const today = new Date();
//       const currentDayIndex = today.getDay();
//       const todayDateString = today.toISOString().split("T")[0];
//       const nextWeekDateString = getNextWeekdayDate(currentDayIndex);

//       console.log("Today's date:", todayDateString);
//       console.log("Next week's date:", nextWeekDateString);

//       const businesses = await Business.find();
//       console.log("Businesses fetched:", businesses.length);

//       for (const business of businesses) {
//         try {
//           console.log(`Processing business: ${business._id}`);

//           // Remove today's slots
//           business.slots = business.slots.filter(
//             (slot) => slot.date !== todayDateString
//           );
//           console.log(`Removed slots for today: ${todayDateString}`);

//           // Add slots for next week
//           if (Business.addSlotsForDay) {
//             await Business.addSlotsForDay(
//               business,
//               currentDayIndex,
//               nextWeekDateString
//             );
//           } else {
//             console.error("addSlotsForDay method is missing!");
//           }

//           // Save the business document
//           await business.save();
//           console.log(`Updated business: ${business._id}`);
//         } catch (err) {
//           console.error(`Error processing business ${business._id}:`, err);
//         }
//       }

//       console.log("Successfully updated slots for the next week.");
//     } catch (error) {
//       console.error("Error updating slots for the next week:", error);
//     }
//   });
// };

// import schedule from "node-schedule";
// import Business from "../models/businessModel.js";

// Helper to generate slots for a specific day
const generateSlotsForDay = (dayConfig, date, slotDuration) => {
  if (!dayConfig.open) return []; // Skip closed days

  const slots = [];
  const [startHour, startMinute] = dayConfig.openTime.split(":").map(Number);
  const [endHour, endMinute] = dayConfig.closeTime.split(":").map(Number);

  const startTime = new Date(`${date}T${dayConfig.openTime}:00`);
  const endTime = new Date(`${date}T${dayConfig.closeTime}:00`);

  let currentTime = new Date(startTime);

  while (currentTime < endTime) {
    const timeString = currentTime.toTimeString().split(" ")[0].substring(0, 5); // Format HH:mm
    slots.push({ day: dayConfig.day, date, time: timeString, status: true });

    // Increment time by slotDuration
    currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
  }

  return slots;
};

// Helper function to get the next occurrence of a specific weekday
const getNextWeekdayDate = (dayIndex) => {
  const today = new Date();
  const nextDay = new Date();
  nextDay.setDate(today.getDate() + ((7 - today.getDay() + dayIndex) % 7 || 7));
  return nextDay.toISOString().split("T")[0]; // Format "YYYY-MM-DD"
};

// Scheduled job to run daily at 11:15 PM
export const scheduleSlotManagement = () => {
  schedule.scheduleJob("01 00 * * *", async () => {
    try {
      const today = new Date();
      const currentDayIndex = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
      const todayDateString = today.toISOString().split("T")[0];

      // Get the next occurrence of the same day next week
      const nextWeekDateString = getNextWeekdayDate(currentDayIndex);

      // Fetch all businesses
      const businesses = await Business.find();

      for (const business of businesses) {
        // Remove expired slots
        business.slots = business.slots.filter(
          (slot) => slot.date !== todayDateString
        );

        // Get today's config from statusDateWise
        const todayConfig = Object.values(business.statusDateWise)[
          currentDayIndex
        ];
        if (!todayConfig) {
          console.warn(
            `No config for day index ${currentDayIndex} for business ${business._id}`
          );
          continue;
        }

        // Generate slots for the next week
        const newSlots = generateSlotsForDay(
          todayConfig,
          nextWeekDateString,
          business.slotDuration
        );
        business.slots.push(...newSlots);

        // Save the updated business document
        await business.save();
        console.log(`Updated business: ${business._id}`);
      }

      console.log("Successfully updated slots for the next week.");
    } catch (error) {
      console.error("Error updating slots for the next week:", error);
    }
  });
};
