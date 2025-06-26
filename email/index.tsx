import { APP_NAME } from "@/lib/constants";
import { Order } from "@/types";
import { Resend } from "resend";
import PurchaseReceiptEmail from "./purchase-receipt";
import DeliveryNotification from "./delivery-notification";

require('dotenv').config()

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
    await resend.emails.send({
        from: `${APP_NAME} <noreply@theprostore.shop>`,
        to: order.user.email,
        subject: `Order Confirmation: ${order.id}`,
        react: <PurchaseReceiptEmail order={order} />
    })
}
export const sendDeliveredNotification = async ({ order }: { order: Order }) => {
    await resend.emails.send({
        from: `${APP_NAME} <noreply@theprostore.shop>`,
        to: order.user.email,
        subject: `Delivered To You: ${order.id}`,
        react: <DeliveryNotification order={order} />
    })
}