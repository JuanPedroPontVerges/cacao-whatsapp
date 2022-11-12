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
            button?: string,
            buttons?: {
                type: TButtonsType,
                reply: {
                    id: string,
                    title: string,
                }
            }[],
            sections?: {
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
export type TButtonsType = 'reply'

export type WhatsappProductStoreCartInput = {
    id: string;
    additionalInfo: string | null;
    amount: number;
    finalPrice: number;
    productStore: {
        product: {
            name: string;
            price: number | null;
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