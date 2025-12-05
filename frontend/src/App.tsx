import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout';
import { LibraryPage } from '@/routes/library/LibraryPage';
import { CollectionsPage } from '@/routes/collections/CollectionsPage';
import { CollectionDetailPage } from '@/routes/collections/CollectionDetailPage';
import { FilesPage } from '@/routes/files/FilesPage';
import { LinksPage } from '@/routes/links/LinksPage';
import { NotesPage } from '@/routes/notes/NotesPage';
import { SharedLinksPage } from '@/routes/shared-links/SharedLinksPage';
import { TrashPage } from '@/routes/trash/TrashPage';
import { PublicLibraryPage } from '@/routes/public/PublicLibraryPage';
import { PublicCollectionPage } from '@/routes/public/PublicCollectionPage';
import { SharedItemPage } from '@/routes/shared/SharedItemPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main app routes with AppShell */}
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/library" replace />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:id" element={<CollectionDetailPage />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/links" element={<LinksPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/shared-links" element={<SharedLinksPage />} />
          <Route path="/trash" element={<TrashPage />} />
        </Route>

        {/* Public routes (no AppShell) */}
        <Route path="/public" element={<PublicLibraryPage />} />
        <Route path="/public/:slug" element={<PublicCollectionPage />} />
        <Route path="/s/:token" element={<SharedItemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
