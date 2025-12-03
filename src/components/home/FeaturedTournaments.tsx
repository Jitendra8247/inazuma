// FeaturedTournaments component - Showcases upcoming/featured tournaments

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TournamentCard from '@/components/tournaments/TournamentCard';
import { useTournaments } from '@/context/TournamentContext';

export default function FeaturedTournaments() {
  const { tournaments } = useTournaments();
  
  // Get featured tournaments (upcoming ones with highest prize pools)
  const featuredTournaments = tournaments
    .filter(t => t.status === 'upcoming')
    .sort((a, b) => b.prizePool - a.prizePool)
    .slice(0, 3);

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold mb-2"
            >
              Featured <span className="text-primary">Tournaments</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Join the hottest upcoming competitions
            </motion.p>
          </div>
          
          <Button variant="outline" asChild>
            <Link to="/tournaments">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Tournament Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuredTournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <TournamentCard tournament={tournament} featured={index === 0} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
