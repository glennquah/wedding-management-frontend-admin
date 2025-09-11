"use client";

import { Button } from "@shared/components";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@shared/components/ui/dialog";
import { Mail } from "lucide-react";

interface EmailGuestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guestName: string;
  guestEmail: string;
  onSendEmail: () => void;
}

export function EmailGuestModal({
  open,
  onOpenChange,
  guestName,
  guestEmail,
  onSendEmail
}: EmailGuestModalProps) {
  const handleSendEmail = () => {
    onSendEmail();
    onOpenChange(false);
  };

  // Example email template
  const exampleEmailSubject = "Wedding Invitation - [Your Names] Wedding";
  const exampleEmailBody = `Dear ${guestName},

We hope this message finds you well! We are thrilled to invite you to celebrate our special day with us.

**Wedding Details:**
Date: [Wedding Date]
Time: [Wedding Time]  
Venue: [Wedding Venue]
Address: [Wedding Address]

Your presence would mean the world to us as we begin this new chapter together. Please RSVP by [RSVP Date] through our wedding website or by replying to this email.

We can't wait to celebrate with you!

With love and excitement,
[Your Names]

---
Please visit our wedding website for more details and to RSVP: [Website Link]`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email to Guest
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-1">Recipient:</p>
            <p className="text-sm text-muted-foreground">{guestName} ({guestEmail})</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground">Subject:</label>
              <div className="mt-1 p-3 bg-muted/30 rounded-md text-sm text-foreground">
                {exampleEmailSubject}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Message:</label>
              <div className="mt-1 p-3 bg-muted/30 rounded-md text-sm text-foreground whitespace-pre-wrap max-h-64 overflow-y-auto">
                {exampleEmailBody}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={handleSendEmail}
            className="w-full sm:w-auto"
            size="lg"
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}