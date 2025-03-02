
import React from 'react';
import { profiles, Profile } from '@/data/profiles';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const MatchesPage = () => {
  // Sample matches (using a subset of profiles)
  const matches = profiles.slice(0, 3);
  
  // Sample conversations
  const conversations = [
    { profile: profiles[0], lastMessage: "Hey! How's your day going?", time: "10:30 AM", unread: true },
    { profile: profiles[2], lastMessage: "That coffee place was amazing, thanks for the recommendation!", time: "Yesterday", unread: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderBar />
      
      <main className="flex-1 pt-16 pb-20">
        <ScrollArea className="h-[calc(100vh-9rem)]">
          <div className="px-4 py-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">New Matches</h2>
              
              {matches.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {matches.map(match => (
                    <MatchCard key={match.id} profile={match} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-muted/30 rounded-xl">
                  <p className="text-muted-foreground">No new matches yet</p>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Messages</h2>
              
              {conversations.length > 0 ? (
                <div className="space-y-3">
                  {conversations.map(convo => (
                    <ConversationCard 
                      key={convo.profile.id} 
                      profile={convo.profile}
                      lastMessage={convo.lastMessage}
                      time={convo.time}
                      unread={convo.unread}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-muted/30 rounded-xl">
                  <p className="text-muted-foreground">No messages yet</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </main>
      
      <NavBar />
    </div>
  );
};

interface MatchCardProps {
  profile: Profile;
}

const MatchCard: React.FC<MatchCardProps> = ({ profile }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full border-2 border-primary overflow-hidden mb-2">
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${profile.images[0]})` }}
        />
      </div>
      <span className="text-sm font-medium">{profile.name}</span>
    </div>
  );
};

interface ConversationCardProps {
  profile: Profile;
  lastMessage: string;
  time: string;
  unread: boolean;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ 
  profile, lastMessage, time, unread 
}) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-muted/30 cursor-pointer">
      <div className="relative">
        <div className="w-14 h-14 rounded-full overflow-hidden">
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: `url(${profile.images[0]})` }}
          />
        </div>
        {unread && (
          <div className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-primary border-2 border-background" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium">{profile.name}</h3>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className={`text-sm truncate ${unread ? 'font-medium' : 'text-muted-foreground'}`}>
          {lastMessage}
        </p>
      </div>
    </div>
  );
};

export default MatchesPage;
