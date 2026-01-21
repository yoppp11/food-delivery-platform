import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Store, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRegisterMerchant } from '@/hooks/use-merchant-profile';

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

export function MerchantRegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const registerMutation = useRegisterMerchant();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t('merchantRegister.geolocationNotSupported'));
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsGettingLocation(false);
      },
      (error) => {
        setLocationError(error.message);
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.name.length < 4) {
      return;
    }

    if (!location) {
      setLocationError(t('merchantRegister.locationRequired'));
      return;
    }

    registerMutation.mutate(
      {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
      }
    );
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 border-green-700 bg-slate-800/50 backdrop-blur">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {t('merchantRegister.successTitle')}
              </h2>
              <p className="text-slate-400 mb-6">
                {t('merchantRegister.successDescription')}
              </p>
              <Button onClick={() => navigate('/')} className="w-full">
                {t('common.back')} {t('nav.home')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

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
              {t('merchantRegister.title')}
            </span>
          </a>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-white">
                {t('merchantRegister.formTitle')}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t('merchantRegister.formDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    {t('merchantRegister.businessName')} *
                  </Label>
                  <Input
                    id="name"
                    placeholder={t('merchantRegister.businessNamePlaceholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    minLength={4}
                    className="bg-slate-900/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    {t('merchantRegister.description')}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={t('merchantRegister.descriptionPlaceholder')}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="bg-slate-900/50 border-slate-600 text-white resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">{t('merchantRegister.location')} *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-slate-600 hover:bg-slate-700"
                    onClick={handleGetLocation}
                    disabled={isGettingLocation}
                  >
                    {isGettingLocation ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('merchantRegister.gettingLocation')}
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        {t('merchantRegister.getLocation')}
                      </>
                    )}
                  </Button>
                  {location && (
                    <p className="text-sm text-green-400">
                      ✓ {t('merchantRegister.locationObtained')}: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </p>
                  )}
                  {locationError && (
                    <p className="text-sm text-red-400">{locationError}</p>
                  )}
                </div>

                {registerMutation.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      {(registerMutation.error as any)?.message || t('merchantRegister.error')}
                    </AlertDescription>
                  </Alert>
                )}

                <Alert className="bg-blue-900/30 border-blue-700">
                  <AlertTitle className="text-blue-300">
                    {t('merchantRegister.noteTitle')}
                  </AlertTitle>
                  <AlertDescription className="text-blue-200">
                    {t('merchantRegister.noteDescription')}
                  </AlertDescription>
                </Alert>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!formData.name.trim() || !location || registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('merchantRegister.submitting')}
                    </>
                  ) : (
                    t('merchantRegister.submit')
                  )}
                </Button>

                <div className="text-center text-sm text-slate-400">
                  {t('merchantRegister.alreadyMerchant')}{' '}
                  <a href="/merchant/login" className="text-primary hover:underline">
                    {t('common.login')}
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default MerchantRegisterPage;
