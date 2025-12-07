// Dashboard Page - Organizer dashboard with stats and tournament management

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Users, DollarSign, Calendar, Plus, 
  MoreVertical, Eye, Edit, Trash2, TrendingUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import StatsCard from '@/components/dashboard/StatsCard';
import { useAuth } from '@/context/AuthContext';
import { useTournaments } from '@/context/TournamentContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { tournaments, createTournament, deleteTournament, updateTournament } = useTournaments();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTournament, setEditingTournament] = useState<any>(null);

  // Mock organizer stats
  const organizerStats = {
    totalTournaments: tournaments.length,
    totalParticipants: tournaments.reduce((acc, t) => acc + t.registeredTeams, 0),
    totalPrizePool: tournaments.reduce((acc, t) => acc + t.prizePool, 0),
    activeTournaments: tournaments.filter(t => t.status === 'ongoing').length
  };

  // Create tournament handler
  const handleCreateTournament = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);

    const formData = new FormData(e.currentTarget);
    
    // Handle image upload
    const imageFile = formData.get('image') as File;
    let imageUrl = '/placeholder.svg';
    
    if (imageFile && imageFile.size > 0) {
      // Convert image to base64
      const reader = new FileReader();
      imageUrl = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }
    
    const result = await createTournament({
      name: formData.get('name') as string,
      game: 'BGMI',
      mode: formData.get('mode') as string,
      prizePool: parseInt(formData.get('prizePool') as string),
      entryFee: parseInt(formData.get('entryFee') as string) || 0,
      maxTeams: parseInt(formData.get('maxTeams') as string),
      startDate: formData.get('startDate') as string,
      startTime: formData.get('startTime') as string,
      endDate: formData.get('endDate') as string || null,
      status: 'upcoming',
      image: imageUrl,
      description: formData.get('description') as string,
      rules: ['Standard tournament rules apply'],
      organizer: user?.username || 'Unknown',
      organizerId: user?._id,
      region: 'India',
      platform: 'Mobile'
    });

    setIsCreating(false);
    setIsCreateDialogOpen(false);

    if (result.success) {
      toast({
        title: 'Tournament Created!',
        description: 'Your tournament has been created successfully.',
      });
    }
  };

  const handleEditTournament = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTournament) return;
    
    setIsCreating(true);
    const formData = new FormData(e.currentTarget);
    
    // Handle image upload
    const imageFile = formData.get('image') as File;
    let imageUrl = editingTournament.image || '/placeholder.svg';
    
    if (imageFile && imageFile.size > 0) {
      const reader = new FileReader();
      imageUrl = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }
    
    updateTournament(editingTournament.id, {
      name: formData.get('name') as string,
      mode: formData.get('mode') as string,
      prizePool: parseInt(formData.get('prizePool') as string),
      entryFee: parseInt(formData.get('entryFee') as string) || 0,
      maxTeams: parseInt(formData.get('maxTeams') as string),
      startDate: formData.get('startDate') as string,
      startTime: formData.get('startTime') as string,
      endDate: formData.get('endDate') as string || null,
      image: imageUrl,
      description: formData.get('description') as string,
    });
    
    setIsCreating(false);
    setIsEditDialogOpen(false);
    setEditingTournament(null);
    
    toast({
      title: 'Tournament Updated!',
      description: 'Your tournament has been updated successfully.',
    });
  };

  const handleDeleteTournament = async (id: string, name: string) => {
    try {
      await deleteTournament(id);
      toast({
        title: 'Tournament Deleted',
        description: `${name} has been deleted.`,
      });
    } catch (error: any) {
      toast({
        title: 'Delete Failed',
        description: error.response?.data?.message || 'Failed to delete tournament',
        variant: 'destructive',
      });
    }
  };

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Organizer Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.username}! Manage your tournaments here.
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="neon">
                <Plus className="h-4 w-4 mr-2" />
                Create Tournament
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">Create New Tournament</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTournament} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tournament Name</Label>
                  <Input id="name" name="name" placeholder="Enter tournament name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Tournament Image (Optional)</Label>
                  <Input 
                    id="image" 
                    name="image" 
                    type="file" 
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const preview = document.getElementById('imagePreview') as HTMLImageElement;
                          if (preview) {
                            preview.src = reader.result as string;
                            preview.classList.remove('hidden');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <img 
                    id="imagePreview" 
                    className="hidden w-full h-32 object-cover rounded-md mt-2" 
                    alt="Preview" 
                  />
                  <p className="text-xs text-muted-foreground">Upload an image for your tournament (JPG, PNG, max 2MB)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mode">Mode</Label>
                    <select
                      id="mode"
                      name="mode"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      required
                    >
                      <option value="Solo">Solo</option>
                      <option value="Duo">Duo</option>
                      <option value="Squad">Squad</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTeams">Max Teams</Label>
                    <Input id="maxTeams" name="maxTeams" type="number" placeholder="100" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prizePool">Prize Pool (₹)</Label>
                    <Input id="prizePool" name="prizePool" type="number" placeholder="100000" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entryFee">Entry Fee (₹)</Label>
                    <Input id="entryFee" name="entryFee" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" name="startDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" name="startTime" type="time" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input id="endDate" name="endDate" type="date" />
                  <p className="text-xs text-muted-foreground">Leave empty if tournament is live/ongoing</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Tournament description..." rows={3} />
                </div>
                <Button type="submit" variant="neon" className="w-full" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Tournament'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Edit Tournament Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">Edit Tournament</DialogTitle>
            </DialogHeader>
            {editingTournament && (
              <form onSubmit={handleEditTournament} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Tournament Name</Label>
                  <Input id="edit-name" name="name" defaultValue={editingTournament.name} placeholder="Enter tournament name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-image">Tournament Image (Optional)</Label>
                  <Input 
                    id="edit-image" 
                    name="image" 
                    type="file" 
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const preview = document.getElementById('editImagePreview') as HTMLImageElement;
                          if (preview) {
                            preview.src = reader.result as string;
                            preview.classList.remove('hidden');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <img 
                    id="editImagePreview" 
                    src={editingTournament.image !== '/placeholder.svg' ? editingTournament.image : ''}
                    className={`w-full h-32 object-cover rounded-md mt-2 ${editingTournament.image === '/placeholder.svg' ? 'hidden' : ''}`}
                    alt="Preview" 
                  />
                  <p className="text-xs text-muted-foreground">Upload a new image to replace the current one</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-mode">Mode</Label>
                    <select
                      id="edit-mode"
                      name="mode"
                      defaultValue={editingTournament.mode}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      required
                    >
                      <option value="Solo">Solo</option>
                      <option value="Duo">Duo</option>
                      <option value="Squad">Squad</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-maxTeams">Max Teams</Label>
                    <Input id="edit-maxTeams" name="maxTeams" type="number" defaultValue={editingTournament.maxTeams} placeholder="100" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-prizePool">Prize Pool (₹)</Label>
                    <Input id="edit-prizePool" name="prizePool" type="number" defaultValue={editingTournament.prizePool} placeholder="100000" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-entryFee">Entry Fee (₹)</Label>
                    <Input id="edit-entryFee" name="entryFee" type="number" defaultValue={editingTournament.entryFee} placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-startDate">Start Date</Label>
                    <Input 
                      id="edit-startDate" 
                      name="startDate" 
                      type="date" 
                      defaultValue={editingTournament.startDate?.split('T')[0]} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-startTime">Start Time</Label>
                    <Input id="edit-startTime" name="startTime" type="time" defaultValue={editingTournament.startTime} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date (Optional)</Label>
                  <Input 
                    id="edit-endDate" 
                    name="endDate" 
                    type="date" 
                    defaultValue={editingTournament.endDate?.split('T')[0] || ''} 
                  />
                  <p className="text-xs text-muted-foreground">Leave empty if tournament is live/ongoing</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea id="edit-description" name="description" defaultValue={editingTournament.description} placeholder="Tournament description..." rows={3} />
                </div>
                <Button type="submit" variant="neon" className="w-full" disabled={isCreating}>
                  {isCreating ? 'Updating...' : 'Update Tournament'}
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Tournaments"
            value={organizerStats.totalTournaments}
            icon={Trophy}
            variant="primary"
            index={0}
          />
          <StatsCard
            title="Total Participants"
            value={organizerStats.totalParticipants}
            icon={Users}
            variant="secondary"
            index={1}
          />
          <StatsCard
            title="Total Prize Pool"
            value={`₹${(organizerStats.totalPrizePool / 100000).toFixed(1)}L`}
            icon={DollarSign}
            variant="accent"
            index={2}
          />
          <StatsCard
            title="Active Tournaments"
            value={organizerStats.activeTournaments}
            icon={TrendingUp}
            change="+2 this week"
            changeType="positive"
            index={3}
          />
        </div>

        {/* Tournaments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg bg-card border border-border/50 overflow-hidden"
        >
          <div className="p-4 border-b border-border/50">
            <h2 className="font-display text-lg font-semibold">Your Tournaments</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tournament</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Teams</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Prize</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.slice(0, 5).map((tournament) => (
                  <tr key={tournament.id} className="border-t border-border/50 hover:bg-muted/20">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gradient-to-br from-primary/20 to-secondary/20" />
                        <div>
                          <p className="font-medium">{tournament.name}</p>
                          <p className="text-xs text-muted-foreground">{tournament.game} • {tournament.mode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        tournament.status === 'upcoming' ? 'bg-accent/20 text-accent' :
                        tournament.status === 'ongoing' ? 'bg-primary/20 text-primary' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {tournament.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      {tournament.registeredTeams}/{tournament.maxTeams}
                    </td>
                    <td className="p-4 text-sm font-medium">
                      ₹{tournament.prizePool.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(tournament.startDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/tournaments/${tournament.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setEditingTournament(tournament);
                            setIsEditDialogOpen(true);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteTournament(tournament.id, tournament.name)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
