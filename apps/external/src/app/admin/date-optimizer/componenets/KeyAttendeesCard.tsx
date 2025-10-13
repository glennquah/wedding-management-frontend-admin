import type { KeyAttendee } from '../../../hooks/useDateOptimizer';
import { Button } from '@shared/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { CheckCircle2, Clock, Trash2, Users, XCircle } from 'lucide-react';

type KeyAttendeeDisplay = Pick<
  KeyAttendee,
  'id' | 'name' | 'email' | 'accessStatus' | 'calendarConnected'
>;

interface KeyAttendeesCardProps {
  attendees: KeyAttendeeDisplay[];
  loading?: boolean;
  onRequestAccess: (attendee: KeyAttendeeDisplay) => void;
  onRemoveClick: (attendee: { id: number; name: string }) => void;
  onAddClick: () => void;
}

export function KeyAttendeesCard({
  attendees,
  loading = false,
  onRequestAccess,
  onRemoveClick,
  onAddClick,
}: KeyAttendeesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Key Attendees
        </CardTitle>
        <CardDescription>
          Select guests whose calendar availability is critical for choosing your wedding date
        </CardDescription>
      </CardHeader>
      <CardContent>
        {attendees.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No key attendees added yet</p>
            <p className="text-sm">Add guests whose availability is critical for your wedding date</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attendees.map((attendee) => (
              <div key={attendee.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">{attendee.name}</p>
                    <p className="text-sm text-muted-foreground">{attendee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {attendee.accessStatus === 'CONNECTED' ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-600 mr-2">Connected</span>
                    </>
                  ) : attendee.accessStatus === 'REQUESTED' ? (
                    <>
                      <Clock className="h-5 w-5 text-amber-600" />
                      <span className="text-sm text-amber-600 mr-2">Pending</span>
                    </>
                  ) : attendee.accessStatus === 'REJECTED' ? (
                    <>
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="text-sm text-red-600 mr-2">Rejected</span>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => onRequestAccess(attendee)}>
                      Request Access
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveClick({ id: attendee.id, name: attendee.name })}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Button
          variant="outline"
          className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-white"
          onClick={onAddClick}
          disabled={loading}
        >
          + Add Key Attendee
        </Button>
      </CardContent>
    </Card>
  );
}
