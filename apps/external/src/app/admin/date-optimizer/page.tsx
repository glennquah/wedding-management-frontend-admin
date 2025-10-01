'use client';

import { useEffect, useState } from 'react';

import { useWeddingManager } from '../../hooks/useWeddingManager';
import { AdminResponseDto, AdminsService, OpenAPI } from '@shared/api';
import { Button, PageHeader } from '@shared/components';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import { Badge } from '@shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import { Input } from '@shared/components/ui/form/input';
import { Calendar, CheckCircle2, Clock, Trash2, Users, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

// Dummy data for recommendations
const dummyRecommendations = [
  {
    id: 1,
    date: '2025-06-14',
    availabilityScore: 10,
    totalAttendees: 10,
    availableAttendees: 10,
    pros: ['All collaborators available', 'Ideal weather season', 'Mid-range venue pricing'],
    cons: ['Popular date - book early'],
  },
  {
    id: 2,
    date: '2025-06-21',
    availabilityScore: 9,
    totalAttendees: 10,
    availableAttendees: 9,
    pros: ['9/10 collaborators available', 'Great weather', 'More venue options'],
    cons: ['One collaborator unavailable', 'Peak season pricing'],
  },
  {
    id: 3,
    date: '2025-09-13',
    availabilityScore: 9,
    totalAttendees: 10,
    availableAttendees: 9,
    pros: ['Beautiful fall season', 'Moderate pricing', 'High venue availability'],
    cons: ['One collaborator conflict', 'Potential rain'],
  },
  {
    id: 4,
    date: '2025-05-17',
    availabilityScore: 8,
    totalAttendees: 10,
    availableAttendees: 8,
    pros: ['Spring season', 'Lower venue costs', 'Good weather'],
    cons: ['2 collaborators unavailable', 'Limited vendor availability'],
  },
];

type KeyAttendee = {
  id: number;
  name: string;
  email: string;
  calendarConnected: boolean;
};

// Collaborator Search Modal Component
interface CollaboratorSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborators: AdminResponseDto[];
  onSelectCollaborator: (collaborator: AdminResponseDto) => void;
  excludedCollaboratorIds?: number[];
}

