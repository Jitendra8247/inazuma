// Tournaments Page - Browse and filter all tournaments

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import TournamentCard from '@/components/tournaments/TournamentCard';
import Filters from '@/components/tournaments/Filters';
import { useTournaments } from '@/context/TournamentContext';
import { getRealTimeStatus } from '@/utils/tournamentStatus';

export default function Tournaments() {
  const { tournaments } = useTournaments();
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');

  // Apply filters
  const filteredTournaments = useMemo(() => {
    return tournaments.filter(tournament => {
      // Get real-time status
      const realTimeStatus = getRealTimeStatus(tournament);
      
      // By default, exclude completed tournaments unless specifically filtered
      if (statusFilter === 'all' && realTimeStatus === 'completed') {
        return false;
      }
      
      // Search filter
      const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tournament.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tournament.organizer.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter (use real-time status)
      const matchesStatus = statusFilter === 'all' || realTimeStatus === statusFilter;
      
      // Mode filter
      const matchesMode = modeFilter === 'all' || tournament.mode === modeFilter;

      return matchesSearch && matchesStatus && matchesMode;
    });
  }, [tournaments, searchQuery, statusFilter, modeFilter]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || modeFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setModeFilter('all');
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="font-display text-3xl md:text-4xl font-bold">Tournaments</h1>
          </div>
          <p className="text-muted-foreground">
            Browse and join exciting tournaments from across the region
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Filters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            modeFilter={modeFilter}
            onModeChange={setModeFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </motion.div>

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground mb-6"
        >
          Showing {filteredTournaments.length} tournament{filteredTournaments.length !== 1 ? 's' : ''}
        </motion.p>

        {/* Tournament Grid */}
        {filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TournamentCard tournament={tournament} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">No tournaments found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
