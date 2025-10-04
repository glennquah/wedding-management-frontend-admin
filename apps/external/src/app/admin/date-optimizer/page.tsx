'use client';

import { useState } from 'react';

import { GuestSearchModal } from '../../components/GuestSearchModal';
import { useDateOptimizer } from '../../hooks/useDateOptimizer';
import { Button, DeleteConfirmationModal, ItemRankingList, PageHeader } from '@shared/components';
import { Badge } from '@shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import useIsMobileScreen from '@shared/hooks/useIsMobileScreen';
import { Calendar, CheckCircle2, Clock, Trash2, Users, XCircle } from 'lucide-react';

export default function DateOptimizerPage() {
  const isMobile = useIsMobileScreen();
  const [attendeeToDelete, setAttendeeToDelete] = useState<{ id: number; name: string } | null>(
    null,
  );

  const {
    // Data
    guests,
    keyAttendees,
    mainCouple,
    loading,
    hasRunAnalysis,
    preferredDays,
    dateRecommendations,
    earliestDate,
    latestDate,

    // Modal states
    isAddAttendeeModalOpen,

    // Handlers
    handleRunAnalysis,
    handleAddKeyAttendee,
    handleRemoveKeyAttendee,
    handleRequestCalendarAccess,
    setPreferredDays,
    setEarliestDate,
    setLatestDate,

    // Modal controls
    openAddAttendeeModal,
    closeAddAttendeeModal,
  } = useDateOptimizer();

  const handleDeleteClick = (attendee: { id: number; name: string }) => {
    setAttendeeToDelete(attendee);
  };

  const handleConfirmDelete = async () => {
    if (attendeeToDelete) {
      await handleRemoveKeyAttendee(attendeeToDelete.id);
      setAttendeeToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setAttendeeToDelete(null);
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
                    value={earliestDate}
                    max={latestDate}
                    onChange={(e) => setEarliestDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Latest Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-md"
                    value={latestDate}
                    min={earliestDate}
                    onChange={(e) => setLatestDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <ItemRankingList
                  selectedItems={preferredDays}
                  availableItems={[
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ]}
                  onItemsChange={setPreferredDays}
                  label="Preferred Days"
                  description="Drag to reorder. Days at the top will be prioritized when analyzing dates."
                  emptyMessage="No days selected. Add at least one preferred day below."
                  addMoreLabel="Add More Days"
                />
              </div>
            </CardContent>
          </Card>

          {/* Main Couple Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Main Couple Calendar
              </CardTitle>
              <CardDescription>
                Connect the main couple&apos;s calendars to ensure the wedding date works for both of you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mainCouple.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No main couple members found</p>
                  <p className="text-sm">Main couple members are set when creating the wedding</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mainCouple.map((partner) => (
                    <div
                      key={partner.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{partner.name}</p>
                          <p className="text-sm text-muted-foreground">{partner.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {partner.accessStatus === 'CONNECTED' ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="text-sm text-green-600">Connected</span>
                          </>
                        ) : partner.accessStatus === 'REQUESTED' ? (
                          <>
                            <Clock className="h-5 w-5 text-amber-600" />
                            <span className="text-sm text-amber-600">Pending</span>
                          </>
                        ) : partner.accessStatus === 'REJECTED' ? (
                          <>
                            <XCircle className="h-5 w-5 text-red-600" />
                            <span className="text-sm text-red-600">Rejected</span>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleRequestCalendarAccess(partner, true)}
                          >
                            Request Access
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                Select guests whose calendar availability is critical for choosing your wedding date
              </CardDescription>
            </CardHeader>
            <CardContent>
              {keyAttendees.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No key attendees added yet</p>
                  <p className="text-sm">
                    Add guests whose availability is critical for your wedding date
                  </p>
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
                          <Button size="sm" onClick={() => handleRequestCalendarAccess(attendee)}>
                            Request Access
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteClick({ id: attendee.id, name: attendee.name })
                          }
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
                onClick={openAddAttendeeModal}
                disabled={loading}
              >
                + Add Key Attendee
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Guest Search Modal */}
        <GuestSearchModal
          isOpen={isAddAttendeeModalOpen}
          onClose={closeAddAttendeeModal}
          guests={guests}
          onSelectGuest={handleAddKeyAttendee}
          excludedGuestIds={keyAttendees.map((a) => a.id)}
        />

        {/* Run Analysis Button */}
        <div className="flex justify-center mb-8">
          <Button size="lg" onClick={handleRunAnalysis} className="px-8">
            <Clock className="mr-2 h-5 w-5" />
            Run AI Analysis
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
              {dateRecommendations.length > 0 ? (
                dateRecommendations.map((rec, index) => (
                  <Card key={rec.date} className={index === 0 ? 'border-primary border-2' : ''}>
                    <CardHeader>
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
                          {rec.available_attendees_count}/{rec.total_attendees_count} key attendees
                          available
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-green-600">Pros</h4>
                          <ul className="space-y-1">
                            {rec.pros.map((pro: string, i: number) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-amber-600">
                            Considerations
                          </h4>
                          <ul className="space-y-1">
                            {rec.cons.map((con: string, i: number) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <XCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <XCircle className="h-16 w-16 mx-auto mb-4 opacity-20 text-destructive" />
                  <p className="text-lg font-medium">No viable dates found</p>
                  <p className="text-sm">
                    Try adjusting your date range or preferred days to find more options
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          open={!!attendeeToDelete}
          onOpenChange={(open) => !open && handleCancelDelete()}
          title="Remove Key Attendee"
          itemName={attendeeToDelete?.name || ''}
          description={`Are you sure you want to remove ${attendeeToDelete?.name} from key attendees? Their calendar will be disconnected and will no longer be considered in the date analysis.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmButtonText="Remove"
        />
      </div>
    </div>
  );
}
