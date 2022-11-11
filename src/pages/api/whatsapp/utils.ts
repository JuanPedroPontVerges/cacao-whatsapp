import { PHONE_NUMBER_ID } from "./constants";
import { BuildInteractiveMessageInput, SendRequestInput, TInteractive } from "./types";

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
        console.log('err', err);
    }
}

export const sendCartLink = async (to: number, link: string) => {
    await sendRequest({
        data: {
            messaging_product: 'whatsapp',
            to,
            type: 'text',
            text: {
                body: `Genial! Acá tenes tu link de compra: ${link}`,
            }
        }
    })
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