import { Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/common';

export const TrashPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Trash</h1>
        <p className="text-muted mt-1">Items in trash will be permanently deleted after 30 days</p>
      </div>
      
      <EmptyState
        icon={<Trash2 className="w-full h-full" />}
        title="Trash is empty"
        description="Items you delete will appear here for 30 days before being permanently removed."
      />
    </div>
  );
};
