import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useBuilds } from '../hooks/useBuilds';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Download, Loader2, AlertCircle, Package } from 'lucide-react';
import { downloadFile } from '../utils/download';
import type { BuildEntry } from '../backend';

export default function Builds() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { data: builds, isLoading, error } = useBuilds(null);
  
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownloadBuild = async (build: BuildEntry) => {
    setDownloadingId(build.id);
    setDownloadError(null);

    try {
      const bytes = await build.file.getBytes();
      downloadFile(bytes, build.filename);
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError(error instanceof Error ? error.message : 'Failed to download build');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please log in to view available builds
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Available Builds</h1>
          <p className="text-lg text-muted-foreground">
            Browse and download specific build versions
          </p>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load builds'}
            </AlertDescription>
          </Alert>
        )}

        {/* Download Error */}
        {downloadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{downloadError}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && builds && builds.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
              <Package className="h-16 w-16 text-muted-foreground" />
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">No Builds Available</h3>
                <p className="text-muted-foreground">
                  There are no builds available yet. Check back later.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Builds List */}
        {!isLoading && builds && builds.length > 0 && (
          <div className="space-y-4">
            {builds.map((build) => (
              <Card key={build.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {build.filename}
                        <Badge variant="outline">{build.version}</Badge>
                      </CardTitle>
                      <CardDescription>
                        {formatDate(build.createdAt)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <strong>Target:</strong> {build.targetDevice}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDownloadBuild(build)}
                      disabled={downloadingId === build.id}
                    >
                      {downloadingId === build.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
