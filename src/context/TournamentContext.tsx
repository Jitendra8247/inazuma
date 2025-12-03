// TournamentContext - Manages tournaments and registrations state

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Tournament, Registration, mockTournaments, mockRegistrations } from '@/data/mockData';

interface TournamentContextType {
  tournaments: Tournament[];
  registrations: Registration[];
  getTournamentById: (id: string) => Tournament | undefined;
  getRegistrationsByTournament: (tournamentId: string) => Registration[];
  getRegistrationsByPlayer: (playerId: string) => Registration[];
  registerForTournament: (registration: Omit<Registration, 'id' | 'registeredAt' | 'status'>) => Promise<{ success: boolean; error?: string }>;
  createTournament: (tournament: Omit<Tournament, 'id' | 'registeredTeams'>) => Promise<{ success: boolean; tournament?: Tournament }>;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  isPlayerRegistered: (tournamentId: string, playerId: string) => boolean;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>(mockTournaments);
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);

  // Get a single tournament by ID
  const getTournamentById = useCallback((id: string) => {
    return tournaments.find(t => t.id === id);
  }, [tournaments]);

  // Get all registrations for a specific tournament
  const getRegistrationsByTournament = useCallback((tournamentId: string) => {
    return registrations.filter(r => r.tournamentId === tournamentId);
  }, [registrations]);

  // Get all registrations for a specific player
  const getRegistrationsByPlayer = useCallback((playerId: string) => {
    return registrations.filter(r => r.playerId === playerId);
  }, [registrations]);

  // Check if a player is already registered for a tournament
  const isPlayerRegistered = useCallback((tournamentId: string, playerId: string) => {
    return registrations.some(r => r.tournamentId === tournamentId && r.playerId === playerId);
  }, [registrations]);

  // Register a player/team for a tournament
  const registerForTournament = useCallback(async (
    registration: Omit<Registration, 'id' | 'registeredAt' | 'status'>
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const tournament = tournaments.find(t => t.id === registration.tournamentId);
    
    if (!tournament) {
      return { success: false, error: 'Tournament not found' };
    }

    if (tournament.registeredTeams >= tournament.maxTeams) {
      return { success: false, error: 'Tournament is full' };
    }

    if (tournament.status === 'completed') {
      return { success: false, error: 'Tournament has already ended' };
    }

    if (isPlayerRegistered(registration.tournamentId, registration.playerId)) {
      return { success: false, error: 'You are already registered for this tournament' };
    }

    const newRegistration: Registration = {
      ...registration,
      id: `r${Date.now()}`,
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'confirmed'
    };

    setRegistrations(prev => [...prev, newRegistration]);
    
    // Update tournament registered teams count
    setTournaments(prev => prev.map(t => 
      t.id === registration.tournamentId 
        ? { ...t, registeredTeams: t.registeredTeams + 1 }
        : t
    ));

    return { success: true };
  }, [tournaments, isPlayerRegistered]);

  // Create a new tournament (for organizers)
  const createTournament = useCallback(async (
    tournamentData: Omit<Tournament, 'id' | 'registeredTeams'>
  ): Promise<{ success: boolean; tournament?: Tournament }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newTournament: Tournament = {
      ...tournamentData,
      id: `t${Date.now()}`,
      registeredTeams: 0
    };

    setTournaments(prev => [...prev, newTournament]);
    return { success: true, tournament: newTournament };
  }, []);

  // Update an existing tournament
  const updateTournament = useCallback((id: string, updates: Partial<Tournament>) => {
    setTournaments(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  }, []);

  // Delete a tournament
  const deleteTournament = useCallback((id: string) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
    setRegistrations(prev => prev.filter(r => r.tournamentId !== id));
  }, []);

  return (
    <TournamentContext.Provider value={{
      tournaments,
      registrations,
      getTournamentById,
      getRegistrationsByTournament,
      getRegistrationsByPlayer,
      registerForTournament,
      createTournament,
      updateTournament,
      deleteTournament,
      isPlayerRegistered
    }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournaments() {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournaments must be used within a TournamentProvider');
  }
  return context;
}
