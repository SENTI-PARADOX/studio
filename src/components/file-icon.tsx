import type { FileInfo } from '@/lib/data';
import { File, FileArchive, FileImage, FileText, FileVideo } from 'lucide-react';

export function FileIcon({ type, className }: { type: FileInfo['type'], className?: string }) {
  const props = { className: className || "h-8 w-8 text-primary" };
  switch (type) {
    case 'image':
      return <FileImage {...props} />;
    case 'video':
      return <FileVideo {...props} />;
    case 'document':
      return <FileText {...props} />;
    case 'archive':
      return <FileArchive {...props} />;
    default:
      return <File {...props} />;
  }
}
