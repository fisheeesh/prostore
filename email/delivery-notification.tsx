import sampleData from "@/db/sample-data"
import { formatCurrency } from "@/lib/utils"
import { Order } from '@/types'
import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text
} from "@react-email/components"

require('dotenv').config()

DeliveryNotification.PreviewProps = {
    order: {
        id: crypto.randomUUID(),
        userId: '123',
        user: {
            name: 'John Doe',
            email: "text@test.com"
        },
        paymentMethod: 'Stripe',
        shippingAddress: {
            fullName: 'John Doe',
            phone: '1234567890',
            streetAddress: '123 Main St',
            city: 'New York',
            postalCode: '12345',
            country: 'US'
        },
        createdAt: new Date(),
        totalPrice: '100',
        taxPrice: '10',
        shippingPrice: '10',
        itemsPrice: '80',
        orderitems: sampleData.products.map(x => ({
            name: x.name,
            orderId: '123',
            productId: '123',
            slug: x.slug,
            qty: x.stock,
            image: x.images[0],
            price: x.price.toString(),
            discount: '10'
        })),
        isDelivered: true,
        deliveredAt: new Date(),
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
            id: '123',
            status: 'succeeded',
            pricePaid: '100',
            email_address: 'text@test.com'
        }
    }
} satisfies DeliveryNotificationProps

const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' })

type DeliveryNotificationProps = {
    order: Order
}

export default function DeliveryNotification({ order }: DeliveryNotificationProps) {
    const logoPath = "/images/logo.svg";
    const logoSrc = logoPath.startsWith("/")
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}${logoPath}`
        : logoPath;

    return (
        <Html>
            <Preview>Your Order Has Been Delivered!</Preview>
            <Tailwind>
                <Head />
                <Body className="font-sans bg-white">
                    <Container className="max-w-xl">
                        <Section className="text-center mb-8">
                            <div className="flex items-center justify-center gap-2 my-2">
                                <Img
                                    src={logoSrc}
                                    alt="Prostore Logo"
                                    width="60"
                                    height="60"
                                />
                                <Text className="text-2xl font-semibold text-gray-900 m-0">Prostore</Text>
                            </div>

                            <Heading className="text-green-600 text-2xl mb-2">🎉 Delivered Successfully!</Heading>
                            <Text className="text-lg text-gray-700 mb-0">
                                Great news! We have successfully delivered your order to your address.
                            </Text>
                            <Text className="text-base text-gray-600 mt-2">
                                We hope you enjoy your purchase. Thank you for choosing us!
                            </Text>
                        </Section>

                        <Section className="mb-6">
                            <Heading className="text-xl text-gray-800 mb-4">Delivery Details</Heading>
                            <Row>
                                <Column>
                                    <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                                        Order ID
                                    </Text>
                                    <Text className="mt-0 mr-4 font-medium">
                                        {order.id.toString()}
                                    </Text>
                                </Column>
                                <Column>
                                    <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                                        Delivered On
                                    </Text>
                                    <Text className="mt-0 mr-4 font-medium">
                                        {dateFormatter.format(order.deliveredAt || new Date())}
                                    </Text>
                                </Column>
                                <Column>
                                    <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                                        Order Total
                                    </Text>
                                    <Text className="mt-0 mr-4 font-medium">
                                        {formatCurrency(order.totalPrice)}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        <Section className="mb-6">
                            <Heading className="text-xl text-gray-800 mb-4">Delivered To</Heading>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <Text className="mb-1 font-medium">Name: {order.shippingAddress.fullName}</Text>
                                <Text className="mb-1 text-gray-600">Phone Number: {order.shippingAddress.phone}</Text>
                                <Text className="mb-1 text-gray-600">Address: {order.shippingAddress.streetAddress}</Text>
                                <Text className="mb-0 text-gray-600">
                                    City: {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                </Text>
                                <Text className="mb-0 text-gray-600">Country: {order.shippingAddress.country}</Text>
                            </div>
                        </Section>

                        <Section className="border border-solid border-gray-300 rounded-lg p-4 md:p-6 mb-6">
                            <Heading className="text-lg text-gray-800 mb-4">Items Delivered</Heading>
                            {
                                order.orderitems.map(item => (
                                    <Row key={item.productId} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
                                        <Column className="w-20">
                                            <Img
                                                width='80'
                                                alt={item.name}
                                                className="rounded"
                                                src={item.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}` : item.image}
                                            />
                                        </Column>
                                        <Column className="align-top pl-4">
                                            <Text className="mb-1 font-medium">{item.name}</Text>
                                            <Text className="mb-0 text-gray-600">Quantity: {item.qty}</Text>
                                        </Column>
                                        <Column align="right" className="align-top">
                                            <Text className="mb-0 font-medium">{formatCurrency(item.price)}</Text>
                                        </Column>
                                    </Row>
                                ))
                            }
                        </Section>

                        <Section className="bg-green-50 border border-green-200 rounded-lg p-4 md:p-6 mb-6">
                            <Heading className="text-lg text-green-800 mb-3">What&apos;s Next?</Heading>
                            <Text className="mb-2 text-green-700">
                                ✅ <strong>Enjoy your purchase!</strong> We hope you love what you ordered.
                            </Text>
                            <Text className="mb-2 text-green-700">
                                ⭐ <strong>Leave a review:</strong> Share your experience to help other customers.
                            </Text>
                            <Text className="mb-0 text-green-700">
                                🛍️ <strong>Shop again:</strong> Discover more amazing products in our <Link href={process.env.NEXT_PUBLIC_SERVER_URL || "#"} className="text-green-600 underline font-medium">store</Link>.
                            </Text>
                        </Section>

                        <Section className="border-t border-gray-300 pt-4 text-center">
                            <Text className="text-gray-500 text-sm mb-0">
                                This email was sent regarding your order #{order.id.toString()}
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}