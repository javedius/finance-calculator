import { ReactNode } from 'react'

interface Column {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  className?: string
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, any>[]
  className?: string
  title?: string
}

export default function DataTable({ 
  columns, 
  data, 
  className = '',
  title 
}: DataTableProps) {
  const getCellClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'table-cell-center'
      case 'right':
        return 'table-cell-right'
      default:
        return 'table-cell'
    }
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="table">
        <thead className="table-header">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key}
                className={getCellClass(column.align)}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.map((row, index) => (
            <tr key={index} className="table-row">
              {columns.map((column) => (
                <td 
                  key={column.key}
                  className={`${getCellClass(column.align)} ${column.className || ''}`}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
