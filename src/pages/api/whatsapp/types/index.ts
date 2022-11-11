import { ProductStoreCart } from "@prisma/client"

export interface SendRequestInput {
    data: any,
}

export interface BuildInteractiveMessageInput {
    to: number,
    interactive: {
        type: 'list' | 'button',
        header?: {
            type: string,
            text: string
        },
        body: {
            text: string,
        },
        footer?: {
            text: string,
        },
        action: {
            button: string,
            sections: {
                title: string,
                rows: {
                    id: string,
                    title: string
                }[]
            }[]
        }
    }
}

export type TInteractive = 'list' | 'button'

export type WhatsappProductStoreCartInput = {
    id: string;
    additionalInfo: string | null;
    amount: number;
    finalPrice: number;
    productStore: {
        product: {
            name: string;
        }
    }
    productStoreCartToOptions: {
        amount: number;
        option: {
            name: string;
            description: string | null;
            price: number | null;
            optionGroup: {
                id: string;
                name: string;
            }
        },
    }[]
}