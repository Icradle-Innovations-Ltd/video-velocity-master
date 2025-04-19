
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DownloadSettings } from '@/types/video';

const Settings = () => {
  const [settings, setSettings] = useState<DownloadSettings>({
    maxConcurrentDownloads: 3,
    threadsPerDownload: 8,
    chunkSize: 1048576, // 1MB in bytes
    defaultSaveLocation: 'C:\\Downloads',
    bandwidthLimit: 80, // 80% of available bandwidth
    proxyEnabled: false,
    preferredQuality: 'highest',
    preferredFormat: 'mp4',
    downloadThumbnail: true,
    useSystemProxy: true,
    autoConvertFormat: false
  });
  
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // In a real app, this would save to local storage or backend
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
    });
  };

  const handleResetSettings = () => {
    // Reset to default values
    setSettings({
      maxConcurrentDownloads: 3,
      threadsPerDownload: 8,
      chunkSize: 1048576,
      defaultSaveLocation: 'C:\\Downloads',
      bandwidthLimit: 80,
      proxyEnabled: false,
      preferredQuality: 'highest',
      preferredFormat: 'mp4',
      downloadThumbnail: true,
      useSystemProxy: true,
      autoConvertFormat: false
    });
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values",
    });
  };

  const handleBrowseFolder = () => {
    // In a real desktop app, this would open a folder picker dialog
    toast({
      title: "Folder browser",
      description: "This would open a folder picker in a real desktop app",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure application settings and preferences</p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="save-location">Default Save Location</Label>
                <div className="flex gap-2">
                  <Input 
                    id="save-location" 
                    value={settings.defaultSaveLocation}
                    onChange={(e) => setSettings({...settings, defaultSaveLocation: e.target.value})}
                    placeholder="Choose a location"
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleBrowseFolder}
                    className="shrink-0"
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    Browse
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Application Behavior</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="minimize-to-tray" className="cursor-pointer">
                    Minimize to system tray
                  </Label>
                  <Switch 
                    id="minimize-to-tray" 
                    defaultChecked={true}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="start-with-os" className="cursor-pointer">
                    Start with operating system
                  </Label>
                  <Switch 
                    id="start-with-os" 
                    defaultChecked={false}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="cursor-pointer">
                    Show desktop notifications
                  </Label>
                  <Switch 
                    id="notifications" 
                    defaultChecked={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="downloads" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Download Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="concurrent-downloads">
                  Maximum Concurrent Downloads: <span className="font-medium">{settings.maxConcurrentDownloads}</span>
                </Label>
                <Input 
                  id="concurrent-downloads" 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={settings.maxConcurrentDownloads}
                  onChange={(e) => setSettings({...settings, maxConcurrentDownloads: parseInt(e.target.value)})}
                />
                <p className="text-xs text-muted-foreground">
                  Limit the number of videos downloading at once (1-10)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="threads-per-download">
                  Threads Per Download: <span className="font-medium">{settings.threadsPerDownload}</span>
                </Label>
                <Input 
                  id="threads-per-download" 
                  type="range" 
                  min="1" 
                  max="16" 
                  value={settings.threadsPerDownload}
                  onChange={(e) => setSettings({...settings, threadsPerDownload: parseInt(e.target.value)})}
                />
                <p className="text-xs text-muted-foreground">
                  Number of parallel connections per file (1-16)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chunk-size">Chunk Size</Label>
                <Select 
                  value={settings.chunkSize.toString()}
                  onValueChange={(value) => setSettings({...settings, chunkSize: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select chunk size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="524288">512 KB</SelectItem>
                    <SelectItem value="1048576">1 MB</SelectItem>
                    <SelectItem value="2097152">2 MB</SelectItem>
                    <SelectItem value="5242880">5 MB</SelectItem>
                    <SelectItem value="10485760">10 MB</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Size of individual download chunks
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bandwidth-limit">
                  Bandwidth Limit: <span className="font-medium">{settings.bandwidthLimit}%</span>
                </Label>
                <Input 
                  id="bandwidth-limit" 
                  type="range" 
                  min="10" 
                  max="100" 
                  step="5"
                  value={settings.bandwidthLimit}
                  onChange={(e) => setSettings({...settings, bandwidthLimit: parseInt(e.target.value)})}
                />
                <p className="text-xs text-muted-foreground">
                  Percentage of available bandwidth to use (10-100%)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferred-quality">Default Video Quality</Label>
                <Select 
                  value={settings.preferredQuality}
                  onValueChange={(value) => setSettings({...settings, preferredQuality: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="highest">Highest Available</SelectItem>
                    <SelectItem value="medium">Medium (720p)</SelectItem>
                    <SelectItem value="lowest">Lowest (saves bandwidth)</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferred-format">Default Format</Label>
                <Select 
                  value={settings.preferredFormat}
                  onValueChange={(value) => setSettings({...settings, preferredFormat: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp4">MP4</SelectItem>
                    <SelectItem value="webm">WebM</SelectItem>
                    <SelectItem value="mkv">MKV</SelectItem>
                    <SelectItem value="mp3">MP3 (audio only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="download-thumbnail" className="cursor-pointer">
                  Download video thumbnails
                </Label>
                <Switch 
                  id="download-thumbnail" 
                  checked={settings.downloadThumbnail}
                  onCheckedChange={(checked) => setSettings({...settings, downloadThumbnail: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversion" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Format Conversion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-convert" className="cursor-pointer">
                  Auto-convert after download
                </Label>
                <Switch 
                  id="auto-convert" 
                  checked={settings.autoConvertFormat}
                  onCheckedChange={(checked) => setSettings({...settings, autoConvertFormat: checked})}
                />
              </div>
              
              {settings.autoConvertFormat && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="target-format">Target Format</Label>
                    <Select 
                      value={settings.targetFormat || 'mp4'}
                      onValueChange={(value) => setSettings({...settings, targetFormat: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select target format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp4">MP4</SelectItem>
                        <SelectItem value="webm">WebM</SelectItem>
                        <SelectItem value="mkv">MKV</SelectItem>
                        <SelectItem value="avi">AVI</SelectItem>
                        <SelectItem value="mp3">MP3 (audio only)</SelectItem>
                        <SelectItem value="m4a">M4A (audio only)</SelectItem>
                        <SelectItem value="wav">WAV (audio only)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2 pb-2">
                    <h3 className="text-sm font-medium mb-2">Conversion Presets</h3>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="preset-high" name="preset" defaultChecked />
                        <Label htmlFor="preset-high">High Quality (larger file size)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="preset-balanced" name="preset" />
                        <Label htmlFor="preset-balanced">Balanced</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="preset-small" name="preset" />
                        <Label htmlFor="preset-small">Small Size (lower quality)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="preset-custom" name="preset" />
                        <Label htmlFor="preset-custom">Custom</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ffmpeg-path">FFmpeg Path (optional)</Label>
                    <Input 
                      id="ffmpeg-path" 
                      placeholder="Path to custom FFmpeg binary"
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to use the built-in FFmpeg
                    </p>
                  </div>
                </>
              )}
              
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm text-muted-foreground">
                  Format conversion requires FFmpeg, which is included with VideoVelocity Master. 
                  Custom FFmpeg paths are optional for advanced users.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleResetSettings}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
