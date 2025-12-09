// FAQ Page

import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';

const faqs = [
  {
    question: 'How do I register for a tournament?',
    answer: 'Browse available tournaments, click on the tournament you want to join, and click the "Register Now" button. Make sure you have sufficient wallet balance to pay the entry fee.'
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'You can add funds to your wallet using UPI, bank transfer, or other supported payment methods. Once your wallet is funded, you can use it to pay tournament entry fees.'
  },
  {
    question: 'How do I receive my winnings?',
    answer: 'Winnings are automatically credited to your wallet after the tournament results are announced. You can then withdraw the funds to your bank account.'
  },
  {
    question: 'Can I cancel my tournament registration?',
    answer: 'Cancellations are allowed up to 1 hour before the tournament start time. The entry fee will be refunded to your wallet minus a small processing fee.'
  },
  {
    question: 'What happens if I miss the tournament start time?',
    answer: 'Players must join the tournament room at least 10 minutes before the start time. Late entries may not be allowed, and entry fees are non-refundable for no-shows.'
  },
  {
    question: 'How are tournament winners determined?',
    answer: 'Winners are determined based on the tournament format (kills, placement, points, etc.). Results are verified by organizers and announced after the tournament ends.'
  },
  {
    question: 'Can I play on an emulator?',
    answer: 'No, emulators are strictly prohibited. Only mobile devices are allowed to ensure fair play for all participants.'
  },
  {
    question: 'What should I do if I face technical issues during a tournament?',
    answer: 'Report technical issues immediately to the tournament organizer through the support channel. Provide screenshots or evidence of the issue.'
  },
  {
    question: 'How do I become a tournament organizer?',
    answer: 'Contact our support team to apply for an organizer account. Organizers must meet certain requirements and agree to our terms of service.'
  },
  {
    question: 'Are there age restrictions for participating?',
    answer: 'Players must be at least 16 years old to participate in tournaments. Some tournaments may have additional age requirements.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="font-display text-3xl md:text-4xl font-bold">Frequently Asked Questions</h1>
          </div>
          <p className="text-muted-foreground">
            Find answers to common questions about tournaments, payments, and more.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="p-4 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold pr-4">{faq.question}</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 pt-3 border-t border-border/50"
                  >
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="p-6 text-center">
            <h3 className="font-display text-lg font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find the answer you're looking for? Contact our support team.
            </p>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
