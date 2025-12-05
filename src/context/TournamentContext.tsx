// TournamentContext - Manages tournaments and registrations state

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Tournament, Registration } from '@/data/mockData';
import { tournamentsAPI, registrationsAPI } from '@/services/api';
import { useAuth } from './AuthContext';

interface TournamentContextType {
  tournaments: Tournament[];
  myTournaments: Tournament[];
  registrations: Registration[];
  isLoading: boolean;
  getTournamentById: (id: string) => Tournament | undefined;
  getRegistrationsByTournament: (tournamentId: string) => Registration[];
  getRegistrationsByPlayer: (playerId: string) => Registration[];
  registerForTournament: (registration: Omit<Registration, 'id' | 'registeredAt' | 'status'>) => Promise<{ success: boolean; error?: string }>;
  createTournament: (tournament: Omit<Tournament, 'id' | 'registeredTeams'>) => Promise<{ success: boolean; tournament?: Tournament }>;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  isPlayerRegistered: (tournamentId: string, playerId: string) => boolean;
  refreshTournaments: () => Promise<void>;
  refreshMyTournaments: () => Promise<void>;
  refreshRegistrations: () => Promise<void>;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function TournamentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [myTournaments, setMyTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all tournaments from API
  const refreshTournaments = useCallback(async () => {
    try {
      const response = await tournamentsAPI.getAllTournaments();
      if (response.success && response.tournaments) {
        const formattedTournaments = response.tournaments.map((t: any) => ({
          id: t._id || t.id,
          name: t.name,
          game: t.game,
          mode: t.mode,
          prizePool: t.prizePool,
          entryFee: t.entryFee,
          maxTeams: t.maxTeams,
          registeredTeams: t.registeredTeams,
          startDate: t.startDate,
          startTime: t.startTime,
          endDate: t.endDate,
          status: t.status,
          description: t.description,
          rules: t.rules,
          organizer: t.organizer,
          organizerId: t.organizerId,
          region: t.region,
          platform: t.platform,
          image: t.image,
          roomId: t.roomId,
          roomPassword: t.roomPassword,
          roomCredentialsAvailable: t.roomCredentialsAvailable,
          archivedAt: t.archivedAt
        }));
        setTournaments(formattedTournaments);
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  }, []);

  // Fetch user's registrations from API
  const refreshRegistrations = useCallback(async () => {
    if (!user) {
      setRegistrations([]);
      return;
    }
    
    try {
      const response = await registrationsAPI.getMyRegistrations();
      if (response.success && response.registrations) {
        const formattedRegistrations = response.registrations.map((r: any) => ({
          id: r._id || r.id,
          tournamentId: r.tournamentId?._id || r.tournamentId,
          playerId: r.playerId,
          playerName: r.playerName,
          teamName: r.teamName,
          email: r.email,
          phone: r.phone,
          inGameId: r.inGameId,
          status: r.status,
          registeredAt: r.registeredAt
        }));
        setRegistrations(formattedRegistrations);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  }, [user]);

  // Fetch user's tournaments (including archived ones)
  const refreshMyTournaments = useCallback(async () => {
    if (!user) {
      setMyTournaments([]);
      return;
    }
    
    try {
      const response = await tournamentsAPI.getMyTournaments();
      if (response.success && response.tournaments) {
        const formattedTournaments = response.tournaments.map((t: any) => ({
          id: t._id || t.id,
          name: t.name,
          game: t.game,
          mode: t.mode,
          prizePool: t.prizePool,
          entryFee: t.entryFee,
          maxTeams: t.maxTeams,
          registeredTeams: t.registeredTeams,
          startDate: t.startDate,
          startTime: t.startTime,
          endDate: t.endDate,
          status: t.status,
          description: t.description,
          rules: t.rules,
          organizer: t.organizer,
          organizerId: t.organizerId,
          region: t.region,
          platform: t.platform,
          image: t.image,
          roomId: t.roomId,
          roomPassword: t.roomPassword,
          roomCredentialsAvailable: t.roomCredentialsAvailable,
          archivedAt: t.archivedAt
        }));
        setMyTournaments(formattedTournaments);
      }
    } catch (error) {
      console.error('Error fetching my tournaments:', error);
    }
  }, [user]);

  // Load tournaments on mount
  useEffect(() => {
    refreshTournaments();
  }, [refreshTournaments]);

  // Load user's tournaments when user changes
  useEffect(() => {
    refreshMyTournaments();
  }, [refreshMyTournaments]);

  // Load registrations when user changes
  useEffect(() => {
    refreshRegistrations();
  }, [refreshRegistrations]);

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

  // Register a player/team for a tournament - uses API (backend handles wallet deduction)
  const registerForTournament = useCallback(async (
    registration: Omit<Registration, 'id' | 'registeredAt' | 'status'>
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const response = await registrationsAPI.registerForTournament({
        tournamentId: registration.tournamentId,
        teamName: registration.teamName,
        email: registration.email,
        phone: registration.phone,
        inGameId: registration.inGameId
      });

      if (response.success) {
        // Refresh both tournaments and registrations to get updated data
        await Promise.all([refreshTournaments(), refreshRegistrations()]);
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: response.message || 'Registration failed' };
    } catch (error: any) {
      setIsLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  }, [refreshTournaments, refreshRegistrations]);

  // Create a new tournament (for organizers) - uses API
  const createTournament = useCallback(async (
    tournamentData: Omit<Tournament, 'id' | 'registeredTeams'>
  ): Promise<{ success: boolean; tournament?: Tournament }> => {
    setIsLoading(true);

    try {
      const response = await tournamentsAPI.createTournament(tournamentData);

      if (response.success && response.tournament) {
        await refreshTournaments();
        setIsLoading(false);
        return { success: true, tournament: response.tournament };
      }

      setIsLoading(false);
      return { success: false };
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error creating tournament:', error);
      return { success: false };
    }
  }, [refreshTournaments]);

  // Update an existing tournament - uses API
  const updateTournament = useCallback(async (id: string, updates: Partial<Tournament>) => {
    try {
      await tournamentsAPI.updateTournament(id, updates);
      await refreshTournaments();
    } catch (error) {
      console.error('Error updating tournament:', error);
    }
  }, [refreshTournaments]);

  // Delete a tournament - uses API
  const deleteTournament = useCallback(async (id: string) => {
    try {
      const response = await tournamentsAPI.deleteTournament(id);
      if (response.success) {
        await refreshTournaments();
      }
      return response;
    } catch (error) {
      console.error('Error deleting tournament:', error);
      throw error;
    }
  }, [refreshTournaments]);

  return (
    <TournamentContext.Provider value={{
      tournaments,
      myTournaments,
      registrations,
      isLoading,
      getTournamentById,
      getRegistrationsByTournament,
      getRegistrationsByPlayer,
      registerForTournament,
      createTournament,
      updateTournament,
      deleteTournament,
      isPlayerRegistered,
      refreshTournaments,
      refreshMyTournaments,
      refreshRegistrations
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
