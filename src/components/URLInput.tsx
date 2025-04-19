
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface URLInputProps {
  onFetchMetadata: (url: string) => void;
  isLoading: boolean;
}

export function URLInput({ onFetchMetadata, isLoading }: URLInputProps) {
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  const isValidURL = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a video URL",
        variant: "destructive",
      });
      return;
    }

    if (!isValidURL(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    onFetchMetadata(url);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-muted-foreground h-5 w-5" />
        <Input
          type="url"
          placeholder="Paste video URL here..."
          className="pl-10 pr-32 h-14 text-base"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button 
          type="submit" 
          className="absolute right-1 h-12 bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Analyze
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