function CollaboratorSearchModal({
  isOpen,
  onClose,
  collaborators,
  onSelectCollaborator,
  excludedCollaboratorIds = [],
}: CollaboratorSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter collaborators based on search query
  const filteredCollaborators = collaborators.filter(
    (collaborator) =>
      collaborator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collaborator.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  const handleSelectCollaborator = (collaborator: AdminResponseDto) => {
    onSelectCollaborator(collaborator);
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Key Attendee</DialogTitle>
          <DialogDescription>
            Select collaborators from your wedding planning team whose availability is critical
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto border rounded-md">
          {filteredCollaborators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No collaborators found</p>
              <p className="text-sm">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Add collaborators to your wedding first'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredCollaborators.map((collaborator) => {
                const isExcluded = excludedCollaboratorIds.includes(collaborator.id);
                return (
                  <div
                    key={collaborator.id}
                    className={`p-3 hover:bg-muted/50 transition-colors ${
                      isExcluded ? 'opacity-50' : 'cursor-pointer'
                    }`}
                    onClick={() => !isExcluded && handleSelectCollaborator(collaborator)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{collaborator.name}</p>
                        <p className="text-sm text-muted-foreground">{collaborator.email}</p>
                      </div>
                      {isExcluded && <Badge variant="secondary">Already Added</Badge>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DateOptimizerPage() {
  const isMobile = useIsMobileScreen();
  const { data: session } = useSession();
  const { selectedWeddingId } = useWeddingManager();
  const [hasRunAnalysis, setHasRunAnalysis] = useState(false);
  const [collaborators, setCollaborators] = useState<AdminResponseDto[]>([]);
  const [keyAttendees, setKeyAttendees] = useState<KeyAttendee[]>([]);
  const [isAddAttendeeModalOpen, setIsAddAttendeeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch collaborators on mount
  useEffect(() => {
    const fetchCollaborators = async () => {
      if (!selectedWeddingId || !session?.backendTokens?.accessToken) return;

      try {
        setLoading(true);
        OpenAPI.TOKEN = session.backendTokens.accessToken;
        const data = await AdminsService.adminControllerGetCollaborators(selectedWeddingId);
        setCollaborators(data);
      } catch (error) {
        console.error('Error fetching collaborators:', error);
        toast.error('Failed to fetch collaborators');
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborators();
  }, [selectedWeddingId, session]);

  const handleRunAnalysis = () => {
    // Simulate API call delay
    setTimeout(() => {
      setHasRunAnalysis(true);
    }, 1000);
  };

  const handleAddKeyAttendee = (collaborator: AdminResponseDto) => {
    const newAttendee: KeyAttendee = {
      id: collaborator.id,
      name: collaborator.name,
      email: collaborator.email,
      calendarConnected: false,
    };

    setKeyAttendees([...keyAttendees, newAttendee]);
    setIsAddAttendeeModalOpen(false);
  };

  const handleRemoveKeyAttendee = (id: number) => {
    setKeyAttendees(keyAttendees.filter((a) => a.id !== id));
  };

  const handleRequestCalendarAccess = (attendee: KeyAttendee) => {
    // TODO: API call to send notification/email to collaborator
    // POST /api/calendar-access/request
    // Body: { collaboratorId: attendee.id, weddingId: selectedWeddingId }
    alert(`Calendar access request sent to ${attendee.name}`);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-brand-100 text-foreground">
      {!isMobile && <div className="mt-6 w-full"></div>}

      <div className="container mx-auto px-4 pt-4 md:pt-6 pb-8">
        <PageHeader
          title="AI Date Optimizer"
          description="Find the perfect date for your wedding using AI-powered calendar analysis"
        />

      {/* Configuration Section */}
      <div className="grid gap-6 mb-6">
        {/* Date Range Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date Preferences
            </CardTitle>
            <CardDescription>Set your preferred date range and constraints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Earliest Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue="2025-05-01"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Latest Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue="2025-12-31"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Preferred Days</label>
              <div className="flex gap-2 flex-wrap">
                {['Friday', 'Saturday', 'Sunday'].map((day) => (
                  <Badge
                    key={day}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-white"
                  >
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Attendees */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Key Attendees
            </CardTitle>
            <CardDescription>
              Select collaborators whose calendar availability is critical for choosing your wedding date
            </CardDescription>
          </CardHeader>
          <CardContent>
            {keyAttendees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No key attendees added yet</p>
                <p className="text-sm">Add collaborators whose availability is critical for your wedding date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {keyAttendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{attendee.name}</p>
                        <p className="text-sm text-muted-foreground">{attendee.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {attendee.calendarConnected ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <span className="text-sm text-green-600 mr-2">Connected</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-gray-400" />
                          <Button
                            size="sm"
                            onClick={() => handleRequestCalendarAccess(attendee)}
                          >
                            Request Access
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveKeyAttendee(attendee.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              className="w-full mt-4"
              onClick={() => setIsAddAttendeeModalOpen(true)}
              disabled={loading}
            >
              + Add Key Attendee
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Collaborator Search Modal */}
      <CollaboratorSearchModal
        isOpen={isAddAttendeeModalOpen}
        onClose={() => setIsAddAttendeeModalOpen(false)}
        collaborators={collaborators}
        onSelectCollaborator={handleAddKeyAttendee}
        excludedCollaboratorIds={keyAttendees.map((a) => a.id)}
      />

      {/* Run Analysis Button */}
      <div className="flex justify-center mb-8">
        <Button size="lg" onClick={handleRunAnalysis} disabled={hasRunAnalysis} className="px-8">
          <Clock className="mr-2 h-5 w-5" />
          {hasRunAnalysis ? 'Analysis Complete' : 'Run AI Analysis'}
        </Button>
      </div>

      {/* Results Section */}
      {hasRunAnalysis && (
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Recommended Dates</h2>
            <p className="text-muted-foreground">
              Based on availability and preferences, here are your top date options
            </p>
          </div>

          <div className="grid gap-4">
            {dummyRecommendations.map((rec, index) => (
              <Card key={rec.id} className={index === 0 ? 'border-primary border-2' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {index === 0 && <Badge className="bg-primary">Best Match</Badge>}
                        {new Date(rec.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {rec.availableAttendees}/{rec.totalAttendees} collaborators available
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {rec.availabilityScore}/10
                      </div>
                      <div className="text-sm text-muted-foreground">Score</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-green-600">Pros</h4>
                      <ul className="space-y-1">
                        {rec.pros.map((pro, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-amber-600">Considerations</h4>
                      <ul className="space-y-1">
                        {rec.cons.map((con, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Button className="w-full" variant={index === 0 ? 'default' : 'outline'}>
                    Select This Date
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={() => setHasRunAnalysis(false)}>
              Re-run Analysis with Different Parameters
            </Button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
