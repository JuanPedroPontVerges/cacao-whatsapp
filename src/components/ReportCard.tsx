import React, { ReactElement } from 'react';
interface ReportCardProps {
    title: string;
    value: string | ReactElement;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, value }) => {
    return (
        <div className='flex flex-col justify-center items-center border border-1 h-28 p-4'>
            <p className='text-3xl'>{value}</p>
            <p className='mt-2'>{title}</p>
        </div>
    )
}


export default ReportCard