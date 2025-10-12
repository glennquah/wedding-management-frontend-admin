'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { Check, ExternalLink, X } from 'lucide-react';
import Link from 'next/link';

interface WeddingTasksChecklistProps {
  micrositeUrl?: string | null;
  guestCount: number;
  rsvpCount: number;
  hasSeatingArrangement: boolean;
  weddingLocation?: string | null;
  isLoading?: boolean;
}

export const WeddingTasksChecklist = ({
  micrositeUrl,
  guestCount,
  rsvpCount,
  hasSeatingArrangement,
  weddingLocation,
  isLoading,
}: WeddingTasksChecklistProps) => {
  const tasks = [
    {
      name: 'Microsite Creation',
      completed: !!micrositeUrl,
      link: micrositeUrl || '/admin/microsite',
      isExternal: !!micrositeUrl,
      linkText: micrositeUrl ? 'View Microsite' : 'Create Microsite',
      status: micrositeUrl ? 'Created' : 'Not created',
    },
    {
      name: 'Guest Invitations',
      completed: guestCount > 0,
      link: '/admin/guest-list',
      isExternal: false,
      linkText: `${guestCount} guest${guestCount === 1 ? '' : 's'}, ${rsvpCount} RSVP${rsvpCount === 1 ? '' : 's'}`,
      status: guestCount > 0 ? `${guestCount} invited` : 'No invitations',
    },
    {
      name: 'Seating Allocation',
      completed: hasSeatingArrangement,
      link: '/admin/seating-arrangement',
      isExternal: false,
      linkText: hasSeatingArrangement ? 'View Seating' : 'Set up Seating',
      status: hasSeatingArrangement ? 'Configured' : 'Not configured',
    },
    {
      name: 'Wedding Location',
      completed: !!weddingLocation,
      link: '/admin/account',
      isExternal: false,
      linkText: weddingLocation || 'Set Location',
      status: weddingLocation ? weddingLocation : 'Not set',
    },
  ];

  return (
    <Card className="bg-transparent border-brand-200">
      <CardHeader>
        <CardTitle>Wedding Planning Progress</CardTitle>
        <CardDescription>Track your wedding planning milestones</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            Loading checklist...
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <Link
                key={index}
                href={task.link}
                target={task.isExternal ? '_blank' : undefined}
                rel={task.isExternal ? 'noopener noreferrer' : undefined}
                className="block"
              >
                <div className="flex items-start justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 bg-white transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        task.completed ? 'bg-green-100' : 'bg-gray-100'
                      }`}
                    >
                      {task.completed ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{task.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{task.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700">
                    {task.linkText}
                    {task.isExternal && <ExternalLink className="w-3 h-3" />}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
