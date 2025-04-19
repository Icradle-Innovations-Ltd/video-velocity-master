
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NetworkStatus } from '@/components/NetworkStatus';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Network = () => {
  const [proxyEnabled, setProxyEnabled] = useState(false);
  const [proxyAddress, setProxyAddress] = useState('');
  const [proxyPort, setProxyPort] = useState('8080');
  const [proxyUsername, setProxyUsername] = useState('');
  const [proxyPassword, setProxyPassword] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [useSystemProxy, setUseSystemProxy] = useState(true);
  const [networkSpeed, setNetworkSpeed] = useState<number | undefined>(10485760); // 10 MB/s
  
  const { toast } = useToast();

  const handleSaveProxy = () => {
    if (proxyEnabled && !proxyAddress) {
      toast({
        title: "Error",
        description: "Please enter a proxy address",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Proxy settings saved",
      description: proxyEnabled 
        ? `Proxy configured: ${proxyAddress}:${proxyPort}` 
        : "Proxy has been disabled",
    });
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    
    // Simulate connection test
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      setIsConnected(success);
      setIsTesting(false);
      
      if (success) {
        const randomSpeed = Math.floor(Math.random() * 15000000) + 5000000; // 5-20 MB/s
        setNetworkSpeed(randomSpeed);
        
        toast({
          title: "Connection test successful",
          description: "Your network is working properly",
        });
      } else {
        setNetworkSpeed(undefined);
        
        toast({
          title: "Connection test failed",
          description: "Could not establish a connection",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Network Settings</h1>
        <p className="text-muted-foreground">Configure network and proxy settings for optimal downloads</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="proxy">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="proxy">Proxy Settings</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="proxy" className="p-4 border rounded-lg mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="proxy-enabled" className="font-medium">Enable Proxy</Label>
                  <Switch 
                    id="proxy-enabled" 
                    checked={proxyEnabled}
                    onCheckedChange={setProxyEnabled}
                  />
                </div>
                
                {proxyEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="use-system-proxy" className="text-sm">Proxy Source</Label>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="use-system-proxy" 
                          checked={useSystemProxy}
                          onCheckedChange={setUseSystemProxy}
                        />
                        <Label htmlFor="use-system-proxy" className="cursor-pointer">
                          Use system proxy settings
                        </Label>
                      </div>
                    </div>
                    
                    {!useSystemProxy && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="proxy-address">Proxy Address</Label>
                          <Input 
                            id="proxy-address" 
                            value={proxyAddress}
                            onChange={(e) => setProxyAddress(e.target.value)}
                            placeholder="e.g., 192.168.1.1"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="proxy-port">Proxy Port</Label>
                          <Input 
                            id="proxy-port" 
                            value={proxyPort}
                            onChange={(e) => setProxyPort(e.target.value)}
                            placeholder="e.g., 8080"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="proxy-username">Username (Optional)</Label>
                          <Input 
                            id="proxy-username" 
                            value={proxyUsername}
                            onChange={(e) => setProxyUsername(e.target.value)}
                            placeholder="Proxy username"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="proxy-password">Password (Optional)</Label>
                          <Input 
                            id="proxy-password" 
                            type="password"
                            value={proxyPassword}
                            onChange={(e) => setProxyPassword(e.target.value)}
                            placeholder="Proxy password"
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
                
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveProxy}>
                    Save Proxy Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="p-4 border rounded-lg mt-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Network Throttling</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="throttling-enabled">Enable Bandwidth Limits</Label>
                      <Switch id="throttling-enabled" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max-bandwidth">
                        Maximum Bandwidth: <span className="font-medium">50%</span>
                      </Label>
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <Input 
                          id="max-bandwidth" 
                          type="range" 
                          min="10" 
                          max="100" 
                          step="5" 
                          defaultValue="50"
                          className="col-span-10"
                        />
                        <span className="col-span-2 text-center">50%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Connection Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-connections">Maximum Connections</Label>
                      <Input 
                        id="max-connections" 
                        type="number" 
                        defaultValue="8"
                        min="1"
                        max="32"
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum number of simultaneous connections per download (1-32)
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeout">Connection Timeout (seconds)</Label>
                      <Input 
                        id="timeout" 
                        type="number" 
                        defaultValue="30"
                        min="5"
                        max="300"
                      />
                      <p className="text-xs text-muted-foreground">
                        How long to wait before timing out a connection
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="retries">Connection Retries</Label>
                      <Input 
                        id="retries" 
                        type="number" 
                        defaultValue="3"
                        min="0"
                        max="10"
                      />
                      <p className="text-xs text-muted-foreground">
                        Number of times to retry a failed connection
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button>
                    Save Advanced Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <NetworkStatus 
            isConnected={isConnected} 
            proxy={{ 
              enabled: proxyEnabled,
              address: proxyAddress,
              port: parseInt(proxyPort)
            }}
            speed={networkSpeed}
          />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Connection Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted rounded-md p-3">
                  <p className="text-sm text-muted-foreground">
                    Test your network connection to ensure optimal download performance.
                  </p>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleTestConnection}
                  disabled={isTesting}
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      {isConnected ? (
                        <Wifi className="mr-2 h-4 w-4" />
                      ) : (
                        <WifiOff className="mr-2 h-4 w-4" />
                      )}
                      Test Connection
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Network;
