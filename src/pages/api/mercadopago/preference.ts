import { NextApiRequest, NextApiResponse } from 'next'

export type CreatePreferenceInput = {
    external_reference: string,
    items: PreferenceItem[],
}

export type PreferenceItem = {
    title: string;
    description: string | null;
    picture_url: string | null;
    quantity: number;
    currencty_id: 'ARS',
    unit_price: number;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { items, external_reference } = req.body;
        const data = {
            additional_info: 'Compra de producto Wapi',
            notification_url: 'https://utn-trabajo-final.vercel.app/api/mercadopago/webhook',
            items,
            payment_methods: {
                installments: 1,
                default_installments: 1,
            },
            external_reference,
            back_urls: {
                success: `https://utn-trabajo-final.vercel.app/payment/success`,
                failure: 'https://utn-trabajo-final.vercel.app/payment/failure',
            },
        }
        try {
            const response = await fetch(`https://api.mercadopago.com/checkout/preferences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
                },
                body: JSON.stringify(data)
            });
            const parsedResponse = await response.json();
            res.status(200).json(parsedResponse)
            return;
        } catch (err) {
            console.log('err', err);
        }
    }
}