// Mock data for Inazuma Battle tournament platform

export interface Tournament {
  id: string;
  name: string;
  game: string;
  mode: string;
  prizePool: number;
  entryFee: number;
  maxTeams: number;
  registeredTeams: number;
  startDate: string;
  startTime?: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  image: string;
  description: string;
  rules: string[];
  organizer: string;
  organizerId: string;
  region: string;
  platform: string;
  roomId?: string;
  roomPassword?: string;
  roomCredentialsAvailable?: boolean;
  archivedAt?: string;
}

export interface Player {
  id: string;
  username: string;
  avatar: string;
  rank: string;
  kills: number;
  wins: number;
  matches: number;
  team?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
  role: 'player' | 'organizer';
  stats: {
    tournamentsPlayed: number;
    tournamentsWon: number;
    totalEarnings: number;
    totalFinishes: number;
    rank: string;
  };
}

export interface Registration {
  id: string;
  tournamentId: string;
  playerId: string;
  playerName: string;
  teamName: string;
  registeredAt: string;
  status: 'pending' | 'confirmed' | 'rejected';
}

// Mock tournaments data
export const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'Inazuma Pro League Season 5',
    game: 'BGMI',
    mode: 'Squad',
    prizePool: 500000,
    entryFee: 0,
    maxTeams: 64,
    registeredTeams: 48,
    startDate: '2024-02-15',
    endDate: '2024-02-20',
    status: 'upcoming',
    image: '/placeholder.svg',
    description: 'The premier BGMI tournament featuring top teams from across India. Compete for glory and massive prize pools in this elite competition.',
    rules: [
      'Teams must have 4 players',
      'All players must be 18+',
      'No emulators allowed',
      'Anti-cheat must be enabled',
      'Stream sniping is prohibited',
      'Match disputes must be reported within 15 minutes'
    ],
    organizer: 'Inazuma eSports',
    organizerId: 'org1',
    region: 'India',
    platform: 'Mobile'
  },
  {
    id: '2',
    name: 'Neon Nights Championship',
    game: 'BGMI',
    mode: 'Duo',
    prizePool: 200000,
    entryFee: 500,
    maxTeams: 50,
    registeredTeams: 50,
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    status: 'ongoing',
    image: '/placeholder.svg',
    description: 'Fast-paced duo battles under the neon lights. Show your synergy and dominate the battlefield.',
    rules: [
      'Teams of 2 players',
      'Entry fee required',
      'Double elimination format',
      'Fair play policy enforced'
    ],
    organizer: 'CyberArena',
    organizerId: 'org2',
    region: 'Asia Pacific',
    platform: 'Mobile'
  },
  {
    id: '3',
    name: 'Cyber Storm Invitational',
    game: 'BGMI',
    mode: 'Squad',
    prizePool: 1000000,
    entryFee: 0,
    maxTeams: 32,
    registeredTeams: 32,
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    status: 'completed',
    image: '/placeholder.svg',
    description: 'Invite-only tournament for the best of the best. Only elite teams qualify for this prestigious event.',
    rules: [
      'Invite only',
      'Professional teams',
      'LAN finals',
      'Strict anti-cheat measures'
    ],
    organizer: 'Storm Gaming',
    organizerId: 'org1',
    region: 'Global',
    platform: 'Mobile'
  },
  {
    id: '4',
    name: 'Rising Stars Cup',
    game: 'BGMI',
    mode: 'Squad',
    prizePool: 100000,
    entryFee: 200,
    maxTeams: 100,
    registeredTeams: 67,
    startDate: '2024-02-25',
    endDate: '2024-02-27',
    status: 'upcoming',
    image: '/placeholder.svg',
    description: 'Platform for upcoming talents to showcase their skills and get noticed by professional organizations.',
    rules: [
      'Open registration',
      'Amateur teams only',
      'No previous tournament winners',
      'Age 16+'
    ],
    organizer: 'NextGen Gaming',
    organizerId: 'org2',
    region: 'India',
    platform: 'Mobile'
  },
  {
    id: '5',
    name: 'Midnight Mayhem Solo',
    game: 'BGMI',
    mode: 'Solo',
    prizePool: 50000,
    entryFee: 100,
    maxTeams: 100,
    registeredTeams: 89,
    startDate: '2024-02-18',
    endDate: '2024-02-18',
    status: 'upcoming',
    image: '/placeholder.svg',
    description: 'One night. One winner. Solo players battle it out in this intense single-day tournament.',
    rules: [
      'Solo mode only',
      'Single elimination',
      'No teaming',
      'TPP perspective'
    ],
    organizer: 'Inazuma eSports',
    organizerId: 'org1',
    region: 'India',
    platform: 'Mobile'
  },
  {
    id: '6',
    name: 'Elite Warriors League',
    game: 'BGMI',
    mode: 'Squad',
    prizePool: 750000,
    entryFee: 1000,
    maxTeams: 48,
    registeredTeams: 35,
    startDate: '2024-03-01',
    endDate: '2024-03-10',
    status: 'upcoming',
    image: '/placeholder.svg',
    description: 'High-stakes tournament for experienced teams. Prove your worth in the arena of champions.',
    rules: [
      'Minimum 100 matches required',
      'Team verification required',
      'High entry fee',
      'Premium support'
    ],
    organizer: 'Elite Gaming Co',
    organizerId: 'org2',
    region: 'South Asia',
    platform: 'Mobile'
  }
];

