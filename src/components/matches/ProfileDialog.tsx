
import { Profile } from '@/data/profiles';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ProfileDialogProps {
  profile: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenChat: () => void;
}

const ProfileDialog = ({ profile, open, onOpenChange, onOpenChat }: ProfileDialogProps) => {
  if (!profile) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{profile.name}, {profile.age}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {profile.distance} miles away
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div 
            className="h-60 bg-cover bg-center rounded-md" 
            style={{ backgroundImage: `url(${profile.images[0]})` }}
          ></div>
          
          <p>{profile.bio}</p>
          
          {profile.tags && profile.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-muted text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button 
            onClick={onOpenChat}
            className="w-full sm:w-auto"
          >
            Open Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
