import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout';
import {
  AuthLayout,
  LoginForm,
  RegisterForm,
  VerifyOtpForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  ProtectedRoute,
} from '@/components/auth';
import { LibraryPage } from '@/routes/library/LibraryPage';
import { CollectionsPage } from '@/routes/collections/CollectionsPage';
import { CollectionDetailPage } from '@/routes/collections/CollectionDetailPage';
import { FilesPage } from '@/routes/files/FilesPage';
import { LinksPage } from '@/routes/links/LinksPage';
import { NotesPage } from '@/routes/notes/NotesPage';
import { SharedLinksPage } from '@/routes/shared-links/SharedLinksPage';
import { TrashPage } from '@/routes/trash/TrashPage';
import { SettingsPage } from '@/routes/settings/SettingsPage';
import { PublicLibraryPage } from '@/routes/public/PublicLibraryPage';
import { PublicCollectionPage } from '@/routes/public/PublicCollectionPage';
import { SharedItemPage } from '@/routes/shared/SharedItemPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route index element={<Navigate to="/app/library" replace />} />

        {/* Auth routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="/auth/login" replace />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="verify-otp" element={<VerifyOtpForm />} />
          <Route path="forgot-password" element={<ForgotPasswordForm />} />
          <Route path="reset-password" element={<ResetPasswordForm />} />
        </Route>

        {/* Protected app routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/library" replace />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="collections/:id" element={<CollectionDetailPage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="links" element={<LinksPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="shared-links" element={<SharedLinksPage />} />
          <Route path="trash" element={<TrashPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Public routes (no auth required) */}
        <Route path="/public" element={<PublicLibraryPage />} />
        <Route path="/public/:slug" element={<PublicCollectionPage />} />
        <Route path="/s/:token" element={<SharedItemPage />} />

        {/* Catch all - redirect to app */}
        <Route path="*" element={<Navigate to="/app/library" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

