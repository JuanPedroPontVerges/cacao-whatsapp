import { PaymentState } from "@prisma/client";
import { z } from "zod";
import { NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER } from "../../pages/api/whatsapp/constants";
import { sendCartDetail } from "../../pages/api/whatsapp/utils";
import { createRouter } from "./context";

// Example router with queries that can only be hit if the user requesting is signed in
export const orderRouter = createRouter()
  .mutation("create", {
    input: z.object({
      cartId: z.string(),
      paymentTypeId: z.string(),
      additionalInfo: z.string(),
      phoneNumber: z.string(),
      fullName: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { cartId, additionalInfo, phoneNumber, fullName, paymentTypeId } = input;
      const cart = await ctx.prisma.cart.findFirst({
        where: { id: cartId },
        select: {
          productStoreCarts: {
            select: {
              finalPrice: true,
              productStore: {
                select: {
                  product: {
                    select: {
                      category: {
                        select: {
                          menu: {
                            select: {
                              venue: {
                                select: {
                                  id: true,
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
        }
      });
      const venueId = cart?.productStoreCarts[0]?.productStore?.product?.category?.menu?.venue?.id;
      const orderPickupTypeId = await ctx.prisma.orderType.findFirst({
        where: {
          name: 'Retiro en el local'
        },
        select: {
          id: true,
        }
      }) || { id: '123' }
      const orderStatePendingId = await ctx.prisma.orderState.findFirst({
        where: {
          name: 'Pendiente',
        },
        select: {
          id: true,
        }
      }) || { id: '123' }
      const total: number = cart?.productStoreCarts.reduce((acc, value) => (value.finalPrice + acc), 0) || 42069
      const order = await ctx.prisma.order.upsert({
        where: {
          cartId,
        },
        create: {
          total,
          additionalInfo,
          Cart: {
            connect: {
              id: cartId,
            },
          },
          PaymentType: {
            connect: {
              id: paymentTypeId,
            }
          },
          State: {
            connect: {
              id: orderStatePendingId.id,
            }
          },
          Type: {
            connect: {
              id: orderPickupTypeId.id,
            }
          },
          customer: {
            connectOrCreate: {
              create: {
                phoneNumber,
                fullName,
                venue: {
                  connect: {
                    id: venueId
                  }
                }
              },
              where: {
                phoneNumber,
              }
            }
          },
        },
        update: {
          total,
          additionalInfo,
          PaymentType: {
            connect: {
              id: paymentTypeId,
            }
          },
          State: {
            connect: {
              id: orderStatePendingId.id,
            }
          },
          Type: {
            connect: {
              id: orderPickupTypeId.id,
            }
          },
          customer: {
            connectOrCreate: {
              create: {
                phoneNumber,
                fullName,
                venue: {
                  connect: {
                    id: venueId
                  }
                }
              },
              where: {
                phoneNumber,
              }
            }
          },
        },
        select: {
          id: true,
          cartId: true,
          payment: true,
        }
      })
      const foundCart = await ctx.prisma.cart.findFirst({
        where: {
          id: cartId,
        },
        include: {
          productStoreCarts: {
            include: {
              productStore: {
                select: {
                  product: true,
                }
              },
              productStoreCartToOptions: {
                include: {
                  option: {
                    include: {
                      optionGroup: true,
                    }
                  },
                },
                where: {
                  amount: {
                    gt: 0,
                  }
                },
              },
            }
          },
        }
      })
      if (foundCart?.productStoreCarts) {
        await sendCartDetail(NOT_SURE_HARDCODED_CUSTOMER_PHONE_NUMBER, foundCart?.productStoreCarts)
      }
      return order;
    },
  })
  .mutation("updateState", {
    input: z.object({
      orderId: z.string(),
      action: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { orderId, action } = input;
      const orderState = await ctx.prisma.orderState.findFirst({
        where: {
          name: action,
        },
        select: {
          id: true,
        }
      });
      return await ctx.prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          State: {
            connect: {
              id: orderState?.id,
            }
          }
        }
      })
    },
  })
  .query("findById", {
    input: z.object({ id: z.string().nullish() }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.id != null) {
        const { id } = input;
        return await ctx.prisma.order.findUnique({
          where: {
            id,
          },
          select: {
            customer: true,
            total: true,
          }
        });
      }
    },
  })
  .query("findByVenueId", {
    input: z.object({
      id: z.string().nullish(),
      paymentTypeId: z.string().nullish(),
      orderStateId: z.string().nullish(),
      paymentState: z.enum(['PENDING', 'APPROVED', 'CANCELLED']).nullish(),
    }).nullish(),
    async resolve({ ctx, input }) {
      if (input && input.id != null) {
        const { id, paymentTypeId, paymentState, orderStateId } = input;
        return await ctx.prisma.order.findMany({
          where: {
            customer: {
              venueId: id,
            },
            AND: [
              {
                paymentTypeId: paymentTypeId as string | undefined,
              },
              {
                payment: {
                  status: paymentState as undefined | PaymentState
                }
              },
              {
                stateId: orderStateId as string | undefined,
              }
            ]
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            customer: true,
            State: true,
            Type: true,
            payment: true,
            PaymentType: true,
            Cart: {
              include: {
                productStoreCarts: {
                  include: {
                    productStore: {
                      select: {
                        product: true,
                      }
                    }
                  }
                },
              }
            }
          }
        });
      }
    },
  })
