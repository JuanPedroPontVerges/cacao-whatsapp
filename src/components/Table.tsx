import { flexRender, RowData, Table } from "@tanstack/react-table";
import React from "react"
import DraggableRow from "./DraggableRow";
interface TableProps {
    reorderRow?: (draggedRowIndex: number, targetRowIndex: number) => void
    table: Table<any>;
    className?: string;
    onClick?: () => void;
}

const Table: React.FC<TableProps> = ({ table, reorderRow, className }) => {
    return (
        <div className="flex">
            <table className={`w-full text-left ${className}`}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup: any) => (
                        <tr key={headerGroup.id}>
                            {reorderRow ? (<th />) : null}
                            {headerGroup.headers.map((header: any) => (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {reorderRow ? (
                        table.getRowModel().rows.map((row: any) => (
                            <DraggableRow row={row} reorderRow={reorderRow} key={row.id} />
                        ))
                    ) : (
                        table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
                <tfoot>
                    {table.getFooterGroups().map(footerGroup => (
                        <tr key={footerGroup.id}>
                            {footerGroup.headers.map(header => (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.footer,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </table>
        </div>
    )
}

export default Table;