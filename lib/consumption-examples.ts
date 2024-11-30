type Example = {
  value: number;
  text: string;
  image?: string;
};

const examples: Example[] = [
  {
    value: 5,
    text: "Charging your smartphone up to 27% of its capacity.",
    image: "/images/consumption/c1.webp",
  },
  {
    value: 20,
    text: "Charging your smartphone fully once.",
    image: "/images/consumption/c1.webp",
  },
  {
    value: 40,
    text: "Running a small table fan for one hour.",
    image: "/images/consumption/c2.webp",
  },
  {
    value: 60,
    text: "Watching TV on a 60W LED TV for one hour.",
    image: "/images/consumption/c3.webp",
  },
  {
    value: 80,
    text: "Operating a desktop computer (without monitor) for one hour.",
    image: "/images/consumption/c4.webp",
  },
  {
    value: 100,
    text: "Using a traditional 100W incandescent bulb for one hour.",
    image: "/images/consumption/c5.webp",
  },
  {
    value: 120,
    text: "Running a laptop for two hours (assuming 60W power consumption).",
    image: "/images/consumption/c6.webp",
  },
  {
    value: 140,
    text: "Boiling water for one cup of tea using an electric kettle (2 minutes at 2000W).",
    image: "/images/consumption/c7.webp",
  },
  {
    value: 160,
    text: "Running a Wi-Fi router for 16 hours (assuming ~10W usage).",
    image: "/images/consumption/c8.webp",
  },
  {
    value: 180,
    text: "Charging a small tablet fully twice.",
    image: "/images/consumption/c9.webp",
  },
  {
    value: 200,
    text: "Running a gaming console for two hours.",
    image: "/images/consumption/c10.webp",
  },
  {
    value: 300,
    text: "Using a vacuum cleaner for 20 minutes (1200W model).",
    image: "/images/consumption/c11.webp",
  },
  {
    value: 400,
    text: "Watching TV on a large-screen LED TV for four hours.",
    image: "/images/consumption/c12.webp",
  },
  {
    value: 500,
    text: "Operating a fridge for 5–6 hours (average 100W usage).",
    image: "/images/consumption/c13.webp",
  },
  {
    value: 600,
    text: "Running a washing machine for a full cycle (energy-efficient model).",
    image: "/images/consumption/c14.webp",
  },
  {
    value: 700,
    text: "Charging an electric bicycle fully (mid-range e-bike battery).",
    image: "/images/consumption/c15.webp",
  },
  {
    value: 800,
    text: "Running a microwave oven for 40 minutes (1200W microwave).",
    image: "/images/consumption/c16.webp",
  },
  {
    value: 900,
    text: "Operating a dishwasher on an eco-mode cycle (1.5 hours).",
    image: "/images/consumption/c17.webp",
  },
  {
    value: 1000,
    text: "Running a 1000W heater for one hour.",
    image: "/images/consumption/c18.webp",
  },
  {
    value: 1100,
    text: "Using a treadmill for an hour at medium speed (depending on the model, 1000–1200W).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 1200,
    text: "Ironing clothes for an hour (1200W iron).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 1300,
    text: "Running a hairdryer for 65 minutes (assuming 1200W).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 1400,
    text: "Operating an electric water heater for 30 minutes (typically 3–5 kW).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 1500,
    text: "Running a small electric oven for 1 hour.",
    image: "/images/consumption/c.webp",
  },
  {
    value: 1600,
    text: "Using a desktop computer with a high-power GPU for six hours (average gaming rig, ~270W/hour).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 1700,
    text: "Running a small AC unit for 1 hour (1700–2000W).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 1800,
    text: "Baking a cake in a convection oven for 1 hour.",
    image: "/images/consumption/c.webp",
  },
  {
    value: 1900,
    text: "Charging a high-capacity laptop battery fully twice.",
    image: "/images/consumption/c.webp",
  },
  {
    value: 2000,
    text: "Driving an electric vehicle (EV) for approximately 10–15 km.",
    image: "/images/consumption/c.webp",
  },
  {
    value: 2500,
    text: "Running a central air conditioner for 1 hour (average 2500W).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 3000,
    text: "Operating a water heater for 1 hour (3000W standard model).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 3500,
    text: "Using a high-power gaming desktop PC for 13 hours (270W average).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 4000,
    text: "Running a medium-sized washing machine and dryer for a full cycle.",
    image: "/images/consumption/c.webp",
  },
  {
    value: 4500,
    text: "Watching TV on a large OLED screen for 45 hours (100W average).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 5000,
    text: "Driving an electric vehicle (EV) for 25–30 km.",
    image: "/images/consumption/c.webp",
  },
  {
    value: 5500,
    text: "Operating a medium-sized air conditioner for 3 hours.",
    image: "/images/consumption/c.webp",
  },
  {
    value: 6000,
    text: "Running a household fridge continuously for 2–3 days (100W average).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 6500,
    text: "Using a microwave oven continuously for 5 hours (1200W average).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 7000,
    text: "Charging a high-capacity Tesla EV battery by 10%.",
    image: "/images/consumption/c.webp",
  },
  {
    value: 7500,
    text: "Powering an electric stove for 2 hours (3000–4000W models).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 8000,
    text: "Running an average-sized home (non-AC) for an entire day (~8 kWh/day).",
    image: "/images/consumption/c.webp",
  },
  {
    value: 8500,
    text: "Operating a 2000W space heater for 4 hours.",
    image: "/images/consumption/c.webp",
  },
  {
    value: 9000,
    text: "Running a high-efficiency electric water heater for 3 hours.",
    image: "/images/consumption/c.webp",
  },
  {
    value: 9500,
    text: "Using a central heating system for 3–4 hours.",
    image: "/images/consumption/c.webp",
  },
  {
    value: 10000,
    text: "Driving an electric vehicle (EV) for 50–60 km.",
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
