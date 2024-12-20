import mongoose from "mongoose";

// Helper function to generate slots
const generateSlots = (openTime, closeTime, date, interval = 30) => {
  const slots = [];
  let startTime = new Date(`${date}T${openTime}:00`);
  let endTime = new Date(`${date}T${closeTime}:00`);

  // Handle closeTime that crosses midnight
  if (endTime <= startTime) {
    endTime.setDate(endTime.getDate() + 1);
  }

  while (startTime < endTime) {
    const timeString = startTime.toTimeString().slice(0, 5); // Format "HH:MM"
    slots.push({ time: timeString, status: false, date }); // Include the date for each slot
    startTime.setMinutes(startTime.getMinutes() + interval);
  }

  return slots;
};

// Business Schema
const businessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    businessType: {
      type: String,
      required: true,
      set: (value) => value.toLowerCase(),
    },
    location: { type: String, required: true },
    statusDateWise: {
      monday: { open: Boolean, openTime: String, closeTime: String },
      tuesday: { open: Boolean, openTime: String, closeTime: String },
      wednesday: { open: Boolean, openTime: String, closeTime: String },
      thursday: { open: Boolean, openTime: String, closeTime: String },
      friday: { open: Boolean, openTime: String, closeTime: String },
      saturday: { open: Boolean, openTime: String, closeTime: String },
      sunday: { open: Boolean, openTime: String, closeTime: String },
    },
    role: { type: String, default: "business" },
    slots: [
      {
        day: { type: String, required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        status: { type: Boolean, default: false },
      },
    ],
    slotDuration: { type: Number, default: 30 }, // Slot duration in minutes
    slotPayment: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Pre-save hook to handle slot regeneration on timing changes
businessSchema.pre("save", function (next) {
  const today = new Date();
  const currentDateString = today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const dayOrder = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const interval = this.slotDuration || 30; // Default interval is 30 minutes

  // If statusDateWise has been modified, regenerate slots
  if (this.isModified("statusDateWise") || this.isModified("slotDuration")) {
    const updatedSlots = [];

    // Generate new slots for the next 7 days
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date();
      currentDate.setDate(today.getDate() + i);

      const day = dayOrder[currentDate.getDay()];
      const formattedDate = currentDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
      const dayData = this.statusDateWise[day];

      // If the day is open and has valid times, generate slots
      if (dayData?.open && dayData?.openTime && dayData?.closeTime) {
        const generatedSlots = generateSlots(
          dayData.openTime,
          dayData.closeTime,
          formattedDate,
          interval
        );

        generatedSlots.forEach((slot) => {
          updatedSlots.push({
            day,
            date: slot.date,
            time: slot.time,
            status: false,
          });
        });
      }
    }

    // Replace the slots array with updated slots
    this.slots = updatedSlots;
  }

  next();
});

// Model Creation
const Business = mongoose.model("Business", businessSchema);

export default Business;
