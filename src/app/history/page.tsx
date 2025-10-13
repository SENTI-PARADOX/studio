import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockHistory, type Transfer } from "@/lib/data";
import { FileIcon } from "@/components/file-icon";
import { ArrowDownLeft, ArrowUpRight, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import { PlaceHolderImages } from "@/lib/placeholder-images";

function TransferCard({ transfer }: { transfer: Transfer }) {
  const isSent = transfer.type === 'sent';
  const Icon = isSent ? ArrowUpRight : ArrowDownLeft;
  const iconColor = isSent ? "text-primary" : "text-accent";

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline flex items-center gap-2">
              <Icon className={iconColor} />
              {isSent ? 'Sent to' : 'Received from'} {transfer.device}
            </CardTitle>
            <CardDescription>{format(parseISO(transfer.date), "PPP p")}</CardDescription>
          </div>
          {transfer.status === 'completed' ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Completed</Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle size={14} /> Failed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {transfer.files.map(file => {
            const imagePlaceholder = file.previewId ? PlaceHolderImages.find(p => p.id === file.previewId) : null;
            return (
              <li key={file.id} className="flex items-center gap-3 p-2 rounded-md bg-secondary/50">
                {imagePlaceholder ? (
                    <Image src={imagePlaceholder.imageUrl} alt={file.name} width={40} height={40} className="rounded-md object-cover" data-ai-hint={imagePlaceholder.imageHint} />
                ) : (
                    <FileIcon type={file.type} className="h-8 w-8 text-muted-foreground" />
                )}
                <div className="flex-grow">
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.size}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}

export default function HistoryPage() {
  const sentTransfers = mockHistory.filter(t => t.type === 'sent');
  const receivedTransfers = mockHistory.filter(t => t.type === 'received');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-headline font-bold mb-8">Transfer History</h1>
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {mockHistory.map(transfer => <TransferCard key={transfer.id} transfer={transfer} />)}
        </TabsContent>
        <TabsContent value="sent" className="mt-6">
          {sentTransfers.map(transfer => <TransferCard key={transfer.id} transfer={transfer} />)}
        </TabsContent>
        <TabsContent value="received" className="mt-6">
          {receivedTransfers.map(transfer => <TransferCard key={transfer.id} transfer={transfer} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
