import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  allowedRoles?: Array<'CUSTOMER' | 'MERCHANT' | 'DRIVER' | 'ADMIN'>;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  allowedRoles, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { data: session, isPending, isError } = useSession();
  const location = useLocation();

  if (isPending) {
    return <ProtectedRouteLoading />;
  }

  if (isError || !session?.user) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return <UnauthorizedPage />;
  }

  return <Outlet />;
}

function ProtectedRouteLoading() {
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

function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <span className="text-8xl mb-4">🚫</span>
      <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-6">
        You don't have permission to access this page.
      </p>
      <a
        href="/"
        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        Go Home
      </a>
    </div>
  );
}

export default ProtectedRoute;
