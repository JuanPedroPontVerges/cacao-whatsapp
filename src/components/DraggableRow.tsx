import { HandRaisedIcon } from "@heroicons/react/24/outline"
import { flexRender, Row } from "@tanstack/react-table"
import { useDrag, useDrop } from "react-dnd"
const DraggableRow: React.FC<{
    row: Row<any>
    reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void
}> = ({ row, reorderRow }) => {
    const [, dropRef] = useDrop({
        accept: 'row',
        drop: (draggedRow: Row<any>) => reorderRow(draggedRow.index, row.index),
    })

    const [{ isDragging }, dragRef, previewRef] = useDrag({
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
        item: () => row,
        type: 'row',
    })

    return (
        <tr
            ref={previewRef} //previewRef could go here
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <td ref={dropRef}>
                <button ref={dragRef} className={'cursor-grab mx-4'}>
                    <HandRaisedIcon className="h-5 w-5" />
                </button>
            </td>
            {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    )
}

export default DraggableRow;