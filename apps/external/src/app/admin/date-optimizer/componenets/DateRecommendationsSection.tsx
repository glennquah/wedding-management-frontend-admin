import type { DateRecommendation } from '../../../hooks/useDateOptimizer';
import { Button } from '@shared/components';
import { Badge } from '@shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card';
import { CheckCircle, CheckCircle2, Users, XCircle } from 'lucide-react';

interface DateRecommendationsSectionProps {
  hasRunAnalysis: boolean;
  dateRecommendations: DateRecommendation[];
  onSelectDate: (recommendation: DateRecommendation) => void;
  selectedWeddingDate?: string | null;
}

const isSameDate = (date1: string, date2: string | null | undefined) => {
  if (!date2) return false;
  return new Date(date1).toDateString() === new Date(date2).toDateString();
};

export function DateRecommendationsSection({
  hasRunAnalysis,
  dateRecommendations,
  onSelectDate,
  selectedWeddingDate,
}: DateRecommendationsSectionProps) {
  if (!hasRunAnalysis) {
    return null;
  }

  return (
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
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex-grow">
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
                {isSameDate(rec.date, selectedWeddingDate) ? (
                  <Badge
                    variant="secondary"
                    className="ml-4 flex-shrink-0 bg-green-100 text-green-800 border-green-200"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Selected Date
                  </Badge>
                ) : (
                  <Button
                    onClick={() => onSelectDate(rec)}
                    size="sm"
                    className="ml-4 flex-shrink-0"
                  >
                    Select Date
                  </Button>
                )}
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
                    <h4 className="font-semibold text-sm mb-2 text-amber-600">Considerations</h4>
                    <ul className="space-y-1">
                      {/* Show unavailable attendees from structured data */}
                      {rec.unavailable_attendees && rec.unavailable_attendees.length > 0 && (
                        <li className="text-sm flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span>
                            {rec.unavailable_attendees.length} key attendee
                            {rec.unavailable_attendees.length === 1 ? '' : 's'} (
                            {rec.unavailable_attendees.join(', ')}) unavailable
                          </span>
                        </li>
                      )}
                      {/* Show other considerations, filtering out the redundant unavailable attendee text */}
                      {rec.cons
                        .filter((con: string) => !/\d+\s+key\s+attendees?\s+unavailable/i.test(con))
                        .map((con: string, i: number) => (
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
  );
}
