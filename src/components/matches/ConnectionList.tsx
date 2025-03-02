
import { Profile } from '@/data/profiles';
import { ImageIcon, MessageCircle, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ConnectionListProps {
  connections: Profile[];
  loading: boolean;
  onProfileClick: (profileId: string) => void;
}

const ConnectionList = ({ connections, loading, onProfileClick }: ConnectionListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col">
            <div className="h-32 w-full bg-muted rounded-xl"></div>
            <div className="mt-2 h-4 w-20 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No connections yet</h3>
        <p className="text-muted-foreground">Start swiping to find your matches!</p>
        <p className="text-sm mt-4 text-muted-foreground">
          When you match with someone, they'll appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {connections.map((connection) => {
        const hasMultipleImages = connection.images && connection.images.length > 1;
        const hasNewMessage = connection.hasNewMessage;
        
        return (
          <div 
            key={connection.id} 
            className="flex flex-col border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onProfileClick(connection.id)}
          >
            <div className="relative">
              <div 
                className="h-40 bg-cover bg-center hover:opacity-90 transition-opacity" 
                style={{ 
                  backgroundImage: `url(${connection.images && connection.images.length > 0 
                    ? connection.images[0] 
                    : '/placeholder.svg'})` 
                }}
              ></div>
              
              {hasMultipleImages && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs flex items-center">
                  <ImageIcon size={12} className="mr-1" />
                  {connection.images?.length || 0}
                </div>
              )}
            </div>
            
            <div className="p-3">
              <div className="flex items-center gap-1">
                {hasNewMessage && (
                  <span className="block h-2 w-2 mr-1 rounded-full bg-green-500"></span>
                )}
                <h3 className="font-medium">{connection.name}, {connection.age}</h3>
              </div>
              <p className="text-sm text-muted-foreground truncate">{connection.bio || "No bio available"}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConnectionList;
