// Terms of Service Page

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Terms() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="font-display text-3xl md:text-4xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground">Last updated: December 2024</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Inazuma Battle platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-3">2. User Accounts</h2>
            <p className="text-muted-foreground mb-3">
              When you create an account with us, you must provide accurate and complete information. You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Maintaining the security of your account and password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-3">3. Tournament Participation</h2>
            <p className="text-muted-foreground mb-3">
              By participating in tournaments, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Follow all tournament rules and guidelines</li>
              <li>Play fairly without cheating or exploiting</li>
              <li>Respect other players and organizers</li>
              <li>Accept organizers' decisions as final</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-3">4. Payments and Refunds</h2>
            <p className="text-muted-foreground mb-3">
              All payments are processed securely through our platform. Please note:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Entry fees are non-refundable once the tournament starts</li>
              <li>Refunds for cancelled tournaments will be processed within 7 business days</li>
              <li>Winnings will be credited to your wallet after result verification</li>
              <li>Withdrawal requests are processed within 3-5 business days</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-3">5. Prohibited Conduct</h2>
            <p className="text-muted-foreground mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Use cheats, hacks, or unauthorized third-party software</li>
              <li>Engage in harassment, abuse, or toxic behavior</li>
              <li>Create multiple accounts to circumvent restrictions</li>
              <li>Share account credentials with others</li>
              <li>Attempt to manipulate tournament results</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-3">6. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content on this platform, including text, graphics, logos, and software, is the property of Inazuma Battle and protected by copyright laws. You may not reproduce, distribute, or create derivative works without our permission.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-3">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Inazuma Battle shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform or participation in tournaments.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-3">8. Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-3">9. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will notify users of any material changes. Your continued use of the platform after such modifications constitutes acceptance of the updated terms.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-3">10. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us through our support channels.
            </p>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
