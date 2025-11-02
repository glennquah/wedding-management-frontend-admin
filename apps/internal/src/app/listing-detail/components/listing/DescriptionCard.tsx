import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';

interface DescriptionCardProps {
  remarks: string;
}

export function DescriptionCard({ remarks }: DescriptionCardProps) {
  if (!remarks) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed">
          {remarks}
        </p>
      </CardContent>
    </Card>
  );
}
