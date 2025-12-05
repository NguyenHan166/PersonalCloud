// Comprehensive mock data for development
import type { Item, Tag, Collection, SharedLink, User, FileMeta } from '@/types/domain';

// Current user
export const mockCurrentUser: User = {
  id: 'user-1',
  email: 'john@example.com',
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  createdAt: '2024-01-15T08:00:00Z',
};

// Tags with different colors
export const mockTags: Tag[] = [
  { id: 'tag-1', name: 'Frontend', color: '#6366F1', usageCount: 15 },
  { id: 'tag-2', name: 'Backend', color: '#22C55E', usageCount: 12 },
  { id: 'tag-3', name: 'Design', color: '#F59E0B', usageCount: 8 },
  { id: 'tag-4', name: 'DevOps', color: '#EF4444', usageCount: 5 },
  { id: 'tag-5', name: 'AI/ML', color: '#8B5CF6', usageCount: 3 },
  { id: 'tag-6', name: 'React', color: '#06B6D4', usageCount: 10 },
  { id: 'tag-7', name: 'TypeScript', color: '#3B82F6', usageCount: 9 },
  { id: 'tag-8', name: 'Tutorial', color: '#EC4899', usageCount: 7 },
  { id: 'tag-9', name: 'Reference', color: '#14B8A6', usageCount: 6 },
  { id: 'tag-10', name: 'Important', color: '#F97316', usageCount: 4 },
];

// File metadata examples
export const mockFiles: FileMeta[] = [
  {
    id: 'file-1',
    userId: 'user-1',
    storageKey: 'uploads/2024/project-proposal.pdf',
    originalName: 'Project Proposal 2024.pdf',
    filename: 'Project Proposal 2024.pdf',
    mimeType: 'application/pdf',
    size: 2457600, // 2.4MB
    url: '/files/project-proposal.pdf',
    createdAt: '2024-11-20T10:30:00Z',
    uploadedAt: '2024-11-20T10:30:00Z',
  },
  {
    id: 'file-2',
    userId: 'user-1',
    storageKey: 'uploads/2024/architecture-diagram.png',
    originalName: 'System Architecture.png',
    filename: 'System Architecture.png',
    mimeType: 'image/png',
    size: 1536000, // 1.5MB
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200',
    createdAt: '2024-11-18T14:20:00Z',
    uploadedAt: '2024-11-18T14:20:00Z',
  },
  {
    id: 'file-3',
    userId: 'user-1',
    storageKey: 'uploads/2024/demo-video.mp4',
    originalName: 'Product Demo.mp4',
    filename: 'Product Demo.mp4',
    mimeType: 'video/mp4',
    size: 52428800, // 50MB
    url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    createdAt: '2024-11-15T09:00:00Z',
    uploadedAt: '2024-11-15T09:00:00Z',
  },
  {
    id: 'file-4',
    userId: 'user-1',
    storageKey: 'uploads/2024/meeting-notes.docx',
    originalName: 'Meeting Notes Nov 2024.docx',
    filename: 'Meeting Notes Nov 2024.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 45056, // 44KB
    createdAt: '2024-11-22T16:45:00Z',
    uploadedAt: '2024-11-22T16:45:00Z',
  },
  {
    id: 'file-5',
    userId: 'user-1',
    storageKey: 'uploads/2024/photo-beach.jpg',
    originalName: 'Beach Vacation.jpg',
    filename: 'Beach Vacation.jpg',
    mimeType: 'image/jpeg',
    size: 3145728, // 3MB
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200',
    createdAt: '2024-11-10T16:00:00Z',
    uploadedAt: '2024-11-10T16:00:00Z',
  },
  {
    id: 'file-6',
    userId: 'user-1',
    storageKey: 'uploads/2024/budget-2024.xlsx',
    originalName: 'Budget 2024.xlsx',
    filename: 'Budget 2024.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 128000,
    createdAt: '2024-11-05T09:00:00Z',
    uploadedAt: '2024-11-05T09:00:00Z',
  },
  {
    id: 'file-7',
    userId: 'user-1',
    storageKey: 'uploads/2024/sunset-photo.jpg',
    originalName: 'Sunset Photo.jpg',
    filename: 'Sunset Photo.jpg',
    mimeType: 'image/jpeg',
    size: 2097152,
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=200',
    createdAt: '2024-11-08T18:30:00Z',
    uploadedAt: '2024-11-08T18:30:00Z',
  },
  {
    id: 'file-8',
    userId: 'user-1',
    storageKey: 'uploads/2024/backup.zip',
    originalName: 'Project Backup.zip',
    filename: 'Project Backup.zip',
    mimeType: 'application/zip',
    size: 104857600, // 100MB
    createdAt: '2024-11-01T12:00:00Z',
    uploadedAt: '2024-11-01T12:00:00Z',
  },
];

