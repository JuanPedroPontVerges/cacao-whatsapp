import { NextApiRequest, NextApiResponse } from 'next'
import { sendTextMessage } from '../whatsapp/utils';
import { prisma } from "../../../server/db/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        if (req.body.action) {
            if (req.body.action === 'payment.created') {
                // Se creo link de pago
            } else if (req.body.action === 'payment.updated') {
                const id = req.body.data.id;
                try {
                    const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
                        },
                    });
                    const parsedResponse = await response.json();
                    if (parsedResponse.external_reference) {
                        const customer = await prisma.customer.findFirst({
                            where: {
                                id: parsedResponse.external_reference,
                            },
                            include: {
                                carts: {
                                    where: {
                                        state: 'PENDING',
                                    }
                                }
                            }
                        })
                        const state = parsedResponse.status === 'approved' ? 'FINISHED' : parsedResponse.status === 'pending' ? 'PENDING' : parsedResponse === 'cancelled' ? 'CANCELLED' : 'FINISHED';
                        const status = parsedResponse.status === 'approved' ? 'APPROVED' : parsedResponse.status === 'pending' ? 'PENDING' : parsedResponse === 'cancelled' ? 'CANCELLED' : 'APPROVED';
                        await prisma.cart.update({
                            where: {
                                id: customer?.carts[0]?.id,
                            },
                            data: {
                                state,
                                order: {
                                    update: {
                                        payment: {
                                            update: {
                                                status,
                                            }
                                        }
                                    }
                                }
                            }
                        })
                        if (customer && status === 'APPROVED') {
                            sendTextMessage(+customer.phoneNumber, `¡Pago recibido! Muchas gracias por su compra, para conocer el estado de su pedido, elija la opción *Status del pedido* en nuestro menú`)
                        }
                    }
                } catch (err) {
                    console.log('err', err);
                }
            }
        }
        console.log('WEBHOOK!!', req.body);
    }
    return res.status(200).end();
}