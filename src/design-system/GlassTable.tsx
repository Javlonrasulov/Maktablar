import { flexRender, type Table as TanTable } from '@tanstack/react-table'
import { cn } from '@/lib/utils'

interface GlassTableProps<T> {
  table: TanTable<T>
  className?: string
  onRowClick?: (row: T) => void
}

export function GlassTable<T>({ table, className, onRowClick }: GlassTableProps<T>) {
  return (
    <div className={cn('glass overflow-hidden rounded-[22px]', className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-line bg-fill">
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-medium text-text-secondary">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-line transition hover:bg-fill',
                  onRowClick && 'cursor-pointer',
                )}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-text-primary">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
