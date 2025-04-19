
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

interface NetworkStatusProps {
  isConnected: boolean;
  proxy?: {
    enabled: boolean;
    address?: string;
    port?: number;
  };
  speed?: number; // in bytes per second
}

export function NetworkStatus({ isConnected, proxy, speed }: NetworkStatusProps) {
  const formatNetworkSpeed = (bytesPerSecond?: number) => {
    if (!bytesPerSecond) return 'Unknown';
    
    if (bytesPerSecond < 1024) {
      return `${bytesPerSecond.toFixed(1)} B/s`;
    } else if (bytesPerSecond < 1024 * 1024) {
      return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
    } else if (bytesPerSecond < 1024 * 1024 * 1024) {
      return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
    } else {
      return `${(bytesPerSecond / (1024 * 1024 * 1024)).toFixed(1)} GB/s`;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {isConnected ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-destructive" />
          )}
          Network Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Connection:</span>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          {proxy && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Proxy:</span>
              <Badge variant={proxy.enabled ? "outline" : "secondary"}>
                {proxy.enabled 
                  ? `${proxy.address}:${proxy.port}` 
                  : "Disabled"}
              </Badge>
            </div>
          )}

          {speed !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Network Speed:</span>
              <span className="font-medium">{formatNetworkSpeed(speed)}</span>
            </div>
          )}

          <div className="mt-4 bg-muted rounded-md p-3">
            <p className="text-sm text-muted-foreground">
              {isConnected 
                ? "Your network connection is active and ready for video downloads." 
                : "Network connection is unavailable. Please check your internet connection."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
