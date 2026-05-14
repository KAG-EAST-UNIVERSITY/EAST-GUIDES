import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '7lrrwsxb',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // I'll ask the user for a token or use npx sanity exec if possible
  apiVersion: '2024-05-14',
})

const faqs = [
  {
    question: "How do I log in to the LMS for my classes?",
    answer: "Go to the main website (east.university) or directly to https://elearning.east.ac.ke/, click the 'LMS' button, and log in using the username and password provided by the IT Department.",
    order: 1
  },
  {
    question: "What is the official student email format?",
    answer: "Your official email is formatted as name1.name2@students.east.ac.ke. You must use this for all official university communication and resources.",
    order: 2
  },
  {
    question: "I forgot my password or can't log in. What do I do?",
    answer: "First, search the Official Knowledge Base using the link above. If that doesn't fix it, email ictsupport@east.ac.ke or officially raise a support ticket. Include your student ID and a screenshot of the error!",
    order: 3
  },
  {
    question: "Can I use my phone for online exams?",
    answer: "No. You must use a Windows 11 or macOS laptop/desktop with a working camera. You are required to download and install the Safe Exam Browser (SEB) to take secure exams.",
    order: 4
  },
  {
    question: "How do I attend online classes?",
    answer: "Look for the BigBlueButton (BBB) icon inside your LMS course. Click 'Join Session', allow microphone and camera permissions, and you are in!",
    order: 5
  },
  {
    question: "Who do I contact for urgent campus IT help?",
    answer: "Reach out to your lead IT facilitators: Dancan & Brian (Kitengela Campus) or Eugene (Buruburu & Online Campus).",
    order: 6
  },
  {
    question: "Where can I find my academic results?",
    answer: "Academic information and results are hosted on the School Portal at https://kageu.edumaat.net/.",
    order: 7
  }
];

const videos = [
  {
    title: "Master Orientation Guide",
    description: "Your complete roadmap to the KAG EAST digital experience.",
    url: "https://drive.google.com/file/d/1H6blCFajEYmEpKJZo16VTKVOX8olZK2j/preview",
    isEmbedded: true
  },
  {
    title: "Email & Portal Login",
    description: "How to access student email & register units.",
    url: "https://rb.gy/rx5hq9",
    isEmbedded: false
  },
  {
    title: "LMS & Online Classes",
    description: "Mastering Moodle & BigBlueButton classes.",
    url: "https://rebrand.ly/wym00kj",
    isEmbedded: false
  }
];

const announcement = {
  title: "The IT Troubleshooting Clinic",
  message: "Login failed? SEB acting up? Wi-Fi won't connect? This is your window. We will fix it live. Mark your calendar!",
  date: "Friday, May 15th, 11:00 AM - 11:30 AM",
  isActive: true
};

async function migrate() {
  console.log('Starting migration...');

  for (const faq of faqs) {
    await client.create({
      _type: 'faq',
      ...faq
    });
    console.log(`Created FAQ: ${faq.question}`);
  }

  for (const video of videos) {
    await client.create({
      _type: 'video',
      ...video
    });
    console.log(`Created Video: ${video.title}`);
  }

  await client.create({
    _type: 'announcement',
    ...announcement
  });
  console.log('Created Announcement');

  console.log('Migration complete!');
}

migrate().catch(console.error);
