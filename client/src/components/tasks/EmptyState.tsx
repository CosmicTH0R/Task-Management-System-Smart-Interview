import { ClipboardList, SearchX } from 'lucide-react';

interface EmptyStateProps {
  type?: 'empty' | 'noResults';
}

export default function EmptyState({ type = 'empty' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {type === 'noResults' ? (
        <SearchX className="mb-4 h-12 w-12 text-muted-foreground/50" />
      ) : (
        <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground/50" />
      )}
      <h3 className="text-lg font-semibold">
        {type === 'noResults' ? 'No results found' : 'No tasks yet'}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {type === 'noResults'
          ? 'Try adjusting your filters or search query.'
          : 'Create a task to get started.'}
      </p>
    </div>
  );
}
