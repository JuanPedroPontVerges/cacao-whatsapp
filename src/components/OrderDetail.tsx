import { PaymentState } from "@prisma/client";
import React from "react";
import Image from "next/image";
import WapiLogo from "public/assets/wapi-logo.svg";
import {
  BanknotesIcon,
  FunnelIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

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
    productStoreCartToOptions?: any
    amount: number;
    finalPrice: number;
    productStore: {
      product: {
        name: string;
      };
    };
  }[];
};

const OrderDetail: React.FC<OrderDetailProps> = ({
  id,
  customer,
  productStoreCarts,
  additionalInfo,
  createdAt,
  payment,
  paymentType,
  className,
}) => {
  const finalAmount = productStoreCarts?.reduce((acc, value) => ((value.finalPrice * value.amount) + acc), 0)
  return (
    <div className="flex flex-col w-full p-3">
      <div className="flex flex-col justify-center items-center mt-2">
        <DocumentTextIcon className="w-6 mr-2" />
        <p className="text-xl">Detalle de orden</p>
        <p className="text-xl">#{id?.slice(4, 8)}</p>
      </div>

      <div className="my-2 p-2">
        <div className="flex flex-row justify-center mb-2">
          <div className="flex-auto">
            <span className="text-sm">Cliente</span>
            <p className="mb-2">{customer?.fullName}</p>
          </div>
          <div className="flex-auto">
            <span className="text-sm">Fecha</span>
            <p className="mb-2">{createdAt?.toString()}</p>
          </div>
        </div>

        <span className="text-sm">Pedido:</span>
        {productStoreCarts?.map((productStoreCart, index) => (
          <div className="border border-gray-500 rounded py-3" key={index}>
            <div className="flex justify-between mx-2">
              <div className="flex flex-col">
                <p className="text-xl">
                  {productStoreCart.amount}{" "}
                  {productStoreCart.productStore.product.name}
                </p>
                <div>
                  {productStoreCart?.productStoreCartToOptions?.map((option: any, index: number) => {
                    if (option.amount > 0) {
                      return (
                        <p key={index} className='m-2'>
                          x{option.amount} {option.option.name}
                        </p>
                      )
                    }
                  })}
                </div>
                <p className="text-sm">
                  Obs:{" "}
                  {productStoreCart.additionalInfo
                    ? productStoreCart.additionalInfo
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xl">${productStoreCart.finalPrice}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="flex flex-row mt-2">
          <div className="flex-auto">
            <span className="text-sm">Comentarios adicionales:</span>
            <p className="mb-2"> {additionalInfo}</p>
          </div>
          <div className="flex-auto">
            <span className="text-sm">Paga con:</span>
            <p>{paymentType?.name}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center py-3">
        <p className="text-2xl">Total: ${finalAmount}</p>
      </div>
    </div>
  );
};

export default OrderDetail;
