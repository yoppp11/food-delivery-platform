import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Car, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRegisterDriver } from '@/hooks/use-driver';

export function DriverRegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const registerMutation = useRegisterDriver();

  const [plateNumber, setPlateNumber] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
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

    if (!plateNumber.trim()) {
      return;
    }

    if (!location) {
      setLocationError('Please get your current location first');
      return;
    }

    registerMutation.mutate(
      {
        plateNumber: plateNumber.trim(),
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
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardContent className="pt-8 pb-6 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {t('driverRegister.successTitle')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t('driverRegister.successDescription')}
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
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Become a Driver</CardTitle>
            <CardDescription>
              Register as a driver to start earning money by delivering orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plateNumber">Vehicle Plate Number</Label>
                <Input
                  id="plateNumber"
                  placeholder="e.g., B 1234 ABC"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Current Location</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleGetLocation}
                    disabled={isGettingLocation}
                  >
                    {isGettingLocation ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Getting location...
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        Get Current Location
                      </>
                    )}
                  </Button>
                </div>
                {location && (
                  <p className="text-sm text-green-600">
                    ✓ Location obtained: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </p>
                )}
                {locationError && (
                  <p className="text-sm text-red-600">{locationError}</p>
                )}
              </div>

              {registerMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {(registerMutation.error as any)?.message || 'Failed to register. Please try again.'}
                  </AlertDescription>
                </Alert>
              )}

              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-800">
                  {t('driverRegister.noteTitle')}
                </AlertTitle>
                <AlertDescription className="text-blue-700">
                  {t('driverRegister.noteDescription')}
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full"
                disabled={!plateNumber.trim() || !location || registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register as Driver'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
