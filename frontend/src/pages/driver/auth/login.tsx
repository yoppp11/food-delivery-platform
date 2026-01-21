import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useSignIn, useSession } from '@/hooks/use-auth';
import type { ApiError } from '@/lib/api-client';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function DriverLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const signIn = useSignIn();
  const { refetch: refetchSession } = useSession();
  const from = location.state?.from;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    signIn.mutate(
      { email: formData.email, password: formData.password },
      {
        onSuccess: async () => {
          const { data: sessionData } = await refetchSession();
          const role = sessionData?.user?.role;
          if (role !== 'DRIVER' && role !== 'ADMIN') {
            navigate('/login', { replace: true });
            return;
          }
          const redirectPath = from || '/driver';
          navigate(redirectPath, { replace: true });
        },
      }
    );
  };

  const error = signIn.error as ApiError | null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <motion.div
              className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Car className="h-6 w-6 text-blue-400" />
            </motion.div>
            <span className="text-2xl font-bold text-white">
              Driver Portal
            </span>
          </a>
        </motion.div>

        {/* Login Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-blue-700 bg-blue-800/50 backdrop-blur">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl text-white">
                {t('auth.login.title')}
              </CardTitle>
              <CardDescription className="text-blue-300">
                Sign in to start delivering
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error.message || 'An error occurred'}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-100">
                    {t('auth.login.email')}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="driver@example.com"
                      className="pl-10 bg-blue-700/50 border-blue-600 text-white placeholder:text-blue-400"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-blue-100">
                      {t('auth.login.password')}
                    </Label>
                    <a
                      href="/forgot-password"
                      className="text-sm text-blue-300 hover:underline"
                    >
                      {t('auth.login.forgotPassword')}
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-blue-700/50 border-blue-600 text-white placeholder:text-blue-400"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={formData.remember}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, remember: checked as boolean })
                    }
                    className="border-blue-600 data-[state=checked]:bg-blue-500"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer text-blue-200"
                  >
                    {t('auth.login.rememberMe')}
                  </Label>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={signIn.isPending}>
                  {signIn.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {t('auth.login.submit')}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-blue-300">
                  Not a driver yet?{' '}
                  <a href="/driver/register" className="text-blue-400 hover:underline font-medium">
                    Register here
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
