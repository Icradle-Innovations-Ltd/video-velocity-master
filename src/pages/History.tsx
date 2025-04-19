
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HistoryItem } from '@/components/HistoryItem';
import { mockHistory } from '@/lib/mockData';
import { Download, Trash2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { DownloadHistoryItem } from '@/types/video';

const History = () => {
  const [historyItems, setHistoryItems] = useState<DownloadHistoryItem[]>(mockHistory);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleRedownload = (url: string) => {
    toast({
      title: "Redownload initiated",
      description: "The video URL has been added to the downloader",
    });

    // In a real app, this would redirect to the downloader with the URL
    window.location.href = `/?url=${encodeURIComponent(url)}`;
  };

  const handleDeleteItem = (id: string) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "History item deleted",
      description: "The item has been removed from your history",
    });
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "History cleared",
      description: "All download history has been cleared",
    });
  };

  // Calculate total downloaded data
  const totalDownloaded = historyItems.reduce((sum, item) => sum + item.filesize, 0);
  
  // Format the total size
  const formatTotalSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Download History</h1>
        <p className="text-muted-foreground">View and manage your download history</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Downloads</p>
            <p className="text-xl font-bold">{historyItems.length}</p>
          </div>
          
          <div className="bg-card rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Total Size</p>
            <p className="text-xl font-bold">{formatTotalSize(totalDownloaded)}</p>
          </div>
        </div>
        
        <Button 
          variant="destructive" 
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={historyItems.length === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear History
        </Button>
      </div>
      
      {historyItems.length > 0 ? (
        <div className="space-y-4">
          {historyItems.map(item => (
            <HistoryItem 
              key={item.id}
              item={item}
              onRedownload={handleRedownload}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-lg border">
          <h3 className="text-xl font-medium mb-2">No download history</h3>
          <p className="text-muted-foreground mb-4">Your download history will appear here</p>
          <Button variant="default" onClick={() => window.location.href = '/'}>
            <Download className="mr-2 h-4 w-4" />
            Download a video
          </Button>
        </div>
      )}
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear download history?</DialogTitle>
            <DialogDescription>
              This will permanently delete all items in your download history. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleClearHistory}>
              Clear History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;
