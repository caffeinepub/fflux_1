import { useCurrentCreator } from '../hooks/useCurrentCreator';
import { Badge } from './ui/badge';
import { User, UserX } from 'lucide-react';

export default function CreatorStatus() {
  const { isAuthenticated, principalShort, isLoading } = useCurrentCreator();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Badge variant="outline" className="gap-1.5">
        <UserX className="h-3 w-3" />
        Guest
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1.5">
      <User className="h-3 w-3" />
      {principalShort}
    </Badge>
  );
}
