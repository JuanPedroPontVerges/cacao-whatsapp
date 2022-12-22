import { Schedule } from "@prisma/client";
import { PHONE_NUMBER_ID } from "./constants";
import { BuildInteractiveMessageInput, SendRequestInput, TButtonsType, TInteractive, WhatsappProductStoreCartInput } from "./types";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import objectSupport from 'dayjs/plugin/objectSupport';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DaysType } from "../..";
dayjs.extend(objectSupport)
dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)


export const sendRequest = async (input: SendRequestInput) => {
    const { data } = input;
    const url = `https://graph.facebook.com/v15.0/${PHONE_NUMBER_ID}/messages`
    try {
        const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
                "Content-Type": "application/json"
            },
        });
        if (!res.ok) {
            return res.text().then(text => { throw new Error(text) })
        }
    } catch (err) {
        console.log('errr', err);
    }
}

export const sendTextMessage = async (to: number, message: string) => {
    await sendRequest({
        data: {
            messaging_product: 'whatsapp',
            to,
            type: 'text',
            text: {
                body: `${message}`,
            }
        }
    })
}

export const isOpen = (schedules?: Schedule[]) => {
    const dayOfTheWeek = dayjs().tz("America/Argentina/Cordoba").day();
    const dayOfTheWeekAsString = parseDayAsNumberToString(dayOfTheWeek)
    const currentDaySchedule = schedules?.find((schedule) => schedule.day === dayOfTheWeekAsString)
    console.log('currentDaySchedule', currentDaySchedule);
    console.log('dayOfTheWeekAsString', dayOfTheWeekAsString);
    console.log('dayOfTheWeek', dayOfTheWeek);
    if (currentDaySchedule) {
        const from = dayjs({ hour: currentDaySchedule.fromHour || 0, minute: currentDaySchedule.fromMinute || 0 }).tz("America/Argentina/Cordoba")
        const to = dayjs({ hour: currentDaySchedule.toHour || 0, minute: currentDaySchedule.toMinute || 0 }).tz("America/Argentina/Cordoba")
        const now = dayjs().tz("America/Argentina/Cordoba")
        return now.isBetween(from, to)
    } else return false;
}

const parseDayAsNumberToString = (dayAsnumber: number): DaysType => {
    if (dayAsnumber === 0) return 'sunday'
    else if (dayAsnumber === 1) return 'monday'
    else if (dayAsnumber === 2) return 'tuesday'
    else if (dayAsnumber === 3) return 'wendsday'
    else if (dayAsnumber === 4) return 'thursday'
    else if (dayAsnumber === 5) return 'friday'
    else return 'saturday'
}


export const sendCartDetail = async (to: number, productStoreCarts: WhatsappProductStoreCartInput[]) => {
    const finalPrice = productStoreCarts.reduce((acc, value) => ((value.finalPrice * value.amount) + acc), 0)
    await sendRequest({
        data: {
            messaging_product: 'whatsapp',
            to,
            type: 'text',
            text: {
                body: `Me antojaste 🤤 este es el resumen de tu pedido 👇🏼
${productStoreCarts.map((productStoreCart, index) => (
                    `
${index + 1}) ${productStoreCart.amount} x *${productStoreCart.productStore.product.name}* ($${productStoreCart.productStore.product.price})
${productStoreCart.productStoreCartToOptions.map((option, index) => (
                        `${index === 0 ? `- ${option.option.optionGroup.name}` : ''}
  * ${option.amount} x ${option.option.name} ${option.option.price ? (`($${option.option.price})`) : ('')}`
                    ))}`
                ))}

Total: *$${finalPrice}*`,
            }
        }
    })
    const payload = {
        to,
        interactive: {
            type: 'button' as TInteractive,
            body: {
                text: '¿Todo bien con tu pedido?'
            },
            action: {
                buttons: [
                    {
                        type: 'reply' as TButtonsType,
                        reply: {
                            id: 'yes',
                            title: 'Si'
                        }
                    },
                    {
                        type: 'reply' as TButtonsType,
                        reply: {
                            id: 'update',
                            title: 'Modificar pedido'
                        }
                    },
                    {
                        type: 'reply' as TButtonsType,
                        reply: {
                            id: 'cancel',
                            title: 'Cancelar pedido'
                        }
                    }
                ]
            }
        }
    }
    const data = buildInteractiveMessage(payload);
    await sendRequest({ data });
}

export const buildInteractiveMessage = (input: BuildInteractiveMessageInput) => {
    const { to, interactive } = input;
    return {
        recipient_type: 'individual',
        messaging_product: "whatsapp",
        type: 'interactive',
        interactive,
        to,
    }
}

export const sendMenu = async (to: number, customerFullName?: string) => {
    const data = {
        to,
        interactive: {
            type: 'list' as TInteractive,
            header: {
                type: 'text',
                text: 'Bienvenido'
            },
            body: {
                text: `Hola ${customerFullName ? `${customerFullName} ¿En que podemos ayudarte?` : '¿En que podemos ayudarte?'} `
            },
            footer: {
                text: 'Porfavor, elija 1 opción',
            },
            action: {
                button: 'Lista de opciones',
                sections: [
                    {
                        title: "Menú",
                        rows: [
                            {
                                id: "order",
                                title: "🍽️ Realizar pedido",
                            },
                            {
                                id: "status",
                                title: "⏱️ Status del pedido",
                            }
                        ]
                    },
                ]
            }
        }
    }
    const payload = buildInteractiveMessage(data)
    await sendRequest({ data: payload });
}