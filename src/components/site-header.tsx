import Link from 'next/link';
import { Share2, History, Send, Download, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SiteHeader() {
  const navItems = [
    { href: '/send', label: 'Send', icon: <Send size={18} /> },
    { href: '/receive', label: 'Receive', icon: <Download size={18} /> },
    { href: '/history', label: 'History', icon: <History size={18} /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Share2 className="h-6 w-6 text-primary" />
          <span className="font-headline font-bold text-xl">YourShare</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-4 text-sm">
          {navItems.map(item => (
            <Button asChild variant="ghost" key={item.href}>
              <Link href={item.href}>
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <Share2 className="h-6 w-6 text-primary" />
                  <span className="font-headline font-bold text-xl">YourShare</span>
                </Link>
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
