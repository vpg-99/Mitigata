import { Record, Status } from "../types";

// Helper function to generate random date
const generateRandomDate = (): string => {
  const start = new Date(2023, 0, 1);
  const end = new Date(2024, 11, 31);
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toLocaleDateString("en-GB");
};

// Helper function to generate random name
const firstNames = [
  "John",
  "Jane",
  "Michael",
  "Sarah",
  "David",
  "Emma",
  "Robert",
  "Lisa",
  "James",
  "Mary",
  "William",
  "Patricia",
  "Richard",
  "Jennifer",
  "Thomas",
  "Linda",
  "Charles",
  "Elizabeth",
  "Daniel",
  "Barbara",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Wilson",
  "Anderson",
  "Taylor",
  "Thomas",
  "Hernandez",
  "Moore",
  "Martin",
  "Jackson",
  "Thompson",
  "White",
];

const generateRandomName = (): string => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

// Helper function to generate email from name
const generateEmail = (name: string): string => {
  return name.toLowerCase().replace(" ", ".") + "@demo.com";
};

// Helper function to get random status
const getRandomStatus = (): Status => {
  const statuses: Status[] = ["ACTIVE", "INVITED", "BLOCKED"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Generate 100 records
export const generateRecords = (): Record[] => {
  const records: Record[] = [];

  for (let i = 1; i <= 100; i++) {
    const name = generateRandomName();
    const inviterName = generateRandomName();

    records.push({
      id: i.toString(),
      about: {
        name: name,
        status: getRandomStatus(),
        email: generateEmail(name),
      },
      details: {
        date: generateRandomDate(),
        invitedBy: inviterName,
      },
    });
  }

  return records;
};

// Export the generated records
export const records = generateRecords();
