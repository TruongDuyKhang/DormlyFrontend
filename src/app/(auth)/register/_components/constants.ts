// app/(auth)/register/_components/constants.ts

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

// Sleep time options
export const sleepTimeOptions = [
  { value: "21:00", label: "Before 10:00 PM", band: "before_22", score: 10, description: "Very early sleeper" },
  { value: "22:00", label: "10:00 PM - 11:00 PM", band: "22_23", score: 25, description: "Early sleeper" },
  { value: "23:00", label: "11:00 PM - 12:00 AM", band: "23_00", score: 50, description: "Normal sleeper" },
  { value: "00:00", label: "12:00 AM - 1:00 AM", band: "00_01", score: 75, description: "Late sleeper" },
  { value: "01:00", label: "After 1:00 AM", band: "after_01", score: 90, description: "Very late sleeper" },
];

// Wake time options
export const wakeTimeOptions = [
  { value: "05:00", label: "Before 6:00 AM", band: "before_06", score: 10, description: "Very early riser" },
  { value: "06:00", label: "6:00 AM - 7:00 AM", band: "06_07", score: 25, description: "Early riser" },
  { value: "07:00", label: "7:00 AM - 8:00 AM", band: "07_08", score: 50, description: "Normal riser" },
  { value: "08:00", label: "8:00 AM - 9:00 AM", band: "08_09", score: 75, description: "Late riser" },
  { value: "09:00", label: "After 9:00 AM", band: "after_09", score: 90, description: "Very late riser" },
];

// Level options
export const levelOptions = [
  { value: "1", label: "Level 1" },
  { value: "2", label: "Level 2" },
  { value: "3", label: "Level 3" },
  { value: "4", label: "Level 4" },
  { value: "5", label: "Level 5" },
];

// Labels for each preference
export const quietPreferenceLabels: Record<string, string> = {
  "1": "I need a very quiet room",
  "2": "I prefer a quiet room",
  "3": "Neutral",
  "4": "I can tolerate normal room noise",
  "5": "I am comfortable with an active/noisy room",
};

export const socialPreferenceLabels: Record<string, string> = {
  "1": "I prefer privacy most of the time",
  "2": "I prefer limited interaction",
  "3": "Neutral",
  "4": "I like talking with roommates",
  "5": "I enjoy a highly social room",
};

export const studyHabitLabels: Record<string, string> = {
  "1": "I mostly study alone in silence",
  "2": "I prefer quiet individual study",
  "3": "Flexible / neutral",
  "4": "I sometimes study with others",
  "5": "I often study in groups / active settings",
};

export const routineStrictnessLabels: Record<string, string> = {
  "1": "My routine changes often",
  "2": "My routine is somewhat flexible",
  "3": "Neutral",
  "4": "I usually follow a fixed routine",
  "5": "I strongly follow the same routine every day",
};

export const adaptabilityLabels: Record<string, string> = {
  "1": "I find it difficult to adapt to new living habits",
  "2": "I need time to adapt",
  "3": "Neutral",
  "4": "I can adapt to most roommates",
  "5": "I adapt very easily",
};

// Roommate preference options
export const roommateOptions = [
  { value: "system", label: "System Assignment", icon: "UserCheck", description: "System will assign based on personality compatibility" },
  { value: "friend", label: "Live with a friend", icon: "UserPlus", description: "Choose a friend to live with" },
];