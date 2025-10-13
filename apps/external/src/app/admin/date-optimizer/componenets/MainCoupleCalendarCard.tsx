import type { MainCouplePartner } from '../../../hooks/useDateOptimizer';
import { Button } from '@shared/components';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/ui/card';
import { CheckCircle2, Clock, Users, XCircle } from 'lucide-react';

type PartnerDisplay = Pick<
  MainCouplePartner,
  'id' | 'name' | 'email' | 'accessStatus' | 'calendarConnected'
>;

interface MainCoupleCalendarCardProps {
  partners: PartnerDisplay[];
  onRequestAccess: (partner: PartnerDisplay) => void;
}

export function MainCoupleCalendarCard({ partners, onRequestAccess }: MainCoupleCalendarCardProps) {
  return (
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
        {partners.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No main couple members found</p>
            <p className="text-sm">Main couple members are set when creating the wedding</p>
          </div>
        ) : (
          <div className="space-y-3">
            {partners.map((partner) => (
              <div key={partner.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                    <Button size="sm" onClick={() => onRequestAccess(partner)}>
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
  );
}
