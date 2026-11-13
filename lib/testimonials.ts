export type TestimonialData = {
  name: string;
  role: string;
  text: string;
  /** One-line situation before 10X, supplied by 10X. Shown under the quote. */
  context: string;
};

/** Kept for existing consumers (hero cards) that read `quote`. Same string as `text`. */
export type Testimonial = TestimonialData & { quote: string };

/**
 * Customer feedback supplied by 10X. Render the text exactly as stored.
 */
const data: TestimonialData[] = [
  {
    name: "Marcus T. K. Loke",
    role: "Property Agent",
    text: "Used 10X for a while. Helps me keep track of follow-ups. Before I always forget. Now less messy. Good for property agents.",
    context: "Was losing 3-5 leads a week to missed follow-ups.",
  },
  {
    name: "Audrey Wong",
    role: "Property Agent",
    text: "I didn't expect much when I first tried 10X. But it actually helped me stay more organised with follow-ups. I'm still using it.",
    context: "Almost gave up on similar tools after trying two that did not fit.",
  },
  {
    name: "Elaine Choo",
    role: "Aesthetic Clinic Owner",
    text: "10X helped me manage bookings and follow-ups better. Before this, things could get messy when many clients message at the same time.",
    context: "Was managing bookings across WhatsApp and paper notes.",
  },
  {
    name: "Adrian Chin",
    role: "Home Service Operator",
    text: "I do home service jobs so my schedule is always changing. 10X makes it easier to track jobs and appointments. Customers get updates faster too.",
    context: "Schedule changes every day with no system to track jobs.",
  },
  {
    name: "Vanessa Yeap",
    role: "Education Centre Director",
    text: "Will recommend to my colleagues. The follow-up system keeps parents engaged.",
    context: "Parents were not getting consistent follow-ups.",
  },
  {
    name: "Li Tian Qi",
    role: "Massage Therapist",
    text: "Very good. I free up my hands and the system handles the bookings.",
    context: "Spent hours replying to booking messages every evening.",
  },
  {
    name: "Wei Rong",
    role: "Property Agent",
    text: "I can focus on doing what I love more. Follow-ups are easier to keep track of now.",
    context: "Needed follow-up without constant manual effort.",
  },
];

export const testimonials: Testimonial[] = data.map((t) => ({ ...t, quote: t.text }));

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((part) => /^[A-Za-z]/.test(part) && !part.endsWith("."))
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
