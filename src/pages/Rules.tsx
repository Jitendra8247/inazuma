// Rules & Guidelines Page

import { motion } from 'framer-motion';
import { Shield, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Rules() {
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="font-display text-3xl md:text-4xl font-bold">Rules & Guidelines</h1>
          </div>
          <p className="text-muted-foreground">
            Please read and follow these rules to ensure fair play and a great experience for everyone.
          </p>
        </motion.div>

        {/* General Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              General Tournament Rules
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <span className="text-muted-foreground">All players must be registered and verified before participating in any tournament.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <span className="text-muted-foreground">Players must join the tournament room 10 minutes before the scheduled start time.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <span className="text-muted-foreground">Team names and player names must be appropriate and not contain offensive language.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                <span className="text-muted-foreground">All players must have sufficient wallet balance to pay the entry fee before registration.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
                <span className="text-muted-foreground">Tournament organizers reserve the right to disqualify any player for rule violations.</span>
              </li>
            </ul>
          </Card>
        </motion.div>

        {/* Fair Play */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Fair Play & Anti-Cheat
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Use of emulators is strictly prohibited. Only mobile devices are allowed.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Any form of hacking, cheating, or use of third-party software will result in immediate disqualification and ban.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Stream sniping and ghosting are prohibited and will be penalized.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Players must record their gameplay if requested by organizers for verification.</span>
              </li>
            </ul>
          </Card>
        </motion.div>

        {/* Prohibited Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Prohibited Actions
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Teaming up with opponents in solo/duo modes</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Intentionally disconnecting or leaving matches</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Abusive behavior, harassment, or toxic communication</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Sharing room credentials with non-registered players</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Multiple account registrations for the same tournament</span>
              </li>
            </ul>
          </Card>
        </motion.div>

        {/* Disputes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Disputes & Appeals
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <span className="text-muted-foreground">All disputes must be reported within 15 minutes of the incident.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <span className="text-muted-foreground">Players must provide evidence (screenshots, recordings) to support their claims.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <span className="text-muted-foreground">Tournament organizers' decisions are final and binding.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                <span className="text-muted-foreground">False reports or abuse of the dispute system will result in penalties.</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
