"use client";

import { useEffect, useState } from 'react';
import QRCode from "react-qr-code";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/file-icon";
import { Progress } from "@/components/ui/progress";
import { Wifi, Copy, Check } from "lucide-react";
import type { FileInfo } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";

const mockReceivedFiles: FileInfo[] = [
  { id: 'rf1', name: 'presentation-slides.pptx', size: '12.3 MB', type: 'document' },
  { id: 'rf2', name: 'team-photo-2024.jpg', size: '6.1 MB', type: 'image' },
  { id: 'rf3', name: 'project-walkthrough.mp4', size: '88.9 MB', type: 'video' },
];

export default function ReceivePage() {
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<'waiting' | 'receiving' | 'completed' | 'failed'>('waiting');
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Generate a random 6-digit PIN on mount
    setPin(Math.floor(100000 + Math.random() * 900000).toString());
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'receiving') {
      setProgress(0);
      timer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(timer);
            setStatus('completed');
            toast({
              title: "Transfer Complete",
              description: `Received ${mockReceivedFiles.length} files.`,
            });
            return 100;
          }
          return newProgress;
        });
      }, 200);
    }
    return () => clearInterval(timer);
  }, [status, toast]);
  
  const handleCopyPin = () => {
    if(!pin) return;
    navigator.clipboard.writeText(pin);
    setCopied(true);
    toast({ title: "PIN Copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const resetState = () => {
    setStatus('waiting');
    setProgress(0);
    setPin(Math.floor(100000 + Math.random() * 900000).toString());
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-headline font-bold mb-8">Receive Files</h1>
      
      {status === 'waiting' && (
        <Card className="max-w-4xl mx-auto transition-all duration-300">
          <CardHeader className="text-center">
            <Wifi className="mx-auto h-12 w-12 text-primary animate-pulse" />
            <CardTitle className="font-headline text-3xl mt-4">Ready to Receive</CardTitle>
            <CardDescription>Share your PIN or QR code with the sender to begin.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center p-8 border rounded-lg bg-background">
              <p className="text-sm text-muted-foreground">YOUR PIN</p>
              <div className="flex items-center justify-center gap-4 my-2">
                <p className="text-6xl font-bold font-mono tracking-widest text-primary">{pin}</p>
                <Button variant="ghost" size="icon" onClick={handleCopyPin} aria-label="Copy PIN">
                  {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            <div className="flex justify-center items-center">
                <div className="w-48 h-48 p-3 bg-white rounded-lg shadow-md">
                    {pin && <QRCode value={pin} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} viewBox={`0 0 256 256`} />}
                </div>
            </div>
          </CardContent>
          <div className="p-6 pt-0 text-center text-sm text-muted-foreground">
            <p>Waiting for sender to connect...</p>
            <Button onClick={() => setStatus('receiving')} className="mt-4">Simulate Receiving Files</Button>
          </div>
        </Card>
      )}

      {(status === 'receiving' || status === 'completed' || status === 'failed') && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">
              {status === 'receiving' && 'Receiving Files...'}
              {status === 'completed' && 'Transfer Complete!'}
              {status === 'failed' && 'Transfer Failed'}
            </CardTitle>
            <CardDescription>
              {status === 'receiving' && 'Please keep this page open.'}
              {status === 'completed' && `You have received ${mockReceivedFiles.length} files.`}
              {status === 'failed' && 'The connection was lost. Please try again.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'receiving' && (
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <p className="text-center text-muted-foreground">{progress}% complete</p>
              </div>
            )}
            {(status === 'completed' || (status === 'receiving' && progress > 0)) && (
               <ul className="space-y-2 mt-6">
                {mockReceivedFiles.map(file => (
                  <li key={file.id} className="flex items-center gap-3 p-2 rounded-md bg-secondary/50">
                    <FileIcon type={file.type} className="h-6 w-6 text-muted-foreground" />
                    <div className="flex-grow">
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {status !== 'receiving' && (
              <div className="mt-6 flex justify-end">
                <Button onClick={resetState}>Receive More Files</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
