import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

export function GuestRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-4xl animate-bounce">🍕</span>
            <span className="text-xl font-bold">Loading...</span>
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-3/4 mx-auto" />
        </div>
      </div>
    );
  }

  if (session?.user) {
    const redirectPath = session.user.role === 'MERCHANT' ? '/merchant' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