// Mock registered players for tournaments
export const mockPlayers: Player[] = [
  { id: 'p1', username: 'ShadowStrike', avatar: '/placeholder.svg', rank: 'Ace', kills: 1523, wins: 89, matches: 456, team: 'Team Phantom' },
  { id: 'p2', username: 'NeonAssassin', avatar: '/placeholder.svg', rank: 'Conqueror', kills: 2341, wins: 156, matches: 678, team: 'Cyber Warriors' },
  { id: 'p3', username: 'ThunderBolt', avatar: '/placeholder.svg', rank: 'Crown', kills: 987, wins: 45, matches: 234, team: 'Storm Squad' },
  { id: 'p4', username: 'PhantomX', avatar: '/placeholder.svg', rank: 'Ace', kills: 1876, wins: 112, matches: 543, team: 'Team Phantom' },
  { id: 'p5', username: 'CyberKnight', avatar: '/placeholder.svg', rank: 'Diamond', kills: 654, wins: 34, matches: 189, team: 'Digital Force' },
  { id: 'p6', username: 'BlazeFury', avatar: '/placeholder.svg', rank: 'Crown', kills: 1234, wins: 78, matches: 345, team: 'Fire Legion' },
  { id: 'p7', username: 'VortexPro', avatar: '/placeholder.svg', rank: 'Conqueror', kills: 2890, wins: 203, matches: 789, team: 'Vortex Gaming' },
  { id: 'p8', username: 'NightHawk', avatar: '/placeholder.svg', rank: 'Ace', kills: 1567, wins: 92, matches: 467, team: 'Dark Ravens' },
];

// Mock registrations
export const mockRegistrations: Registration[] = [
  { id: 'r1', tournamentId: '1', playerId: 'p1', playerName: 'ShadowStrike', teamName: 'Team Phantom', registeredAt: '2024-02-01', status: 'confirmed' },
  { id: 'r2', tournamentId: '1', playerId: 'p2', playerName: 'NeonAssassin', teamName: 'Cyber Warriors', registeredAt: '2024-02-02', status: 'confirmed' },
  { id: 'r3', tournamentId: '1', playerId: 'p3', playerName: 'ThunderBolt', teamName: 'Storm Squad', registeredAt: '2024-02-03', status: 'pending' },
  { id: 'r4', tournamentId: '2', playerId: 'p4', playerName: 'PhantomX', teamName: 'Team Phantom', registeredAt: '2024-02-05', status: 'confirmed' },
  { id: 'r5', tournamentId: '4', playerId: 'p5', playerName: 'CyberKnight', teamName: 'Digital Force', registeredAt: '2024-02-10', status: 'confirmed' },
];

// Mock bracket data for tournament view
export interface BracketMatch {
  id: string;
  round: number;
  team1: string;
  team2: string;
  score1?: number;
  score2?: number;
  winner?: string;
}

export const mockBracket: BracketMatch[] = [
  // Round 1
  { id: 'b1', round: 1, team1: 'Team Phantom', team2: 'Storm Squad', score1: 15, score2: 8, winner: 'Team Phantom' },
  { id: 'b2', round: 1, team1: 'Cyber Warriors', team2: 'Digital Force', score1: 12, score2: 10, winner: 'Cyber Warriors' },
  { id: 'b3', round: 1, team1: 'Vortex Gaming', team2: 'Fire Legion', score1: 18, score2: 14, winner: 'Vortex Gaming' },
  { id: 'b4', round: 1, team1: 'Dark Ravens', team2: 'Nova Esports', score1: 11, score2: 9, winner: 'Dark Ravens' },
  // Round 2
  { id: 'b5', round: 2, team1: 'Team Phantom', team2: 'Cyber Warriors', score1: 20, score2: 16, winner: 'Team Phantom' },
  { id: 'b6', round: 2, team1: 'Vortex Gaming', team2: 'Dark Ravens', score1: 14, score2: 17, winner: 'Dark Ravens' },
  // Finals
  { id: 'b7', round: 3, team1: 'Team Phantom', team2: 'Dark Ravens' },
];
