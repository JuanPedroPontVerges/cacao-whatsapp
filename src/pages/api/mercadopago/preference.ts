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
            notification_url: 'https://2454-186-136-6-251.ngrok.io/api/mercadopago/webhook',
            items,
            payment_methods: {
                installments: 1,
                default_installments: 1,
            },
            external_reference,
            back_urls: {
                success: `https://2454-186-136-6-251.ngrok.io/payment/success`,
                failure: 'https://2454-186-136-6-251.ngrok.io/payment/failure',
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