import { GuestResponseDto } from "@shared/api";
import { Card, CardContent } from "@shared/components/ui/card";

export default function GuestSummaryStats({ guests }: { guests: GuestResponseDto[] }) {
  if (guests.length === 0) return null;

  const summaryStats = [
    {
      label: "Total Guests",
      value: guests.length,
      color: "text-brand-600"
    },
    {
      label: "Confirmed", 
      value: guests.filter(g => g.confirmationStatus === GuestResponseDto.confirmationStatus.CONFIRMED).length,
      color: "text-green-600"
    },
    {
      label: "Pending Confirmation",
      value: guests.filter(g => g.confirmationStatus === GuestResponseDto.confirmationStatus.PENDING).length, 
      color: "text-yellow-600"
    },
    {
      label: "Rejected",
      value: guests.filter(g => g.confirmationStatus === GuestResponseDto.confirmationStatus.REJECTED).length,
      color: "text-red-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {summaryStats.map((stat, index) => (
        <Card key={index} className="bg-transparent border-brand-200">
          <CardContent className="p-3 sm:p-4">
            <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}