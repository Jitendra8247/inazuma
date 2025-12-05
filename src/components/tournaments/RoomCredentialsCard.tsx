// Room Credentials Card Component
import { useState } from 'react';
import { Key, Lock, Edit, Save, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { tournamentsAPI } from '@/services/api';

interface RoomCredentialsCardProps {
  tournament: any;
  isOrganizer: boolean;
  onUpdate?: () => void;
}

export default function RoomCredentialsCard({ tournament, isOrganizer, onUpdate }: RoomCredentialsCardProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [roomId, setRoomId] = useState(tournament.roomId || '');
  const [roomPassword, setRoomPassword] = useState(tournament.roomPassword || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!roomId.trim() || !roomPassword.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both Room ID and Password',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdating(true);

    try {
      const response = await tournamentsAPI.updateRoomCredentials(
        tournament.id,
        roomId.trim(),
        roomPassword.trim()
      );

      if (response.success) {
        toast({
          title: 'Room Credentials Updated',
          description: 'Players can now see the room details',
        });
        setIsEditing(false);
        if (onUpdate) onUpdate();
      }
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update room credentials',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setRoomId(tournament.roomId || '');
    setRoomPassword(tournament.roomPassword || '');
    setIsEditing(false);
  };

  const isAvailable = tournament.roomCredentialsAvailable && tournament.roomId && tournament.roomPassword;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-pulse'}`} />
          <h3 className="font-display text-lg font-bold">Room Credentials</h3>
        </div>
        {isOrganizer && !isEditing && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isAvailable ? 'Update' : 'Add'}
          </Button>
        )}
      </div>

      {isEditing ? (
        // Edit Mode (Organizer Only)
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomId">Room ID</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter Room ID"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomPassword">Room Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="roomPassword"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                placeholder="Enter Room Password"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex-1"
            >
              {isUpdating ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Credentials
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="space-y-4">
          {isAvailable ? (
            <>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-sm font-semibold text-green-500">Credentials Available</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Room ID</p>
                    <div className="flex items-center gap-2 p-2 rounded bg-background/50">
                      <Key className="h-4 w-4 text-green-500" />
                      <p className="font-mono font-semibold">{tournament.roomId}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Room Password</p>
                    <div className="flex items-center gap-2 p-2 rounded bg-background/50">
                      <Lock className="h-4 w-4 text-green-500" />
                      <p className="font-mono font-semibold">{tournament.roomPassword}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Use these credentials to join the tournament room
              </p>
            </>
          ) : (
            <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="font-semibold text-red-500">Available Soon</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Room credentials will be shared before the tournament starts
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
