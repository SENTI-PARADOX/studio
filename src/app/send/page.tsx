"use client";

import { useCallback, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FileIcon } from "@/components/file-icon";
import { UploadCloud, X, Send as SendIcon } from "lucide-react";
import type { FileInfo } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const getFileInfo = (file: File): FileInfo => {
    const sizeInMB = file.size / (1024 * 1024);
    let type: FileInfo['type'] = 'other';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('video/')) type = 'video';
    else if (file.type.includes('pdf') || file.type.includes('document')) type = 'document';
    else if (file.type.includes('zip') || file.type.includes('archive')) type = 'archive';
    
    return {
        id: `${file.name}-${file.lastModified}`,
        name: file.name,
        size: sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${(file.size / 1024).toFixed(1)} KB`,
        type,
        objectUrl: type === 'image' ? URL.createObjectURL(file) : undefined,
    }
}


export default function SendPage() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'sending') {
      setProgress(0);
      timer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 100) {
            clearInterval(timer);
            setStatus('sent');
            toast({
              title: "Transfer Complete",
              description: `Sent ${files.length} files successfully.`,
            });
            return 100;
          }
          return newProgress;
        });
      }, 300);
    }
    return () => {
      clearInterval(timer);
    }
  }, [status, files.length, toast]);

  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.objectUrl) {
          URL.revokeObjectURL(file.objectUrl);
        }
      });
    };
  }, [files]);

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
        const newFiles = Array.from(selectedFiles).map(getFileInfo);
        const uniqueNewFiles = newFiles.filter(nf => !files.some(f => f.id === nf.id));
        setFiles(prev => [...prev, ...uniqueNewFiles]);
    }
  };

  const removeFile = (id: string) => {
    const fileToRemove = files.find(f => f.id === id);
    if(fileToRemove?.objectUrl) {
      URL.revokeObjectURL(fileToRemove.objectUrl);
    }
    setFiles(files.filter(f => f.id !== id));
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileChange(e.dataTransfer.files);
        e.dataTransfer.clearData();
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleSend = () => {
    if (files.length === 0) {
      toast({ variant: "destructive", title: "No files selected", description: "Please select at least one file to send." });
      return;
    }
    if (!pin.match(/^\d{6}$/)) {
      toast({ variant: "destructive", title: "Invalid PIN", description: "Please enter a 6-digit PIN." });
      return;
    }
    setStatus('sending');
  };
  
  const resetState = () => {
    setFiles([]);
    setPin('');
    setStatus('idle');
    setProgress(0);
  }

  if (status === 'sending' || status === 'sent' || status === 'failed') {
    return (
        <div className="container mx-auto p-4 md:p-8 flex items-center justify-center h-[calc(100vh-4rem)]">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">
                        {status === 'sending' && 'Sending Files...'}
                        {status === 'sent' && 'Files Sent!'}
                        {status === 'failed' && 'Transfer Failed'}
                    </CardTitle>
                    <CardDescription>
                        {status === 'sending' && `Sending ${files.length} files.`}
                        {status === 'sent' && 'Your files have been sent successfully.'}
                        {status === 'failed' && 'Could not connect to receiver. Please check PIN and try again.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {status === 'sending' && (
                        <div className="space-y-4">
                            <Progress value={progress} className="w-full" />
                            <p className="text-center text-muted-foreground">{Math.round(progress)}% complete</p>
                        </div>
                    )}
                     <ul className="space-y-2 mt-6 max-h-60 overflow-y-auto">
                        {files.map(file => (
                          <li key={file.id} className="flex items-center gap-3 p-2 rounded-md bg-secondary/50">
                            {file.type === 'image' && file.objectUrl ? (
                                <Image src={file.objectUrl} alt={file.name} width={40} height={40} className="rounded-md object-cover" />
                            ) : (
                                <FileIcon type={file.type} className="h-8 w-8 text-muted-foreground" />
                            )}
                            <div className="flex-grow">
                              <p className="font-medium text-sm truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{file.size}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    {status !== 'sending' && (
                        <div className="mt-6 flex justify-end">
                            <Button onClick={resetState}>Send More Files</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-headline font-bold mb-8">Send Files</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card 
            className={cn("transition-colors", isDragOver && "border-primary bg-primary/5")}
            onDrop={handleDrop} 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <CardContent className="p-6">
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-secondary/50 transition-colors"
                >
                    <UploadCloud className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-semibold">Click to browse or drag and drop files</p>
                    <p className="text-sm text-muted-foreground">Select multiple images, videos, or documents</p>
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        multiple 
                        className="hidden" 
                        onChange={(e) => handleFileChange(e.target.files)} 
                    />
                </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Selected Files ({files.length})</CardTitle>
              <CardDescription>Enter the receiver's PIN and hit send.</CardDescription>
            </CardHeader>
            <CardContent>
                {files.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 mb-4">
                        {files.map(file => (
                            <div key={file.id} className="flex items-center gap-3 p-2 rounded-md bg-secondary/50">
                                {file.type === 'image' && file.objectUrl ? (
                                    <Image src={file.objectUrl} alt={file.name} width={40} height={40} className="rounded-md object-cover" />
                                ) : (
                                    <FileIcon type={file.type} className="h-8 w-8 text-muted-foreground" />
                                )}
                                <div className="flex-grow min-w-0">
                                    <p className="font-medium text-sm truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{file.size}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => removeFile(file.id)}>
                                    <X size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-10">
                        <p>No files selected yet.</p>
                    </div>
                )}
              <div className="flex items-end gap-4 mt-4">
                <div className="flex-grow">
                  <label htmlFor="pin" className="text-sm font-medium">Receiver's PIN</label>
                  <Input 
                    id="pin" 
                    placeholder="6-digit PIN" 
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    className="mt-1 font-mono text-lg tracking-widest"
                  />
                </div>
                <Button size="lg" onClick={handleSend} disabled={files.length === 0 || pin.length !== 6}>
                  <SendIcon size={18} />
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
