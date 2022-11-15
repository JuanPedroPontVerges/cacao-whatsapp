import React from "react"
type OrderDetailProps = {
    customer?: {
        id: string;
        fullName: string;
    };
    finalAmount?: number;
    state?: {
        id: string;
        status: string;
    } | null;
    id?: string;
    className?: string;
    additionalInfo?: string | null;
    productStoreCarts?: {
        additionalInfo: string | null;
        amount: number;
        finalPrice: number;
        productStore: {
            product: {
                name: string;
            }
        }

    }[],
}

const OrderDetail: React.FC<OrderDetailProps> = ({ id, customer, productStoreCarts, additionalInfo, finalAmount, state, className }) => {
    return (
        <div className="flex flex-col w-full gap-2">
            <div className="flex justify-between p-2">
                <p>Logo!</p>
                <p>#{id?.slice(4, 8)}</p>
            </div>
            <div className="flex mt-2 pt-2 px-2">
                <div>
                    <p className="mb-2"><strong> Nombre de cliente</strong>: {customer?.fullName}</p>
                    <p><strong>Comentarios adicionales</strong>: {additionalInfo}</p>
                </div>
            </div>
            {
                productStoreCarts?.map((productStoreCart, index) => (
                    <div className="border border-black" key={index}>
                        <div className="flex justify-between mx-2">
                            <div className='flex flex-col'>
                                <p className="text-md">
                                    {productStoreCart.amount} {productStoreCart.productStore.product.name}
                                </p>
                                <p className="text-sm">Obs: {productStoreCart.additionalInfo ? productStoreCart.additionalInfo : '/'}</p>
                            </div>
                            <div>
                                <p>
                                    ${productStoreCart.finalPrice}
                                </p>
                            </div>
                        </div>
                    </div>
                ))
            }
            <div className="flex justify-center">
                <p className="text-1xl">Total: ${finalAmount}</p>
            </div>
            {
                state?.status === 'CANCELLED' ? (null) : (
                    <div className="flex justify-center mb-2">
                        <button className="p-2 border-4 rounded-md border-stone-200 bg-stone-100">Pedir Cuenta</button>
                    </div>
                )
            }

        </div>
    )
}

export default OrderDetail;