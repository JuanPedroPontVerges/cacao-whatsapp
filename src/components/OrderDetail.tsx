import { PaymentState } from "@prisma/client";
import React from "react"
type OrderDetailProps = {
    customer?: {
        id: string;
        fullName: string;
    };
    payment?: {
        id: string;
        status: PaymentState;
    } | null;
    id?: string;
    paymentType?: {
        id: string;
        name: string;
    };
    createdAt?: Date;
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

const OrderDetail: React.FC<OrderDetailProps> = ({ id, customer, productStoreCarts, additionalInfo, createdAt, payment, paymentType, className }) => {
    const finalAmount = productStoreCarts?.reduce((acc, value) => ((value.finalPrice * value.amount) + acc), 0)
    return (
        <div className="flex flex-col w-full gap-2">
            <div className="flex justify-between p-2">
                <p>Logo!</p>
                <p>#{id?.slice(4, 8)}</p>
            </div>
            <div className="mt-2 pt-2 px-2">
                <p className="mb-2"><strong> Fecha de creación</strong>: {createdAt?.toString()}</p>
                <p className="mb-2"><strong> Nombre de cliente</strong>: {customer?.fullName}</p>
                <p className="mb-2"><strong>Comentarios adicionales</strong>: {additionalInfo}</p>
                <p><strong>Tipo de pago</strong>: {paymentType?.name}</p>
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
        </div>
    )
}

export default OrderDetail;