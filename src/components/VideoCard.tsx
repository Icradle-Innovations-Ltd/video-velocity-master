
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { VideoMetadata, VideoFormat } from '@/types/video';
import { formatDuration, formatFileSize } from '@/lib/formatters';

interface VideoCardProps {
  video: VideoMetadata;
  onDownload: (video: VideoMetadata, format: VideoFormat) => void;
  onRemove?: () => void;
}

export function VideoCard({ video, onDownload, onRemove }: VideoCardProps) {
  const [selectedFormat, setSelectedFormat] = React.useState<VideoFormat | null>(null);

  React.useEffect(() => {
    // Set default format to 1080p or highest available
    if (video.formats && video.formats.length > 0) {
      const format1080p = video.formats.find(f => f.quality === '1080p');
      setSelectedFormat(format1080p || video.formats[0]);
    }
  }, [video.formats]);

  if (!video) return null;

  const handleDownload = () => {
    if (selectedFormat) {
      onDownload(video, selectedFormat);
    }
  };

  // Group formats by type (video/audio)
  const videoFormats = video.formats.filter(f => !f.isAudioOnly);
  const audioFormats = video.formats.filter(f => f.isAudioOnly);

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={video.thumbnail || '/placeholder.svg'} 
            alt={video.title} 
            className="w-full aspect-video object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
            <div className="text-white">
              <p className="text-xs">{formatDuration(video.duration)}</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-2">{video.title}</h3>
          
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Format:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    {selectedFormat ? `${selectedFormat.quality} ${selectedFormat.extension}` : 'Select Format'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  {videoFormats.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold">Video</div>
                      {videoFormats.map(format => (
                        <DropdownMenuItem 
                          key={format.id}
                          onClick={() => setSelectedFormat(format)}
                          className="flex justify-between"
                        >
                          <span>{format.quality} {format.extension}</span>
                          {format.filesize && <span className="text-xs opacity-70">{formatFileSize(format.filesize)}</span>}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                  
                  {audioFormats.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold mt-1">Audio Only</div>
                      {audioFormats.map(format => (
                        <DropdownMenuItem 
                          key={format.id}
                          onClick={() => setSelectedFormat(format)}
                          className="flex justify-between"
                        >
                          <span>{format.audioQuality || 'Audio'} {format.extension}</span>
                          {format.filesize && <span className="text-xs opacity-70">{formatFileSize(format.filesize)}</span>}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {selectedFormat?.filesize && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Size:</span>
                <span className="text-sm">{formatFileSize(selectedFormat.filesize)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0 gap-2">
        <Button 
          onClick={handleDownload} 
          className="w-full"
          disabled={!selectedFormat}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        
        {onRemove && (
          <Button 
            variant="outline" 
            size="icon"
            onClick={onRemove}
            className="shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
