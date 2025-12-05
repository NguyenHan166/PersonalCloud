src/
  main.tsx              # entry Vite
  App.tsx               # định nghĩa Routes + AppShell

  routes/               # các page theo route chính
    library/
      LibraryPage.tsx
    files/
      FilesPage.tsx
    collections/
      CollectionsPage.tsx
      CollectionDetailPage.tsx
    shared-links/
      SharedLinksPage.tsx
    links/
      LinksPage.tsx      # có thể stub
    notes/
      NotesPage.tsx      # có thể stub
    trash/
      TrashPage.tsx      # stub

  components/
    layout/
      AppShell.tsx       # chứa Sidebar + Header + Outlet
      Sidebar.tsx
      Header.tsx

    common/
      Button.tsx
      Input.tsx
      Textarea.tsx
      Select.tsx
      Badge.tsx
      Avatar.tsx
      Modal.tsx
      Tabs.tsx
      Spinner.tsx
      IconButton.tsx
      EmptyState.tsx

    library/
      ItemCard.tsx
      ItemListRow.tsx
      ItemGrid.tsx
      ItemList.tsx
      ItemFiltersBar.tsx
      ItemDetailPanel.tsx

    files/
      FileCard.tsx
      FileGrid.tsx
      FilePreviewModal.tsx
      FileFiltersBar.tsx
      StorageUsageBar.tsx

    collections/
      CollectionCard.tsx
      CollectionList.tsx
      CollectionDetailHeader.tsx

    sharedLinks/
      SharedLinksTable.tsx
      CreateShareLinkDialog.tsx

    upload/
      UploadDialog.tsx
      Dropzone.tsx

    search/
      GlobalSearchBar.tsx
      SearchModeToggle.tsx   # Keyword vs AI

    ai/
      AiSummaryBox.tsx
      AiTagSuggestions.tsx

  api/
    client.ts             # axios/fetch wrapper
    libraryApi.ts
    filesApi.ts
    collectionsApi.ts
    sharedLinksApi.ts
    aiApi.ts

  types/
    domain.ts             # User, Item, FileMeta, Tag, Collection, SharedLink...
    api.ts                # DTOs như ListItemsParams, CreateItemPayload v.v.

  hooks/
    useItems.ts           # wrap listItems, cache state, loading/error
    useItemDetail.ts
    useFiles.ts
    useCollections.ts
    useSharedLinks.ts
    useUpload.ts
    useToast.ts

  store/
    uiStore.ts            # Zustand (nếu dùng) cho UI global: sidebar collapse, theme…
    filtersStore.ts       # (optional) lưu filters library

  context/
    ToastProvider.tsx
    ThemeProvider.tsx     # optional

  utils/
    formatDate.ts
    formatFileSize.ts
    mime.ts                # phân loại file: image/video/pdf/other
    copyToClipboard.ts
    classNames.ts          # helper merge class tailwind

  styles/
    index.css              # import tailwind base/components/utilities
    tailwind.css           # nếu bạn tách riêng
