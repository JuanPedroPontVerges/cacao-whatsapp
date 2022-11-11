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