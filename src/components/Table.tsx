import React from "react"
interface TableProps {
    className?: string;
    isCategoryOrOptionGroup: {
        id: string;
        name: string;
    } | undefined
    columns: {
        title: string;
        dataIndex: string;
    }[]
    // dataSource: Record<string, string>[]
}

const Table: React.FC<TableProps> = ({ className, isCategoryOrOptionGroup, columns }) => {
    return (
        <table className="min-w-full table-auto">
            <thead className="border-b">
                <tr>
                    {
                        columns.map(({ title, dataIndex }) => {
                            return (
                                <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left" key={dataIndex}>
                                    {title}
                                </th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                <tr className="border-b">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1</td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        Mark
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        Otto
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        @mdo
                    </td>
                </tr>
                <tr className="bg-white border-b">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2</td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        Jacob
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        Thornton
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        @fat
                    </td>
                </tr>
                <tr className="bg-white border-b">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">3</td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        Larry
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        Wild
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        @twitter
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default Table;