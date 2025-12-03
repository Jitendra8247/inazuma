// Benefits component - Platform benefits section

import { motion } from 'framer-motion';
import { Shield, Wallet, Users, Headphones, Award, Clock } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'Fair Play Guaranteed',
    description: 'Advanced anti-cheat systems ensure every match is played fairly.'
  },
  {
    icon: Wallet,
    title: 'Secure Payments',
    description: 'Fast and secure prize pool distributions directly to your account.'
  },
  {
    icon: Users,
    title: 'Growing Community',
    description: 'Join 50,000+ players and make connections that last beyond the game.'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our dedicated support team is always ready to help you.'
  },
  {
    icon: Award,
    title: 'Recognition & Rewards',
    description: 'Earn badges, climb leaderboards, and get noticed by pro teams.'
  },
  {
    icon: Clock,
    title: 'Regular Events',
    description: 'Daily, weekly, and monthly tournaments to keep you in action.'
  }
];

export default function Benefits() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold mb-4"
          >
            Why Choose <span className="text-secondary">Inazuma</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            We're committed to providing the best tournament experience for every player
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-lg bg-card/50 border border-border/50 hover:border-secondary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <benefit.icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
