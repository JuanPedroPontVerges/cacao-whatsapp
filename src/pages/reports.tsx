import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Head from "next/head";
import Dashboard from "../components/layouts/Dashboard";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { NextPageWithLayout } from "./_app";
import { Chart as ChartJS, ArcElement, LineElement, Tooltip, Legend, LinearScale, CategoryScale, BarElement, Filler, PointElement, Title } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import Table from "../components/Table";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ReactNode, useEffect, useState } from "react";
import dayjs from 'dayjs';
import Loader from "../components/Loader";
import ReportCard from "../components/ReportCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
const pieChartLabels: any[] = [];

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

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

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

const getDaysArray = (start: Date, end: Date) => {
    let arr = [];
    let dt = new Date(start);
    for (arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
        arr.push(dayjs(dt).format('DD-MM'));
    }
    return arr;
};

const Reports: NextPageWithLayout = () => {
    const { data } = useSession();
    const userQuery = trpc.useQuery(["userRouter.getVenues", { id: data?.user?.id }]);
    const customerQuery = trpc.useQuery(["reportRouter.customersByVenueId", { venueId: userQuery.data?.venueId }]);
    const [customerColumns] = useState(() => [...customerDefaultColumns]);
    const [customers, setCustomers] = useState(() => customerQuery.data ? [...customerQuery.data] : []);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([dayjs().set('days', -7).toDate(), new Date()]);
    const [startDate, endDate] = dateRange;
    const [currentNav, setCurrentNav] = useState('Ventas')
    const totalSalesQuery = trpc.useQuery(["reportRouter.totalSales", { venueId: userQuery.data?.venueId, startDate, endDate }]);
    const amountOfOperationsQuery = trpc.useQuery(["reportRouter.amountOfOperations", { venueId: userQuery.data?.venueId, startDate, endDate }]);
    const averageSalesPerDayQuery = trpc.useQuery(["reportRouter.averageSalesPerDay", { venueId: userQuery.data?.venueId, startDate, endDate }]);
    const moneyPerDayQuery = trpc.useQuery(["reportRouter.moneyPerDay", { venueId: userQuery?.data?.venueId, startDate, endDate }]);
    const salesByProductQuery = trpc.useQuery(["reportRouter.sellsByProduct", { venueId: userQuery?.data?.venueId, startDate, endDate }]);
    const paymentTypesQuery = trpc.useQuery(["reportRouter.paymentTypes", { venueId: userQuery?.data?.venueId, startDate, endDate }]);

    const chartNavigation = [
        { name: 'Ventas', current: currentNav === 'Ventas' },
        { name: 'Ordenes', current: currentNav === 'Ordenes' },
    ]
    // Chart data
    const lineCharData: { labels: any[]; datasets: any[] } = {
        labels: getDaysArray(startDate || new Date(), endDate || new Date()),
        datasets: [
            {
                label: 'Dinero',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    }
    // Barchart data
    const barChartData: { labels: any[]; datasets: any[] } = {
        labels: barChartLabels,
        datasets: [
            {
                label: 'Cantidad',
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
            }
        ],
    };
    // PieChart data
    const pieChartData: { labels?: any[] | undefined; datasets: any[] } = {
        labels: pieChartLabels,
        datasets: [
            {
                label: '# of Votes',
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
                data: []
            },
        ],
    };

    useEffect(() => {
        if (customerQuery.data) {
            setCustomers(customerQuery.data);
        }
    }, [customerQuery.data])

    // Is this good?  👇🏽👇🏽
    do {
        if (moneyPerDayQuery.data) {
            for (const day of lineCharData.labels) {
                if (moneyPerDayQuery.data[day]) {
                    const finalPrice = moneyPerDayQuery.data[day].reduce((acc: number, value: { finalPrice: number, amount: number }) => ((value.finalPrice * value.amount) + acc), 0)
                    lineCharData.datasets[0].data.push(finalPrice)
                } else {
                    lineCharData.datasets[0].data.push(0)
                }
            }
        }
    }
    while (!lineCharData.datasets[0].data);

    // const customersTable = useReactTable({
    //     data: customers,
    //     columns: customerColumns,
    //     getCoreRowModel: getCoreRowModel(),
    // })

    if (!barChartData.datasets[0].data.length) {
        salesByProductQuery.data?.forEach((saleByProduct) => {
            if (!barChartLabels.some((label) => label === saleByProduct?.product?.name)) {
                barChartLabels.push(saleByProduct?.product?.name);
            }
            barChartData.datasets[0].data.push(saleByProduct.productStoreCart._count.productStoreId)
        })
    }

    if (!pieChartData.datasets[0].data.length) {
        paymentTypesQuery.data?.forEach((paymentType) => {
            if (!pieChartLabels.some((label) => label === paymentType?.paymentTypeFound?.name)) {
                pieChartLabels.push(paymentType?.paymentTypeFound?.name);
            }
            pieChartData.datasets[0].data.push(paymentType._count)
        })
    }

    const totalSales = totalSalesQuery.data?.reduce((acc: number, value: { finalPrice: number, amount: number }) => ((value.finalPrice * value.amount) + acc), 0)
    return (
        <>
            <Head>
                <title>Wapi - Reportes</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container mx-auto mt-[-26px]'>
                <section className='mb-6'>
                    <div className="flex justify-center mb-4">
                        <div className="mt-3 flex p-4 border border-1 justify-around">
                            {chartNavigation.map((item) => (
                                <div key={item.name} className='mx-4'>
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
                    </div>
                    <div className="flex justify-center">
                        <div>
                            <h4>Rango de fechas: </h4>
                            <DatePicker
                                className="mt-2"
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    setDateRange(update)
                                }}
                            />
                        </div>
                    </div>
                </section>
                {
                    currentNav === 'Ordenes' ? (
                        <>
                            <div className='flex gap-4'>
                                <div className="basis-2/3">
                                    <h2 className="text-2xl mb-4">Ventas x Producto</h2>
                                    {
                                        barChartData.datasets[0].data.length > 0 ? (
                                            <Bar data={barChartData} />
                                        ) : (
                                            salesByProductQuery.isLoading ? (
                                                <div className="flex items-center justify-center h-64 border-2 rounded">
                                                    <h4 className="text-xl font-medium">
                                                        Cargando... ⏱️
                                                    </h4>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-64 border-2 rounded">
                                                    <h4 className="text-xl font-medium">
                                                        No tenemos datos para mostrarte 😢
                                                    </h4>
                                                </div>
                                            )
                                        )
                                    }
                                </div>
                                <div className="basis-1/3">
                                    <h2 className="text-2xl mb-4">Medios de pago</h2>
                                    {
                                        pieChartData.datasets[0].data.length > 0 ? (
                                            <Pie data={pieChartData} />
                                        ) : (
                                            paymentTypesQuery.isLoading ? (
                                                <div className="flex items-center justify-center h-64 border-2 rounded">
                                                    <h4 className="text-xl font-medium">
                                                        Cargando... ⏱️
                                                    </h4>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-64 border-2 rounded">
                                                    <h4 className="text-xl font-medium">
                                                        No tenemos datos para mostrarte 😢
                                                    </h4>
                                                </div>
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='flex gap-4'>
                                <div className='flex flex-col basis-1/2'>
                                    <div className='w-full'>
                                        <ReportCard title={'Total de ventas'} value={totalSalesQuery.isLoading ? <Loader /> : (`$ ${totalSales?.toString() || '0'}`)} />
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className='w-full'>
                                            <ReportCard title={'Cantidad de operaciones'} value={amountOfOperationsQuery.isLoading ? <Loader /> : (amountOfOperationsQuery.data?.toString() || '0')} />
                                        </div>
                                        <div className="w-full">
                                            <ReportCard title={'Venta promedio'} value={averageSalesPerDayQuery.isLoading ? <Loader /> : (`$ ${averageSalesPerDayQuery.data?._avg?.total?.toString() || '0'}`)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="basis-1/2">
                                    <div className="flex w-full">
                                        <div className="w-full">
                                            <h2 className="text-2xl mb-4">Facturación x Día</h2>
                                            {
                                                lineCharData.datasets[0].data.length > 0 ? (
                                                    <Line data={lineCharData} options={lineChartOptions} />
                                                ) : (
                                                    moneyPerDayQuery.isLoading ? (
                                                        <div className="flex items-center justify-center h-64 border-2 rounded">
                                                            <h4 className="text-xl font-medium">
                                                                Cargando... ⏱️
                                                            </h4>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center h-64 border-2 rounded">
                                                            <h4 className="text-xl font-medium">
                                                                No tenemos datos para mostrarte 😢
                                                            </h4>
                                                        </div>
                                                    )
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
                {/* <div className="flex justify-around w-full">
                    <div>
                        <h2 className="text-2xl mb-4">Clientes</h2>
                        <Table table={customersTable} className='border border-1 border-black p-6' />
                    </div>
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