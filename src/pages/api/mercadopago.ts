import S3 from 'aws-sdk/clients/s3'
import { NextApiRequest, NextApiResponse } from 'next'

type CreatePreferenceInput = {
    additional_info: string,
    items: {
        title: string;
        description: string;
        picture_url: string;
        quantity: number;
        currencty_id: 'ARS',
        unit_price: number;
    }[]
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log({ req, res });
    // const { items } = req.body;
    const url = `https://api.mercadopago.com/checkout/preferences`;
    const data = {
        additional_info: 'Compra de proudcot de WAPI!!',
        notification_url: 'https://4a87-186-136-6-251.ngrok.io/mercadopago',
        items: [
            {
                title: "Compra de proudcot de WAPI!!",
                description: "Compra de proudcot de WAPI!!",
                picture_url: "https://www.cacao.to/logo-og.png",
                category_id: "virtual_goods",
                quantity: 1,
                currency_id: "ARS",
                unit_price: 3
            }
        ],
        payment_methods: {
            installments: 1,
            default_installments: 1,
        },
        external_reference: 123,
        back_urls: {
            success: `https://4a87-186-136-6-251.ngrok.io/mercadopago`,
            failure: 'https://4a87-186-136-6-251.ngrok.io/mercadopago',
        },
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(data)
        });
        const jsonResponse = await response.json();
        console.log('response', jsonResponse);
    } catch (err) {
        console.log('err', err);
    }
    return res.status(200).json({ message: 'hola que tal!' })
}