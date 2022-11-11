import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../server/db/client";
import { NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER, NOT_SURE_HARDCODED_VENUE_ID, VERIFY_TOKEN } from './constants';
import { sendCartLink, sendMenu } from './utils';

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
                    if (!venue) return;
                    console.log('message list_reply', message.interactive.list_reply);
                    const id = message.interactive.list_reply.id as 'status' | 'order';
                    if (id === 'status') {
                        // Verificar estado del pedido
                    } else if (id === 'order') {
                        // Not sure if is in mvp's scope
                        if (!customer) {
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
                                await sendCartLink(NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER, initPoint);
                            } else {
                                // Creates a new one
                                const cart = await prisma.cart.create({
                                    data: {
                                        customerId: customer.id,
                                        finalPrice: 0,
                                    }
                                })
                                const initPoint = `${process.env.NEXTAUTH_URL}/store/${venue.menus[0]?.id}?cartId=${cart.id}`
                                await sendCartLink(NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER, initPoint);
                            }
                        }
                    }
                } else if (message.type === 'text') {
                    await sendMenu(NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER, customer?.fullName);
                }
            }
            console.log('iegue');
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