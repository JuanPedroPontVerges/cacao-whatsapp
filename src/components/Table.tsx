import { flexRender, RowData, Table } from "@tanstack/react-table";
import React from "react"
import DraggableRow from "./DraggableRow";
interface TableProps {
    reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void
    table: Table<any>;
    className?: string;
    onClick?: () => void;
}

const Table: React.FC<TableProps> = ({ table, reorderRow }) => {
    return (
        <div className="flex">
            <table className="w-full text-left">
                <thead>
                    {table.getHeaderGroups().map((headerGroup: any) => (
                        <tr key={headerGroup.id}>
                            <th />
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
                    {table.getRowModel().rows.map((row: any) => (
                        <DraggableRow row={row} reorderRow={reorderRow} key={row.id} />
                    ))}
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