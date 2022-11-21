import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Dashboard from "../components/layouts/Dashboard";
import Form from "../components/Form";
import GoogleAutoComplete from "../components/GoogleAutoComplete";
import Modal from "../components/Modal";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { trpc } from "../utils/trpc";
import { NextPageWithLayout } from "./_app";
import Loader from "../components/Loader";
import { isOpen } from "./api/whatsapp/utils";
import exceljs from 'exceljs';
import dayjs from "dayjs";

export type DaysType = 'monday' | 'tuesday' | 'wendsday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

const days: { label: string; day: DaysType }[] = [
  { label: 'Lunes', day: 'monday' },
  { label: 'Martes', day: 'tuesday' },
  { label: 'Miércoles', day: 'wendsday' },
  { label: 'Jueves', day: 'thursday' },
  { label: 'Viernes', day: 'friday' },
  { label: 'Sabado', day: 'saturday' },
  { label: 'Domingo', day: 'sunday' }
];

export interface ICreateVenueFormValues {
  name: string;
  address: string;
  googlePlaceId: string;
}

export type CreateSettingsFormValue = {
  monday: {
    from: string;
    to: string;
  }
  tuesday: {
    from: string;
    to: string;
  }
  wendsday: {
    from: string;
    to: string;
  }
  thursday: {
    from: string;
    to: string;
  }
  friday: {
    from: string;
    to: string;
  }
  saturday: {
    from: string;
    to: string;
  }
  sunday: {
    from: string;
    to: string;
  }
  minPurchaseAmount: number
}
const Index: NextPageWithLayout = ({ providers, csrfToken }) => {
  const form = useForm<ICreateVenueFormValues>();
  const settingsForm = useForm<CreateSettingsFormValue>();
  const { data } = useSession();
  const userQuery = trpc.useQuery(["userRouter.getVenues", { id: data?.user?.id }]);
  const ordersQuery = trpc.useQuery(["reportRouter.weeklyFinishedOrders", { venueId: userQuery.data?.venueId }]);
  const venueMutation = trpc.useMutation(["venueRouter.create"]);
  const menuSettingMutation = trpc.useMutation(["menuSettingRouter.create"]);
  const scheduleMutation = trpc.useMutation(["scheduleRouter.create"]);

  const [isCreateVenueModalOpen, setIsCreateVenueModalOpen] = useState(false)

  const toggleVisibility = () => {
    setIsCreateVenueModalOpen(!isCreateVenueModalOpen);
  }

  useEffect(() => {
    if (userQuery.data?.venue?.menus?.[0]?.setting?.schedules) {
      settingsForm.setValue('minPurchaseAmount', userQuery.data.venue.menus?.[0].setting.minPurchaseAmount || 0)
      for (const schedule of userQuery.data?.venue?.menus?.[0]?.setting?.schedules) {
        const day = schedule?.day as DaysType;
        settingsForm.setValue(`${day}.from`, `${schedule.fromHour}:${schedule.fromMinute}`)
        settingsForm.setValue(`${day}.to`, `${schedule.toHour}:${schedule.toMinute}`)
      }
    }

  }, [userQuery.data])

  const onSubmitForm: SubmitHandler<ICreateVenueFormValues> = async (input) => {
    console.log('input', input);
    if (data?.user?.id) {
      venueMutation.mutateAsync({ ...input, userId: data?.user.id })
      toggleVisibility();
    }
    return;
  }

  const onSubmitSettingsForm: SubmitHandler<CreateSettingsFormValue> = async (input) => {
    /** TODO
     * [] Validar que el from sea menor que el to con alguna función de dayjs
     */
    const { monday, tuesday, wendsday, thursday, friday, saturday, sunday, minPurchaseAmount } = input;
    const mondayInput = {
      fromHour: monday.from.split(':')[0],
      fromMinute: monday.from.split(':')[1] || '',
      toHour: monday.to.split(':')[0],
      toMinute: monday.to.split(':')[1] || '',
    }
    const tuesdayInput = {
      fromHour: tuesday.from.split(':')[0],
      fromMinute: tuesday.from.split(':')[1] || '',
      toHour: tuesday.to.split(':')[0],
      toMinute: tuesday.to.split(':')[1] || '',
    }
    const wendsdayInput = {
      fromHour: wendsday.from.split(':')[0],
      fromMinute: wendsday.from.split(':')[1] || '',
      toHour: wendsday.to.split(':')[0],
      toMinute: wendsday.to.split(':')[1] || '',
    }
    const thursdayInput = {
      fromHour: thursday.from.split(':')[0],
      fromMinute: thursday.from.split(':')[1] || '',
      toHour: thursday.to.split(':')[0],
      toMinute: thursday.to.split(':')[1] || '',
    }
    const fridayInput = {
      fromHour: friday.from.split(':')[0],
      fromMinute: friday.from.split(':')[1] || '',
      toHour: friday.to.split(':')[0],
      toMinute: friday.to.split(':')[1] || '',
    }
    const saturdayInput = {
      fromHour: saturday.from.split(':')[0],
      fromMinute: saturday.from.split(':')[1] || '',
      toHour: saturday.to.split(':')[0],
      toMinute: saturday.to.split(':')[1] || '',
    }
    const sundayInput = {
      fromHour: sunday.from.split(':')[0],
      fromMinute: sunday.from.split(':')[1] || '',
      toHour: sunday.to.split(':')[0],
      toMinute: sunday.to.split(':')[1] || '',
    }

    await menuSettingMutation.mutateAsync({
      id: userQuery.data?.venue?.menus[0]?.menuSettingId || undefined,
      minPurchaseAmount: minPurchaseAmount || 0,
    })

    for (const { day } of days) {
      const currentDay =
        day === 'monday' ? mondayInput
          : day === 'tuesday' ? tuesdayInput
            : day === 'wendsday' ? wendsdayInput
              : day === 'thursday' ? thursdayInput
                : day === 'friday' ? fridayInput
                  : day === 'saturday' ? saturdayInput
                    : sundayInput
      await scheduleMutation.mutateAsync({ day, menuSettingId: userQuery.data?.venue?.menus[0]?.menuSettingId || '123', [day]: currentDay })
    }
    userQuery.refetch()
  }

  useEffect(() => {
    if (userQuery.data) {
      const userHasVenue = userQuery.data.venue ? true : false;
      setIsCreateVenueModalOpen(!userHasVenue);
    }
  }, [userQuery.data])

  if (!userQuery.data) {
    return (
      <div>Loading... </div>
    )
  }

  const handleOnClickDownloadReport = async () => {
    try {
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Ordenes de la semana');
      const orderColumns = [
        { key: 'customerFullName', header: 'Nombre Completo' },
        { key: 'customerPhoneNumber', header: 'Número de Teléfono' },
        { key: 'total', header: 'Total' },
        { key: 'mercadoPagoPaymentId', header: 'Mercadopago ID' },
        { key: 'createdAt', header: 'Fecha' },
      ];
      worksheet.columns = orderColumns
      if (userQuery?.data?.venueId) {
        if (ordersQuery.data) {
          for (const { customer, payment, createdAt, Cart } of ordersQuery?.data) {
            const total = Cart?.productStoreCarts.reduce((acc: any, value: any) => ((value.finalPrice * value.amount) + acc), 0)
            worksheet.addRow({
              customerFullName: customer.fullName,
              customerPhoneNumber: customer.phoneNumber,
              total,
              mercadoPagoPaymentId: payment?.mercadoPagoPaymentId,
              createdAt
            })
          }
          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer],
            { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = `Reporte semanal WAPI.xls`;
          anchor.click();
          window.URL.revokeObjectURL(url);
        } else {
          alert('No hay suficientes datos disponibles')
          return;
        }
      }
    } catch (err) {
      console.log('errr', err);
    }
  }

  const schedules = userQuery.data.venue?.menus[0]?.setting?.schedules

  return (
    <>
      <Head>
        <title>Wapi - Inicio</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="rounded-lg border-4 border-dashed border-gray-200 container mx-auto">
        <div className="flex justify-around my-4">
          <div>
            <h2 className="text-3xl">Estado</h2>
            <div className="mt-4">
              Ahora te encuentras
              <span className={`${isOpen(schedules) ? 'text-green-600' : 'text-red-600'} text-2xl font-bold mx-2`}>
                {isOpen(schedules) ? 'Abierto!' : 'Cerrado!'}
              </span>
            </div>
            <div className='mt-4'>
              <button
                onClick={handleOnClickDownloadReport}
                className="
                    inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium 
                    text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                    ">
                Descargar informe semanal
              </button>
              {/* <p style={{ marginTop: '16px' }}>
                <a
                  href="/csv/ejemplo.csv"
                  download
                  style={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Descargar
                </a>{' '}
                plantilla de ejemplo
              </p> */}
            </div>
          </div>
          <div>
            <h2 className="text-3xl">Configuraciones</h2>
            {
              scheduleMutation.isLoading ? (
                <Loader />
              ) : (
                <div className="m-4">
                  <Form form={settingsForm} onSubmitForm={onSubmitSettingsForm}>
                    <h3 className="text-2xl">Horarios</h3>
                    {days.map(({ label, day }) => (
                      <div key={day} className='flex items-center justify-around my-2'>
                        <div className="basis-1/3">
                          <p className="text-left">{label}</p>
                        </div>
                        <input type="time" {...settingsForm.register(`${day}.from`)} />
                        <span>{'=>'}</span>
                        <input type="time" {...settingsForm.register(`${day}.to`)} />
                      </div>
                    ))}
                    <div className="flex items-center justify-around">
                      <p>Monto mínimo de compra</p>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          className="rounded-md border-gray-300 pl-7 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="0.00"
                          {...settingsForm.register('minPurchaseAmount', { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                    <div className="pt-4 text-right">
                      <button
                        type="submit"
                        className="
                      inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium 
                    text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                    ">
                        Guardar cambios
                      </button>
                    </div>
                  </Form>
                </div>
              )
            }
          </div>
        </div>
      </div>
      <Modal isOpen={isCreateVenueModalOpen} title={<>Crear sucursal</>}>
        <Form form={form} onSubmitForm={onSubmitForm}>
          <div className="overflow-hidden shadow sm:rounded-md">
            <div className="bg-white px-4 py-5 sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <GoogleAutoComplete />
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-wapi-blue hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Crear sucursal
              </button>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

Index.getLayout = function getLayout(page) {
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
    props: {
      session,
    }
  }
}


export default Index;