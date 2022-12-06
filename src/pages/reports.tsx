import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import Dashboard from "../components/layouts/Dashboard";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { NextPageWithLayout } from "./_app";
import { Chart as ChartJS, ArcElement, LineElement, Tooltip, Legend, LinearScale, CategoryScale, BarElement, Filler, PointElement, Title } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import Table from "../components/Table";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ReactNode, useEffect, useState } from "react";
import dayjs from 'dayjs';
import Loader from "../components/Loader";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    LineElement,
    BarElement,
    PointElement,
    Title,
    Tooltip,
    Filler,
    Legend,
);
const barChartLabels: any[] = [];
const lineChartLabels = new Array(dayjs().daysInMonth()).fill('').map((v, i) => i + 1)
const lineChartOptions = {
    responsive: true,
    scales: {
        y: {
            ticks: {
                // Include a dollar sign in the ticks
                callback: function (value: any, index: any, ticks: any) {
                    return '$' + value;
                }
            }
        }
    }
};
const lineCharData: { labels: any[]; datasets: any[] } = {
    labels: lineChartLabels,
    datasets: [
        {
            label: 'Dinero',
            data: [],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ],
}

const barChartData: { labels: any[]; datasets: any[] } = {
    labels: barChartLabels,
    datasets: [{
        label: 'Papanata',
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
        data: [],
    }],
};

type Customer = {
    fullName: string;
    phoneNumber: string;
    createdAt: Date;
}


const customerDefaultColumns: ColumnDef<Customer>[] = [
    {
        header: () => <span className="mr-2">Nombre completo</span>,
        cell: (info) => <span className="mr-2">{info.getValue() as ReactNode}</span>,
        accessorKey: 'fullName',
    },
    {
        header: () => <span className="mx-2">Número de Teléfono</span>,
        cell: (info) => <span className="mx-2">{info.getValue() as ReactNode}</span>,
        accessorKey: 'phoneNumber',
    },
    {
        header: () => <span className="mx-2">Capturado en</span>,
        cell: (info) => <span className="mx-2">{String(dayjs(info.getValue() as Date).format('DD/MM/YY')) as ReactNode}</span>,
        accessorKey: 'createdAt',
    },
]


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Reports: NextPageWithLayout = () => {
    const { data } = useSession();
    const userQuery = trpc.useQuery(["userRouter.getVenues", { id: data?.user?.id }]);
    const salesByProductQuery = trpc.useQuery(["reportRouter.sellsByProduct", { venueId: userQuery?.data?.venueId }]);
    const moneyPerDayQuery = trpc.useQuery(["reportRouter.moneyPerDay", { venueId: userQuery?.data?.venueId }]);
    const customerQuery = trpc.useQuery(["reportRouter.customersByVenueId", { venueId: userQuery.data?.venueId }]);
    const [customerColumns] = useState(() => [...customerDefaultColumns]);
    const [customers, setCustomers] = useState(() => customerQuery.data ? [...customerQuery.data] : []);
    const [currentNav, setCurrentNav] = useState('Ventas')
    const chartNavigation = [
        { name: 'Ventas', current: currentNav === 'Ventas' },
        { name: 'Ordenes', current: currentNav === 'Ordenes' },
    ]
    useEffect(() => {
        if (customerQuery.data) {
            setCustomers(customerQuery.data);
        }
    }, [customerQuery.data])
    useEffect(() => {
        if (moneyPerDayQuery.data) {
            console.log('lineCharData', lineCharData);
            for (const day of lineChartLabels) {
                if (moneyPerDayQuery.data[day]) {
                    const finalPrice = moneyPerDayQuery.data[day].reduce((acc: number, value: { finalPrice: number, amount: number }) => ((value.finalPrice * value.amount) + acc), 0)
                    console.log(`${finalPrice}`, finalPrice);
                    lineCharData.datasets[0].data.push(finalPrice)
                } else {
                    lineCharData.datasets[0].data.push(0)
                }
            }
        }
    }, [moneyPerDayQuery.data])
    const customersTable = useReactTable({
        data: customers,
        columns: customerColumns,
        getCoreRowModel: getCoreRowModel(),
    })
    if (salesByProductQuery.isLoading || salesByProductQuery.isLoading || moneyPerDayQuery.isLoading) return <Loader />;
    if (!barChartData.datasets[0].data.length) {
        salesByProductQuery.data?.forEach((saleByProduct) => {
            barChartLabels.push(saleByProduct?.product?.name);
            barChartData.datasets[0].data.push(saleByProduct.productStoreCart._count.productStoreId)
        })
    }


    return (
        <>
            <Head>
                <title>Wapi - Reportes</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="mt-3 flex px-2" >
                {chartNavigation.map((item, index) => (
                    <div key={item.name}>
                        <div onClick={() => { setCurrentNav(item.name) }} className={`cursor-pointer ${classNames(
                            item.current
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'px-3 py-2 rounded-md text-sm font-medium'
                        )}`}>
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex w-full">
                <div className="w-full">
                    {
                        currentNav === 'Ordenes' ? (
                            <>
                                <h2 className="text-2xl mb-4">Ventas x Producto</h2>
                                <Bar data={barChartData} />
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl mb-4">Facturación x Día</h2>
                                <Line data={lineCharData} options={lineChartOptions} />
                            </>
                        )
                    }
                    {/* <h2 className="text-2xl mb-4">Facturación x Día</h2>
                    <Line data={lineCharData} options={lineChartOptions} />; */}
                </div>
            </div>
            <div className="flex justify-around w-full">
                <div>
                    <h2 className="text-2xl mb-4">Clientes</h2>
                    <Table table={customersTable} className='border border-1 border-black p-6' />
                </div>
                {/* <div>
                    <h2 className="text-2xl mb-4">Ventas x Producto</h2>
                    <Bar data={barChartData} />
                </div> */}
            </div>
        </>
    );
};

Reports.getLayout = function getLayout(page) {
    return (
        <Dashboard>
            {page}
        </Dashboard>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    if (!session) {
        return {
            redirect: { destination: "/api/auth/signin", permanent: false },
        }
    }

    return {
        props: session
    }
}

export default Reports;