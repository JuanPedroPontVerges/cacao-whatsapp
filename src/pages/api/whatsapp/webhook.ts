import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../server/db/client";
import { CreatePreferenceInput, PreferenceItem } from '../mercadopago/preference';
import { NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER, NOT_SURE_HARDCODED_VENUE_ID, VERIFY_TOKEN } from './constants';
import { sendTextMessage, sendMenu } from './utils';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const body = req.body;
        if (req.body.object) {
            if (
                body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0] &&
                body.entry[0].changes[0].value.messages &&
                body.entry[0].changes[0].value.messages[0]
            ) {
                const message = body.entry[0].changes[0].value.messages[0];
                const customer = await prisma.customer.findUnique({
                    where: {
                        phoneNumber: NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER.toString(),
                    }
                })
                console.log('message', message);
                if (message.type === 'interactive') {
                    const venue = await prisma.venue.findUnique({
                        where: {
                            id: NOT_SURE_HARDCODED_VENUE_ID,
                        },
                        select: {
                            id: true,
                            menus: true,
                        }
                    })
                    if (!venue || !customer) return;
                    if (message.interactive.list_reply) {
                        const id = message.interactive.list_reply.id as 'status' | 'order';
                        if (id === 'status') {
                            // Verificar estado del pedido
                            const order = await prisma.order.findFirst({
                                where: {
                                    customer: {
                                        id: customer.id,
                                    },
                                    State: {
                                        name: {
                                            not: 'Despachado'
                                        }
                                    }
                                },
                                orderBy: {
                                    createdAt: 'desc',
                                },
                                select: {
                                    State: true,
                                }
                            })
                            await sendTextMessage(NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER, order ? `Estado de orden: ${order?.State.name}` : 'No tienes ordenes pendientes!');
                        } else if (id === 'order') {
                            if (!customer) {
                                // Not sure if is in mvp's scope
                                await prisma.customer.create({
                                    data: {
                                        fullName: 'Juan Pedro Pont Vergés',
                                        phoneNumber: NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER.toString(),
                                        venue: {
                                            connect: {
                                                id: venue.id,
                                            }
                                        }
                                    }
                                })
                            } else {
                                const cart = await prisma.cart.findFirst({
                                    where: {
                                        customerId: customer.id,
                                        state: 'PENDING'
                                    },
                                })
                                if (cart) {
                                    // Has a pending cart
                                    const initPoint = `${process.env.NEXTAUTH_URL}/store/${venue.menus[0]?.id}?cartId=${cart.id}`
                                    await sendTextMessage(NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER, `Genial! Acá tenes tu link de compra: ${initPoint}`);
                                } else {
                                    // Creates a new one
                                    const cart = await prisma.cart.create({
                                        data: {
                                            customerId: customer.id,
                                            finalPrice: 0,
                                        }
                                    })
                                    const initPoint = `${process.env.NEXTAUTH_URL}/store/${venue.menus[0]?.id}?cartId=${cart.id}`
                                    await sendTextMessage(NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER, `Genial! Acá tenes tu link de compra: ${initPoint}`);
                                }
                            }
                        }
                    } else if (message.interactive.button_reply) {
                        const id = message.interactive.button_reply.id as 'yes' | 'update' | 'cancel';
                        const cart = await prisma.cart.findFirst({
                            orderBy: {
                                createdAt: 'desc',
                            },
                            where: {
                                customerId: customer.id,
                                OR: [
                                    {
                                        state: 'FINISHED',
                                        order: {
                                            PaymentType: {
                                                name: 'Efectivo'
                                            },
                                            payment: {
                                                status: 'PENDING',
                                            }
                                        }
                                    },
                                    {
                                        state: 'PENDING',
                                        order: {
                                            PaymentType: {
                                                name: 'Mercadopago'
                                            }
                                        }
                                    },
                                ]
                            },
                            include: {
                                order: {
                                    include: {
                                        PaymentType: true,
                                    }
                                },
                                productStoreCarts: {
                                    include: {
                                        productStore: {
                                            select: {
                                                product: true,
                                            }
                                        }
                                    }
                                }
                            }
                        })
                        console.log('cart', cart);
                        if (cart) {
                            if (id === 'yes') {
                                if (cart?.order?.PaymentType.name === 'Efectivo') {
                                    // Nothing to do

                                } else if (cart?.order?.PaymentType.name === 'Mercadopago') {
                                    const items: PreferenceItem[] = cart.productStoreCarts.map((productStoreCart) => (
                                        {
                                            title: productStoreCart.productStore.product.name,
                                            description: productStoreCart.productStore.product.description,
                                            picture_url: productStoreCart.productStore.product.imageUrl,
                                            quantity: productStoreCart.amount,
                                            currencty_id: 'ARS',
                                            unit_price: productStoreCart.finalPrice,
                                        }
                                    ))
                                    const data: CreatePreferenceInput = {
                                        items,
                                        external_reference: customer.id,
                                    }
                                    try {
                                        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/mercadopago/preference` as string, {
                                            method: "POST",
                                            body: JSON.stringify(data),
                                            headers: {
                                                "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
                                                "Content-Type": "application/json"
                                            },
                                        });
                                        const parsedRes = await res.json();
                                        console.log('res', parsedRes);
                                        if (!res.ok) {
                                            return res.text().then(text => { throw new Error(text) })
                                        }
                                        await sendTextMessage(NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER,
                                            `Detectamos que decidiste pagar con MercadoPago. Aquí tienes tu link para realizar el pago: 
${parsedRes.init_point}`);
                                    } catch (err) {
                                        console.log('errr', err);
                                    }

                                }
                            } else if (id === 'update') {
                                const initPoint = `${process.env.NEXTAUTH_URL}/store/${venue.menus[0]?.id}?cartId=${cart?.id}`
                                await sendTextMessage(NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER,
                                    `¡No te preocupes! Ingresa nuevamente a este enlace para hacer cambios a tu pedido 👉🏽 ${initPoint} `);
                            } else if (id === 'cancel') {
                                const cancelledId = await prisma.orderState.findUnique({
                                    where: {
                                        name: 'Cancelado'
                                    },
                                    select: {
                                        id: true,
                                    }
                                })
                                if (cart.order) {
                                    await prisma.order.update({
                                        where: {
                                            id: cart.order.id,
                                        },
                                        data: {
                                            Cart: {
                                                update: {
                                                    state: 'CANCELLED',
                                                }
                                            },
                                            State: {
                                                connect: {
                                                    id: cancelledId?.id,
                                                }
                                            },
                                            payment: {
                                                update: {
                                                    status: 'CANCELLED',
                                                }
                                            }
                                        }
                                    })
                                    await sendTextMessage(NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER, '¡Orden Cancelada!');
                                    await sendMenu(NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER, customer.fullName);
                                }
                            }
                        }
                    }
                } else if (message.type === 'text') {
                    await sendMenu(NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER, customer?.fullName);
                }
            }
            return res.status(200).end()
        }
    } else if (req.method === 'GET') {
        // Parse params from the webhook verification request
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"] as string;
        const challenge = req.query["hub.challenge"];

        // Check if a token and mode were sent
        if (mode && token) {
            // Check the mode and token sent are correct
            if (mode === "subscribe" && token === VERIFY_TOKEN) {
                // Respond with 200 OK and challenge token from the request
                console.log("WEBHOOK_VERIFIED");
                res.status(200).send(challenge);
            } else {
                // Responds with '403 Forbidden' if verify tokens do not match
                res.status(403).end()
            }
        }
        return res.status(200).end()
    }

}