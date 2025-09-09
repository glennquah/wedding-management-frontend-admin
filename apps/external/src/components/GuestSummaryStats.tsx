import { CreateGuestDto } from "@shared/api";
import { Card, CardContent } from "@shared/components/ui/card";

type Guest = {
  id: number;
  name: string;
  allergies?: string;
  group?: string;
  confirmationStatus: CreateGuestDto.confirmationStatus;
  weddingId: number;
  primaryGuestId?: number;
};

interface GuestSummaryStatsProps {
  guests: Guest[];
}

export default function GuestSummaryStats({ guests }: GuestSummaryStatsProps) {
  if (guests.length === 0) return null;

  const summaryStats = [
    {
      label: "Total Guests",
      value: guests.length,
      color: "text-brand-600"
    },
    {
      label: "Confirmed", 
      value: guests.filter(g => g.confirmationStatus === CreateGuestDto.confirmationStatus.CONFIRMED).length,
      color: "text-green-600"
    },
    {
      label: "Pending Confirmation",
      value: guests.filter(g => g.confirmationStatus === CreateGuestDto.confirmationStatus.PENDING).length, 
      color: "text-yellow-600"
    },
    {
      label: "Rejected",
      value: guests.filter(g => g.confirmationStatus === CreateGuestDto.confirmationStatus.REJECTED).length,
      color: "text-red-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {summaryStats.map((stat, index) => (
        <Card key={index} className="bg-transparent border-brand-200">
          <CardContent className="p-4">
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}