// Items - comprehensive dataset covering all types and cases
export const mockItems: Item[] = [
  // === FILE ITEMS ===
  {
    id: 'item-1',
    userId: 'user-1',
    type: 'file',
    title: 'Project Proposal 2024',
    description: 'Complete project proposal with timeline, budget, and resource allocation for the new cloud platform.',
    category: 'Work',
    project: 'Cloud Platform',
    importance: 'high',
    tags: [mockTags[0], mockTags[1], mockTags[9]],
    isPinned: true,
    createdAt: '2024-11-20T10:30:00Z',
    updatedAt: '2024-11-25T14:00:00Z',
    fileId: 'file-1',
    file: mockFiles[0],
    mimeType: 'application/pdf',
    size: 2457600,
    thumbnailUrl: 'https://placehold.co/200x280/e2e8f0/64748b?text=PDF',
    collections: [{ id: 'col-1', name: 'Work Documents' }],
  },
  {
    id: 'item-2',
    userId: 'user-1',
    type: 'file',
    title: 'System Architecture Diagram',
    description: 'High-level architecture showing microservices, databases, and cloud infrastructure.',
    category: 'Work',
    project: 'Cloud Platform',
    importance: 'high',
    tags: [mockTags[1], mockTags[3]],
    isPinned: true,
    createdAt: '2024-11-18T14:20:00Z',
    updatedAt: '2024-11-18T14:20:00Z',
    fileId: 'file-2',
    file: mockFiles[1],
    mimeType: 'image/png',
    size: 1536000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
    collections: [{ id: 'col-1', name: 'Work Documents' }, { id: 'col-2', name: 'Architecture' }],
  },
  {
    id: 'item-3',
    userId: 'user-1',
    type: 'file',
    title: 'Product Demo Video',
    description: 'Demo video showcasing the main features of our product for stakeholder presentation.',
    category: 'Work',
    project: 'Cloud Platform',
    importance: 'normal',
    tags: [mockTags[2]],
    isPinned: false,
    createdAt: '2024-11-15T09:00:00Z',
    updatedAt: '2024-11-15T09:00:00Z',
    fileId: 'file-3',
    file: mockFiles[2],
    mimeType: 'video/mp4',
    size: 52428800,
    thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
  },
  {
    id: 'item-4',
    userId: 'user-1',
    type: 'file',
    title: 'Meeting Notes - November',
    description: 'Notes from weekly team meetings in November 2024.',
    category: 'Work',
    importance: 'low',
    tags: [],
    isPinned: false,
    createdAt: '2024-11-22T16:45:00Z',
    updatedAt: '2024-11-22T16:45:00Z',
    fileId: 'file-4',
    file: mockFiles[3],
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 45056,
  },

  // === LINK ITEMS ===
  {
    id: 'item-5',
    userId: 'user-1',
    type: 'link',
    title: 'React Documentation',
    description: 'Official React documentation - comprehensive guide for building user interfaces.',
    category: 'Study',
    project: 'Learning React',
    importance: 'high',
    tags: [mockTags[0], mockTags[5], mockTags[8]],
    isPinned: true,
    createdAt: '2024-10-05T11:00:00Z',
    updatedAt: '2024-10-05T11:00:00Z',
    url: 'https://react.dev',
    domain: 'react.dev',
    thumbnailUrl: 'https://react.dev/images/og-home.png',
    collections: [{ id: 'col-3', name: 'Frontend Resources' }],
  },
  {
    id: 'item-6',
    userId: 'user-1',
    type: 'link',
    title: 'TypeScript Handbook',
    description: 'The TypeScript Handbook - learn TypeScript from basics to advanced patterns.',
    category: 'Study',
    project: 'Learning TypeScript',
    importance: 'high',
    tags: [mockTags[0], mockTags[6], mockTags[7]],
    isPinned: false,
    createdAt: '2024-10-10T09:30:00Z',
    updatedAt: '2024-10-10T09:30:00Z',
    url: 'https://www.typescriptlang.org/docs/handbook/',
    domain: 'typescriptlang.org',
    thumbnailUrl: 'https://www.typescriptlang.org/images/branding/og-image-share.png',
    collections: [{ id: 'col-3', name: 'Frontend Resources' }],
  },
  {
    id: 'item-7',
    userId: 'user-1',
    type: 'link',
    title: 'Tailwind CSS Components',
    description: 'Beautiful UI components built with Tailwind CSS for rapid development.',
    category: 'Design',
    importance: 'normal',
    tags: [mockTags[0], mockTags[2]],
    isPinned: false,
    createdAt: '2024-11-01T13:00:00Z',
    updatedAt: '2024-11-01T13:00:00Z',
    url: 'https://tailwindui.com',
    domain: 'tailwindui.com',
  },
  {
    id: 'item-8',
    userId: 'user-1',
    type: 'link',
    title: 'AWS S3 Documentation',
    description: 'Amazon S3 user guide - learn about object storage in the cloud.',
    category: 'Work',
    project: 'Cloud Platform',
    importance: 'normal',
    tags: [mockTags[1], mockTags[3], mockTags[8]],
    isPinned: false,
    createdAt: '2024-09-20T08:00:00Z',
    updatedAt: '2024-09-20T08:00:00Z',
    url: 'https://docs.aws.amazon.com/s3/',
    domain: 'docs.aws.amazon.com',
    collections: [{ id: 'col-4', name: 'Cloud & DevOps' }],
  },
  {
    id: 'item-9',
    userId: 'user-1',
    type: 'link',
    title: 'OpenAI API Reference',
    description: 'Complete API reference for OpenAI GPT models and embeddings.',
    category: 'Study',
    project: 'AI Integration',
    importance: 'high',
    tags: [mockTags[4], mockTags[1]],
    isPinned: true,
    createdAt: '2024-11-10T15:00:00Z',
    updatedAt: '2024-11-10T15:00:00Z',
    url: 'https://platform.openai.com/docs/api-reference',
    domain: 'platform.openai.com',
    collections: [{ id: 'col-5', name: 'AI & ML' }],
  },
  {
    id: 'item-10',
    userId: 'user-1',
    type: 'link',
    title: 'GitHub - shadcn/ui',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS.',
    category: 'Design',
    importance: 'normal',
    tags: [mockTags[0], mockTags[2], mockTags[5]],
    isPinned: false,
    createdAt: '2024-11-05T10:00:00Z',
    updatedAt: '2024-11-05T10:00:00Z',
    url: 'https://github.com/shadcn/ui',
    domain: 'github.com',
  },

  // === NOTE ITEMS ===
  {
    id: 'item-11',
    userId: 'user-1',
    type: 'note',
    title: 'Daily Standup Template',
    description: 'Template for daily standup meetings with the team.',
    category: 'Work',
    importance: 'normal',
    tags: [mockTags[9]],
    isPinned: true,
    createdAt: '2024-11-01T08:00:00Z',
    updatedAt: '2024-11-25T09:00:00Z',
    content: `# Daily Standup Template

## What I did yesterday
- [ ] Task 1
- [ ] Task 2

## What I'm doing today
- [ ] Task 1
- [ ] Task 2

## Blockers
- None

## Notes
- Any additional notes here`,
  },
  {
    id: 'item-12',
    userId: 'user-1',
    type: 'note',
    title: 'React Hooks Cheatsheet',
    description: 'Quick reference for commonly used React hooks with examples.',
    category: 'Study',
    project: 'Learning React',
    importance: 'high',
    tags: [mockTags[0], mockTags[5], mockTags[8]],
    isPinned: false,
    createdAt: '2024-10-15T14:00:00Z',
    updatedAt: '2024-10-15T14:00:00Z',
    content: `# React Hooks Cheatsheet

## useState
\`\`\`tsx
const [count, setCount] = useState(0);
\`\`\`

## useEffect
\`\`\`tsx
useEffect(() => {
  // side effect
  return () => {
    // cleanup
  };
}, [dependencies]);
\`\`\`

## useContext
\`\`\`tsx
const value = useContext(MyContext);
\`\`\`

## useRef
\`\`\`tsx
const ref = useRef(initialValue);
\`\`\``,
    collections: [{ id: 'col-3', name: 'Frontend Resources' }],
  },
  {
    id: 'item-13',
    userId: 'user-1',
    type: 'note',
    title: 'Project Ideas',
    description: 'List of side project ideas to work on.',
    category: 'Personal',
    importance: 'low',
    tags: [],
    isPinned: false,
    createdAt: '2024-08-10T20:00:00Z',
    updatedAt: '2024-11-20T21:00:00Z',
    content: `# Project Ideas

1. **Personal Cloud Storage App**
   - Upload files to R2/S3
   - AI-powered search
   - Link organizer

2. **Expense Tracker**
   - Mobile-first design
   - Charts and analytics

3. **Recipe Manager**
   - Import from URLs
   - Meal planning`,
  },
  {
    id: 'item-14',
    userId: 'user-1',
    type: 'note',
    title: 'API Design Principles',
    description: 'Notes on RESTful API design best practices.',
    category: 'Study',
    importance: 'normal',
    tags: [mockTags[1], mockTags[8]],
    isPinned: false,
    createdAt: '2024-09-05T11:00:00Z',
    updatedAt: '2024-09-05T11:00:00Z',
    content: `# API Design Principles

## Naming Conventions
- Use nouns for resources: /users, /items
- Use HTTP verbs for actions: GET, POST, PUT, DELETE

## Versioning
- Include version in URL: /api/v1/users

## Pagination
- Use query params: ?page=1&pageSize=20

## Error Handling
- Return consistent error format
- Use appropriate HTTP status codes`,
    collections: [{ id: 'col-6', name: 'Backend Knowledge' }],
  },

  // === EDGE CASES ===
  {
    id: 'item-15',
    userId: 'user-1',
    type: 'link',
    title: 'Very Long Title That Should Be Truncated in Card View Because It Exceeds Normal Length',
    description: 'This is a very long description that should also be truncated when displayed in card view. It contains a lot of text to test how the UI handles overflow situations.',
    category: 'Study',
    importance: 'low',
    tags: [mockTags[0], mockTags[1], mockTags[2], mockTags[3], mockTags[4]], // Many tags
    isPinned: false,
    createdAt: '2024-11-28T12:00:00Z',
    updatedAt: '2024-11-28T12:00:00Z',
    url: 'https://example.com/very-long-url-path-that-should-be-handled-properly',
    domain: 'example.com',
  },
  {
    id: 'item-16',
    userId: 'user-1',
    type: 'file',
    title: 'Untitled Document',
    // No description - edge case
    category: 'Work',
    importance: 'low',
    tags: [], // No tags - edge case
    isPinned: false,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z',
    mimeType: 'application/pdf',
    size: 1024,
  },
];

