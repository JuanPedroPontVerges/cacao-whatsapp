import React from "react";
import Timer from "./Timer";
export type Action = "confirm" | "cancel" | "dispatch";
type OrderCardProps = {
  customer?: {
    id: string;
    fullName: string;
  };
  createdAt: Date;
  price?: number;
  state?: {
    id: string;
    name: string;
  };
  payment?: {
    id: string;
    status: string;
  } | null;
  id?: string;
  className?: string;
  onClick: (id?: string) => void;
  onClickAction: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    action: Action,
    id?: string
  ) => void;
};

const OrderCard: React.FC<OrderCardProps> = ({
  id,
  customer,
  price,
  state,
  payment,
  className,
  createdAt,
  onClick,
  onClickAction,
}) => {
  const bgColor =
    state?.name === "Pendiente"
      ? "slate"
      : state?.name === "Cancelado"
        ? "red"
        : state?.name === "Confirmado" || state?.name === "Despachado"
          ? "green"
          : "purple";
  return (
    <div
      id={id}
      onClick={() => onClick(id)}
      className={`cursor-pointer duration-500 rounded-md motion-safe:hover:scale-105 ${className}`}
    >
      <div
        className={`border-2 rounded-lg w-auto bg-${bgColor}-300`}
      >
        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-row justify-center text-center text-bold text-xl">
            <div className="flex-auto">
              <span className="text-sm">Orden</span>
              <p>#{id?.slice(4, 8)}</p>
            </div>
            <div className="flex-auto">
              <span className="text-sm">Tiempo de espera:</span>
              <p>
                {state?.name === "Despachado" ||
                  state?.name === "Cancelado" ? null : (
                  <Timer createdAt={createdAt} />
                )}
              </p>
            </div>
          </div>

          <div className="flex justify-center my-2">
            <div className="text-center text-bold text-xl">
              <span className="text-sm">Pago</span>
              <p>
                {" "}
                {payment?.status === "PENDING"
                  ? "Pendiente"
                  : payment?.status === "CANCELLED"
                    ? "Cancelado"
                    : payment?.status === "APPROVED"
                      ? "Pagado"
                      : payment?.status}
              </p>
            </div>
          </div>

          <div className="flex flex-row justify-center gap-4 text-bold text-xl">
            <div className="flex-auto">
              <span className="text-sm">Cliente</span>
              <p className="mb-2">{customer?.fullName}</p>
            </div>
            <div className="flex-auto">
              <span className="text-sm">Total</span>
              <p>${price}</p>
            </div>
          </div>

          <div className="flex justify-around mt-4 pb-2">
            {state?.name === "Pendiente" ? (
              <>
                <button
                  onClick={(e) => onClickAction(e, "cancel", id)}
                  className="border border-white inline-flex justify-center rounded-md bg-red-300 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={(e) => onClickAction(e, "confirm", id)}
                  className="inline-flex justify-center rounded-md border border-white bg-blue-100 px-4 py-2 text-sm font-medium text-wapi-blue hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Confirmar
                </button>
              </>
            ) : state?.name === "Cancelado" ? null : state?.name ===
              "Despachado" ? (
              "¡Entregado!"
            ) : (
              <button
                onClick={(e) => onClickAction(e, "dispatch", id)}
                className="inline-flex justify-center rounded-md border border-white bg-blue-100 px-4 py-2 text-sm font-medium text-wapi-blue hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Despachar
              </button>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default OrderCard;
