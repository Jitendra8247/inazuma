// HowItWorks component - Steps section explaining the platform

import { motion } from 'framer-motion';
import { UserPlus, Search, Gamepad2, Trophy } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up for free and set up your player profile in seconds.',
    color: 'primary'
  },
  {
    icon: Search,
    title: 'Find Tournaments',
    description: 'Browse upcoming tournaments and find the perfect match for your skill level.',
    color: 'secondary'
  },
  {
    icon: Gamepad2,
    title: 'Register & Compete',
    description: 'Register your team, prepare your strategy, and battle your way to victory.',
    color: 'accent'
  },
  {
    icon: Trophy,
    title: 'Win & Earn',
    description: 'Climb the leaderboard, win prizes, and build your eSports legacy.',
    color: 'primary'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function HowItWorks() {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold mb-4"
          >
            How It <span className="text-primary">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Get started in four simple steps and begin your journey to eSports glory
          </motion.p>
        </div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              <div className="p-6 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 h-full">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-background border border-primary/50 flex items-center justify-center">
                  <span className="font-display text-sm text-primary">{index + 1}</span>
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-lg bg-${step.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className={`h-7 w-7 text-${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="font-display text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>

              {/* Connector Line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
