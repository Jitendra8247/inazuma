// CTA component - Call to action section

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function CTA() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/30 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
            <Zap className="h-8 w-8 text-primary" />
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Ready to{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dominate
            </span>
            ?
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of players competing for glory and massive prize pools. 
            Your journey to eSports stardom starts here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated && (
              <Button variant="neon" size="xl" asChild>
                <Link to="/register">
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Your Journey
                </Link>
              </Button>
            )}
            {isAuthenticated && (
              <Button variant="neon" size="xl" asChild>
                <Link to="/dashboard">
                  <Rocket className="h-5 w-5 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
            )}
            <Button variant="outline" size="xl" asChild>
              <Link to="/tournaments">
                Explore Tournaments
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Free to Join
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Instant Payouts
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              24/7 Support
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
