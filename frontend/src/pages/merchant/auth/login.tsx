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
  Store,
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

export function MerchantLoginPage() {
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
          if (role !== 'MERCHANT' && role !== 'ADMIN') {
            navigate('/login', { replace: true });
            return;
          }
          const redirectPath = from || '/merchant/select';
          navigate(redirectPath, { replace: true });
        },
      }
    );
  };

  const error = signIn.error as ApiError | null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <motion.div
              className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Store className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-2xl font-bold text-white">
              Merchant Portal
            </span>
          </a>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl text-white">
                {t('auth.login.title')}
              </CardTitle>
              <CardDescription className="text-slate-400">
                Sign in to manage your business
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
                  <Label htmlFor="email" className="text-slate-200">
                    {t('auth.login.email')}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="merchant@example.com"
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
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
                    <Label htmlFor="password" className="text-slate-200">
                      {t('auth.login.password')}
                    </Label>
                    <a
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      {t('auth.login.forgotPassword')}
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
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
                    className="border-slate-600 data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer text-slate-300"
                  >
                    {t('auth.login.rememberMe')}
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={signIn.isPending}>
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
            </CardContent>
          </Card>
        </motion.div>

        <motion.p variants={itemVariants} className="text-center mt-6 text-sm text-slate-400">
          {t('merchantRegister.alreadyMerchant') ? '' : ''}{/* Already a merchant is for register page */}
          Want to become a merchant?{' '}
          <a href="/merchant/register" className="text-primary font-medium hover:underline">
            Register your business
          </a>
        </motion.p>

        <motion.p variants={itemVariants} className="text-center mt-2 text-sm text-slate-400">
          Looking to order?{' '}
          <a href="/login" className="text-primary font-medium hover:underline">
            Login as customer
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default MerchantLoginPage;
