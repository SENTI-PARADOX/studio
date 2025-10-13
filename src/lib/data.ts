import { PlaceHolderImages } from './placeholder-images';

export type FileInfo = {
  name: string;
  size: string;
  type: 'image' | 'video' | 'document' | 'archive' | 'other';
  id: string;
  previewId?: string;
  objectUrl?: string; // For client-side previews
};

export type Transfer = {
  id: string;
  type: 'sent' | 'received';
  device: string;
  date: string;
  files: FileInfo[];
  status: 'completed' | 'failed' | 'in-progress';
};

export const mockHistory: Transfer[] = [
  {
    id: '1',
    type: 'received',
    device: 'Dans-iPhone',
    date: '2024-07-29T10:30:00Z',
    status: 'completed',
    files: [
      { id: 'f1', name: 'vacation-photo-1.jpg', size: '4.5 MB', type: 'image', previewId: 'vacation-photo-1' },
      { id: 'f2', name: 'project-brief.pdf', size: '1.2 MB', type: 'document' },
    ],
  },
  {
    id: '2',
    type: 'sent',
    device: 'Office-MacBook-Pro',
    date: '2024-07-28T15:00:00Z',
    status: 'completed',
    files: [
      { id: 'f3', name: 'quarterly-report.docx', size: '2.8 MB', type: 'document' },
    ],
  },
  {
    id: '3',
    type: 'received',
    device: 'Sarahs-Pixel-8',
    date: '2024-07-27T09:15:00Z',
    status: 'failed',
    files: [
      { id: 'f4', name: 'conference-video.mp4', size: '150.3 MB', type: 'video' },
    ],
  },
  {
    id: '4',
    type: 'sent',
    device: 'Gaming-PC',
    date: '2024-07-26T22:45:00Z',
    status: 'completed',
    files: [
      { id: 'f5', name: 'design-assets.zip', size: '25.6 MB', type: 'archive' },
      { id: 'f6', name: 'styleguide.pdf', size: '3.1 MB', type: 'document' },
      { id: 'f7', name: 'logo-final.svg', size: '150 KB', type: 'image', previewId: 'logo-final' },
    ],
  },
];
