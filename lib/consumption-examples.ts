type Example = {
  value: number;
  text: string;
  image?: string;
};

const examples: Example[] = [
  {
    value: 1, // 1 Wh
    text: "Powering a small LED bulb (1W) for 1 hour.",
    image: "/images/consumption/c1.webp",
  },
  {
    value: 2, // 2 Wh
    text: "Keeping a smartwatch active for 1 day (2W for 1 hour).",
    image: "/images/consumption/c2.webp",
  },
  {
    value: 3, // 3 Wh
    text: "Running a small desk fan (3W) for 1 hour.",
    image: "/images/consumption/c3.webp",
  },
  {
    value: 4, // 4 Wh
    text: "Streaming music on a smartphone (5W) for ~48 minutes.",
    image: "/images/consumption/c4.webp",
  },
  {
    value: 5, // 5 Wh
    text: "Charging your smartphone up to ~27% of its capacity (assuming a 18.5Wh battery).",
    image: "/images/consumption/c5.webp",
  },
  {
    value: 6, // 6 Wh
    text: "Operating a nightlight (6W) for 1 hour.",
    image: "/images/consumption/c6.webp",
  },
  {
    value: 7, // 7 Wh
    text: "Running a laptop in sleep mode (7W) for 1 hour.",
    image: "/images/consumption/c7.webp",
  },
  {
    value: 8, // 8 Wh
    text: "Playing a podcast on a Bluetooth speaker (8W) for 1 hour.",
    image: "/images/consumption/c8.webp",
  },
  {
    value: 9, // 9 Wh
    text: "Powering a digital photo frame (9W) for 1 hour.",
    image: "/images/consumption/c9.webp",
  },
  {
    value: 10, // 10 Wh
    text: "Charging a tablet up to ~20% of its capacity (assuming a 50Wh battery).",
    image: "/images/consumption/c10.webp",
  },
  {
    value: 11, // 11 Wh
    text: "Running a small aquarium filter (11W) for 1 hour.",
    image: "/images/consumption/c11.webp",
  },
  {
    value: 12, // 12 Wh
    text: "Heating water in an electric kettle (1200W) for 1 minute.",
    image: "/images/consumption/c12.webp",
  },
  {
    value: 13, // 13 Wh
    text: "Watching TV on a modern LED screen (130W) for ~6 minutes.",
    image: "/images/consumption/c13.webp",
  },
  {
    value: 14, // 14 Wh
    text: "Using an electric toothbrush (140W) for ~6 minutes.",
    image: "/images/consumption/c14.webp",
  },
  {
    value: 15, // 15 Wh
    text: "Running a gaming console in standby mode (15W) for 1 hour.",
    image: "/images/consumption/c15.webp",
  },
  {
    value: 16, // 16 Wh
    text: "Powering a laptop actively on low settings (80W) for ~12 minutes.",
    image: "/images/consumption/c16.webp",
  },
  {
    value: 17, // 17 Wh
    text: "Boiling an egg in a small egg boiler (1000W) for ~1 minute.",
    image: "/images/consumption/c17.webp",
  },
  {
    value: 18, // 18 Wh
    text: "Using a Wi-Fi router (18W) for 1 hour.",
    image: "/images/consumption/c18.webp",
  },
  {
    value: 19, // 19 Wh
    text: "Running a food blender (190W) for ~6 minutes.",
    image: "/images/consumption/c19.webp",
  },
  {
    value: 20, // 20 Wh
    text: "Charging a drone's battery up to ~10% of its capacity (assuming a 200Wh battery).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 20,
    text: "Charging a drone's battery up to ~10% of its capacity (20 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 30,
    text: "Running a mini-fridge (60W) for ~30 minutes (30 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 40,
    text: "Charging a laptop up to ~8% of its capacity (40 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 50,
    text: "Operating a portable heater (50W) for 1 hour (50 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 60,
    text: "Running a microwave oven (1200W) for ~3 minutes (60 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 70,
    text: "Charging a tablet fully (70 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 80,
    text: "Operating a space heater (80W) for 1 hour (80 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 90,
    text: "Running a gaming console actively (90W) for 1 hour (90 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 100,
    text: "Charging a laptop fully (100 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 100,
    text: "Running a desktop computer for 1 hour (100 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 150,
    text: "Using a hairdryer for 6 minutes (150 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 200,
    text: "Running a microwave oven for 10 minutes (200 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 250,
    text: "Operating a portable heater for 30 minutes (250 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 300,
    text: "Using a space heater for 12 minutes (300 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 350,
    text: "Running a vacuum cleaner for 30 minutes (350 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 400,
    text: "Operating an electric oven for 30 minutes (400 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 450,
    text: "Running an air conditioner for 30 minutes (450 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 500,
    text: "Charging an electric scooter's battery up to ~25% (500 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 550,
    text: "Using a clothes dryer for 30 minutes (550 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 600,
    text: "Running a dishwasher for 30 minutes (600 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 650,
    text: "Operating a dehumidifier for 30 minutes (650 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 700,
    text: "Charging a power tool's battery (700 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 750,
    text: "Running an electric kettle for 30 minutes (750 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 800,
    text: "Operating an electric water heater for 30 minutes (800 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 850,
    text: "Using a large refrigerator for 30 minutes (850 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 900,
    text: "Running a high-powered gaming PC for 30 minutes (900 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 950,
    text: "Charging an electric bike's battery for 30 minutes (950 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 1000,
    text: "Operating an electric vehicle's battery for ~1 mile (1000 Wh).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 1100,
    text: "Too High!!!! Be more Eco Friendly!!!",
    image: "/images/consumption/c.webp",
  },
];

export default function findNearestExample(value: number): {
  text: string;
  image?: string;
} {
  if (value < 0 || value > 10000) {
    return { text: "Input must be between 0 and 10,000 Wh." };
  }

  const nearest = examples.reduce((prev, curr) =>
    Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
  );

  return { text: nearest.text, image: nearest.image };
}
