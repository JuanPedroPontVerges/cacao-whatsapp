import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../server/db/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        // Parse the request body from the POST
        const body = req.body;
        // console.log(JSON.stringify(body, null, 2));
        console.log('TESTING', new Date(), body.entry[0].changes[0].value.messages);
        // const customer = await prisma.customer.findUnique({
        //     where: {
        //         phoneNumber: '3516866950',
        //     }
        // })
        // console.log('customer', customer);
        if (req.body.object) {
            if (
                body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0] &&
                body.entry[0].changes[0].value.messages &&
                body.entry[0].changes[0].value.messages[0]
            ) {
                const phone_number_id =
                    body.entry[0].changes[0].value.metadata.phone_number_id;
                const from = body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
                console.log('from', from);
                const msg_body = body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
                const data = {
                    messaging_product: "whatsapp",
                    to: '543516866950',
                    recipient_type: 'individual',
                    type: 'text',
                    text: { body: "Ack: " + msg_body },
                }
                const url = `https://graph.facebook.com/v15.0/${phone_number_id}/messages`
                await fetch(url, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                });
            }
            return res.status(200).end()

        }
    } else if (req.method === 'GET') {
        const verify_token = 'DAHSKJDHAS3232IUDH12312H3UIADSDHQ12H3_aSDSAD21I23';

        // Parse params from the webhook verification request
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"] as string;
        const challenge = req.query["hub.challenge"];

        // Check if a token and mode were sent
        if (mode && token) {
            // Check the mode and token sent are correct
            if (mode === "subscribe" && token === verify_token) {
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