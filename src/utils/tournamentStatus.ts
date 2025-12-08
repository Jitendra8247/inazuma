// Tournament Status Utilities
// Real-time status checking based on date and time

import { Tournament } from '@/data/mockData';

/**
 * Combine date and time into a single Date object
 */
export function combineDateAndTime(dateStr: string | Date, timeStr?: string): Date {
  const date = new Date(dateStr);
  if (!timeStr) return date;
  
  const [hours, minutes] = timeStr.split(':');
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  date.setSeconds(0);
  date.setMilliseconds(0);
  
  return date;
}

/**
 * Get the real-time status of a tournament based on current time
 * This overrides the database status if the tournament has passed
 */
export function getRealTimeStatus(tournament: Tournament): Tournament['status'] {
  const now = new Date();
  const tournamentStartDateTime = combineDateAndTime(
    tournament.startDate,
    tournament.startTime
  );
  
  // If tournament start time has passed and it's marked as upcoming, it should be completed
  if (tournament.status === 'upcoming' && tournamentStartDateTime < now) {
    return 'completed';
  }
  
  // Otherwise return the database status
  return tournament.status;
}

/**
 * Check if a tournament has passed its start time
 */
export function hasTournamentPassed(tournament: Tournament): boolean {
  const now = new Date();
  const tournamentStartDateTime = combineDateAndTime(
    tournament.startDate,
    tournament.startTime
  );
  
  return tournamentStartDateTime < now;
}

/**
 * Check if a tournament is currently accepting registrations
 */
export function canRegister(tournament: Tournament): boolean {
  const realStatus = getRealTimeStatus(tournament);
  const isFull = tournament.registeredTeams >= tournament.maxTeams;
  const hasNotPassed = !hasTournamentPassed(tournament);
  
  return realStatus === 'upcoming' && !isFull && hasNotPassed;
}