// Collections
export const mockCollections: Collection[] = [
  {
    id: 'col-1',
    userId: 'user-1',
    name: 'Work Documents',
    description: 'Important documents for work projects',
    isPublic: false,
    itemCount: 5,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-11-25T14:00:00Z',
  },
  {
    id: 'col-2',
    userId: 'user-1',
    name: 'Architecture',
    description: 'System architecture diagrams and documentation',
    isPublic: false,
    itemCount: 3,
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2024-11-18T14:20:00Z',
  },
  {
    id: 'col-3',
    userId: 'user-1',
    name: 'Frontend Resources',
    description: 'React, TypeScript, CSS, and frontend development resources',
    isPublic: true,
    slugPublic: 'frontend-resources',
    itemCount: 8,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-11-10T11:00:00Z',
  },
  {
    id: 'col-4',
    userId: 'user-1',
    name: 'Cloud & DevOps',
    description: 'AWS, Docker, Kubernetes, and infrastructure resources',
    isPublic: true,
    slugPublic: 'cloud-devops',
    itemCount: 6,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop',
    createdAt: '2024-04-20T14:00:00Z',
    updatedAt: '2024-09-20T08:00:00Z',
  },
  {
    id: 'col-5',
    userId: 'user-1',
    name: 'AI & ML',
    description: 'Artificial Intelligence and Machine Learning resources',
    isPublic: false,
    itemCount: 4,
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-11-10T15:00:00Z',
  },
  {
    id: 'col-6',
    userId: 'user-1',
    name: 'Backend Knowledge',
    description: 'API design, databases, and server-side development',
    isPublic: true,
    slugPublic: 'backend-knowledge',
    itemCount: 5,
    createdAt: '2024-05-10T11:00:00Z',
    updatedAt: '2024-09-05T11:00:00Z',
  },
];

