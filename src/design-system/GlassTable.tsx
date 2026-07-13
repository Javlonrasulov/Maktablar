import { flexRender, type Table as TanTable } from '@tanstack/react-table'
import { cn } from '@/lib/utils'

interface GlassTableProps<T> {
  table: TanTable<T>
  className?: string
}

export function GlassTable<T>({ table, className }: GlassTableProps<T>) {
  return (
    <div className={cn('glass overflow-hidden rounded-[22px]', className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-white/10 bg-white/5">
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
                className="border-b border-white/5 transition hover:bg-white/5"
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
