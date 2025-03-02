
import { Profile } from '@/data/profiles';

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
        <p className="text-muted-foreground">Keep swiping to find your connections!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {connections.map((connection) => (
        <div 
          key={connection.id} 
          className="flex flex-col border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onProfileClick(connection.id)}
        >
          <div 
            className="h-40 bg-cover bg-center hover:opacity-90 transition-opacity" 
            style={{ backgroundImage: `url(${connection.images[0]})` }}
          ></div>
          <div className="p-3">
            <h3 className="font-medium">{connection.name}, {connection.age}</h3>
            <p className="text-sm text-muted-foreground truncate">{connection.bio}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConnectionList;