// Shared Links
export const mockSharedLinks: SharedLink[] = [
  {
    id: 'share-1',
    userId: 'user-1',
    itemId: 'item-1',
    item: mockItems[0],
    token: 'abc123xyz',
    hasPassword: false,
    expiresAt: '2024-12-31T23:59:59Z',
    createdAt: '2024-11-20T10:30:00Z',
    isRevoked: false,
    accessCount: 15,
  },
  {
    id: 'share-2',
    userId: 'user-1',
    itemId: 'item-2',
    item: mockItems[1],
    token: 'def456uvw',
    hasPassword: true,
    expiresAt: '2024-12-15T23:59:59Z',
    createdAt: '2024-11-18T14:20:00Z',
    isRevoked: false,
    accessCount: 8,
  },
  {
    id: 'share-3',
    userId: 'user-1',
    itemId: 'item-5',
    item: mockItems[4],
    token: 'ghi789rst',
    hasPassword: false,
    expiresAt: '2024-11-01T23:59:59Z', // Expired
    createdAt: '2024-10-01T09:00:00Z',
    isRevoked: false,
    accessCount: 42,
  },
  {
    id: 'share-4',
    userId: 'user-1',
    itemId: 'item-3',
    item: mockItems[2],
    token: 'jkl012mno',
    hasPassword: false,
    expiresAt: '2024-12-20T23:59:59Z',
    createdAt: '2024-11-15T09:00:00Z',
    isRevoked: true, // Revoked
    accessCount: 3,
  },
];

// Helper to simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
