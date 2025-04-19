
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileVideo, Download, Trash2 } from 'lucide-react';
import { DownloadHistoryItem } from '@/types/video';
import { formatFileSize, formatDate, formatDuration } from '@/lib/formatters';

interface HistoryItemProps {
  item: DownloadHistoryItem;
  onRedownload: (url: string) => void;
  onDelete: (id: string) => void;
}

export function HistoryItem({ item, onRedownload, onDelete }: HistoryItemProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 shrink-0">
            {item.thumbnail ? (
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className="w-full h-32 sm:h-full object-cover"
              />
            ) : (
              <div className="w-full h-32 sm:h-full bg-muted flex items-center justify-center">
                <FileVideo className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="p-4 flex-1">
            <h3 className="font-medium line-clamp-1">{item.title}</h3>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
              <div>
                <span className="text-muted-foreground">Downloaded:</span>
                <p>{formatDate(item.downloadDate)}</p>
              </div>
              
              <div>
                <span className="text-muted-foreground">Size:</span>
                <p>{formatFileSize(item.filesize)}</p>
              </div>
              
              <div>
                <span className="text-muted-foreground">Format:</span>
                <p>{item.quality} {item.format}</p>
              </div>
              
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <p>{formatDuration(item.duration)}</p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => onRedownload(item.url)}
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Redownload
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-destructive hover:text-destructive"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
