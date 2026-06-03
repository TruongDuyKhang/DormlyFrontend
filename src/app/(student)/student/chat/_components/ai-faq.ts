// app/(student)/chat/_components/ai-faq.ts

export interface FaqItem {
  question: string;
  answer: string;
  category: 'transfer' | 'maintenance' | 'documents' | 'policy' | 'event';
}

export const faqDatabase: FaqItem[] = [
  {
    question: "How do I request a room transfer?",
    answer: "Go to Requests → New Request → Transfer Request. Fill in the form with your reason for transfer. The residence office will review within 3-5 business days.",
    category: "transfer",
  },
  {
    question: "How do I report an internet issue?",
    answer: "Go to Requests → New Request → Maintenance → Internet. Describe the issue and our IT team will contact you within 24 hours.",
    category: "maintenance",
  },
  {
    question: "What documents are required?",
    answer: "Required documents include: Citizen ID, Temporary Residence Form, Student Card. You can upload them in Residence → Documents.",
    category: "documents",
  },
  {
    question: "When is quiet hour?",
    answer: "Quiet hours are from 10:00 PM to 6:00 AM daily. During exam period, quiet hours are extended to 9:00 PM - 7:00 AM.",
    category: "policy",
  },
  {
    question: "How can I join an event?",
    answer: "Go to Community → Events, browse upcoming events, and click 'Join Event' on any event you're interested in.",
    category: "event",
  },
  {
    question: "How do I report a maintenance issue?",
    answer: "Go to Requests → New Request → Maintenance. Select the appropriate category (Electrical, Plumbing, Internet, etc.) and describe the issue.",
    category: "maintenance",
  },
  {
    question: "My AC is not working",
    answer: "Go to Requests → New Request → Maintenance → Equipment. Our maintenance team will be assigned within 24 hours.",
    category: "maintenance",
  },
  {
    question: "There is water leakage in my bathroom",
    answer: "Go to Requests → New Request → Maintenance → Plumbing. This is considered high priority and will be addressed urgently.",
    category: "maintenance",
  },
  {
    question: "How do I make a complaint about noise?",
    answer: "Go to Requests → New Request → Complaint → Noise. Describe the situation including time and room number.",
    category: "policy",
  },
];

export const findAnswer = (question: string): string | null => {
  const lowerQuestion = question.toLowerCase();
  const matched = faqDatabase.find(item => 
    lowerQuestion.includes(item.question.toLowerCase()) ||
    item.question.toLowerCase().includes(lowerQuestion)
  );
  return matched?.answer || null;
};

export const getAiResponse = async (question: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const faqAnswer = findAnswer(question);
  if (faqAnswer) return faqAnswer;
  
  return `Thank you for your question. I've noted your concern: "${question}". A residence staff member will review this and get back to you within 24 hours. You can also submit this as a formal request in the Requests section.`;
};