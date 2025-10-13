import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Download, History } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          YourShare
        </h1>
        <p className="text-muted-foreground mt-2 text-lg md:text-xl">
          Seamlessly share files across your devices. Fast and simple.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="hover:shadow-primary/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-3xl">
              <Send className="text-primary" />
              Send Files
            </CardTitle>
            <CardDescription>
              Select and send files to another device in your network.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Button asChild size="lg" className="w-full font-bold text-lg transition-transform duration-200 transform hover:scale-105">
              <Link href="/send">Start Sending</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-accent/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-3xl">
              <Download className="text-accent" />
              Receive Files
            </CardTitle>
            <CardDescription>
              Prepare your device to receive files from a sender.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Button asChild size="lg" variant="destructive" className="w-full font-bold text-lg transition-transform duration-200 transform hover:scale-105">
              <Link href="/receive">Start Receiving</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12">
        <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary transition-colors">
          <Link href="/history" className="flex items-center gap-2">
            <History size={18} />
            View Transfer History
          </Link>
        </Button>
      </div>
    </div>
  );
}
