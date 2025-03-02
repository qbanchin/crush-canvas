
import React from 'react';
import HeaderBar from '@/components/HeaderBar';
import NavBar from '@/components/NavBar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const HelpPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderBar />
      
      <main className="flex-1 pt-16 pb-20">
        <ScrollArea className="h-[calc(100vh-9rem)]">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Help & Support</h1>
            
            <Separator className="my-4" />
            
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-1">How do I edit my profile?</h3>
                    <p className="text-muted-foreground">
                      You can edit your profile by navigating to the Profile page and clicking on the "Edit Profile" button.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-1">How do I change my photos?</h3>
                    <p className="text-muted-foreground">
                      You can manage your photos by going to the Profile page and clicking on the "Manage Photos" button.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-1">How do matches work?</h3>
                    <p className="text-muted-foreground">
                      When both you and another user swipe right on each other, a match is created. You can view all your matches on the Connections page.
                    </p>
                  </div>
                </div>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">Contact Support</h2>
                <p className="mb-4">
                  Need more help? Our support team is ready to assist you.
                </p>
                <div className="rounded-lg border p-4">
                  <p className="font-medium mb-1">Email Support</p>
                  <p className="text-muted-foreground">
                    support@example.com
                  </p>
                </div>
              </section>
            </div>
          </div>
        </ScrollArea>
      </main>
      
      <NavBar />
    </div>
  );
};

export default HelpPage;
