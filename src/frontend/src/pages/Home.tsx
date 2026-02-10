import { useEffect, useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Download, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRegisterDeviceProfile } from '../hooks/useRegisterDeviceProfile';
import { useDeviceProfile } from '../hooks/useDeviceProfile';
import { useBuilds } from '../hooks/useBuilds';
import { selectBestBuild } from '../utils/buildSelection';
import { downloadFile } from '../utils/download';
import type { BuildEntry } from '../backend';

export default function Home() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { mutate: registerDevice, isPending: isRegistering, isSuccess: registrationSuccess } = useRegisterDeviceProfile();
  const { data: deviceProfile, isLoading: deviceLoading } = useDeviceProfile();
  const { data: builds, isLoading: buildsLoading } = useBuilds(null);
  
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Auto-register device on login
  useEffect(() => {
    if (isAuthenticated && !deviceProfile && !isRegistering && !deviceLoading) {
      registerDevice();
    }
  }, [isAuthenticated, deviceProfile, isRegistering, deviceLoading, registerDevice]);

  const handleDownload = async () => {
    if (!isAuthenticated) {
      setDownloadError('Please log in to download builds');
      return;
    }

    if (!deviceProfile) {
      setDownloadError('Device profile not registered. Please wait...');
      return;
    }

    if (!builds || builds.length === 0) {
      setDownloadError('No builds available');
      return;
    }

    setDownloading(true);
    setDownloadError(null);
    setDownloadSuccess(false);

    try {
      const bestBuild = selectBestBuild(builds, deviceProfile.deviceLabel);
      
      if (!bestBuild) {
        setDownloadError('No compatible build found for your device');
        return;
      }

      // Get the build bytes
      const bytes = await bestBuild.file.getBytes();
      
      // Download the file
      downloadFile(bytes, bestBuild.filename);
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError(error instanceof Error ? error.message : 'Failed to download build');
    } finally {
      setDownloading(false);
    }
  };

  const isReady = isAuthenticated && deviceProfile && !isRegistering;
  const showLoading = isAuthenticated && (deviceLoading || isRegistering || buildsLoading);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Download Your Build
          </h1>
          <p className="text-xl text-muted-foreground">
            Get the latest version optimized for your device
          </p>
        </div>

        {/* Main Action Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>One-Click Download</CardTitle>
            <CardDescription>
              Automatically selects the best build for your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isAuthenticated && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please log in to download builds
                </AlertDescription>
              </Alert>
            )}

            {showLoading && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  {isRegistering ? 'Registering your device...' : 'Loading...'}
                </AlertDescription>
              </Alert>
            )}

            {registrationSuccess && !deviceLoading && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">
                  Device registered successfully
                </AlertDescription>
              </Alert>
            )}

            {downloadError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{downloadError}</AlertDescription>
              </Alert>
            )}

            {downloadSuccess && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">
                  Download started successfully!
                </AlertDescription>
              </Alert>
            )}

            <Button
              size="lg"
              className="w-full text-lg h-14"
              onClick={handleDownload}
              disabled={!isReady || downloading || showLoading}
            >
              {downloading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Download Now
                </>
              )}
            </Button>

            {isReady && deviceProfile && (
              <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                <p><strong>Your Device:</strong> {deviceProfile.deviceLabel}</p>
                <p><strong>Platform:</strong> {deviceProfile.platform}</p>
                <p><strong>Browser:</strong> {deviceProfile.browser}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        {isReady && builds && builds.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Builds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {builds.length} build{builds.length !== 1 ? 's' : ''} available. 
                View all builds and download specific versions from the{' '}
                <a href="/builds" className="underline hover:text-foreground">Builds page</a>.
              </p>
            </CardContent>
          </Card>
        )}

        {isReady && (!builds || builds.length === 0) && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No builds available yet. Check back later or contact your administrator.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
