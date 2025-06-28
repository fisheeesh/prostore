import sampleData from "@/db/sample-data";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types";
import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";

require("dotenv").config();

const BASE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "https://www.theprostore.shop";

PurchaseReceiptEmail.PreviewProps = {
    order: {
        id: crypto.randomUUID(),
        userId: "123",
        user: {
            name: "John Doe",
            email: "text@test.com",
        },
        paymentMethod: "Stripe",
        shippingAddress: {
            fullName: "John Doe",
            phone: "1234567890",
            streetAddress: "123 Main St",
            city: "New York",
            postalCode: "12345",
            country: "US",
        },
        createdAt: new Date(),
        totalPrice: "100",
        taxPrice: "10",
        shippingPrice: "10",
        itemsPrice: "80",
        orderitems: sampleData.products.map((x) => ({
            name: x.name,
            orderId: "123",
            productId: "123",
            discount: "10",
            slug: x.slug,
            qty: x.stock,
            image: x.images[0],
            price: x.price.toString(),
        })),
        isDelivered: true,
        deliveredAt: new Date(),
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
            id: "123",
            status: "succeeded",
            pricePaid: "100",
            email_address: "text@test.com",
        },
    },
} satisfies OrderInformationProps;

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

type OrderInformationProps = {
    order: Order;
};

export default function PurchaseReceiptEmail({ order }: OrderInformationProps) {
    const logoSrc = `https://www.theprostore.shop/images/logo.svg`;

    return (
        <Html>
            <Preview>View Order Receipt</Preview>
            <Tailwind>
                <Head />
                <Body className="font-sans bg-white">
                    <Container className="max-w-xl">
                        <div className="flex items-center justify-center gap-2 my-2">
                            <Img
                                src={logoSrc}
                                alt="Prostore Logo"
                                width="60"
                                height="60"
                            />
                            <Text className="text-2xl font-semibold text-gray-900 m-0">
                                Prostore
                            </Text>
                        </div>

                        <Heading>Purchase Receipt</Heading>
                        <Section>
                            <Row>
                                <Column>
                                    <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                                        Order Id
                                    </Text>
                                    <Text className="mt-0 mr-4">{order.id.toString()}</Text>
                                </Column>
                                <Column>
                                    <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                                        Purchase Date
                                    </Text>
                                    <Text className="mt-0 mr-4">
                                        {dateFormatter.format(order.createdAt)}
                                    </Text>
                                </Column>
                                <Column>
                                    <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                                        Price Paid
                                    </Text>
                                    <Text className="mt-0 mr-4">
                                        {formatCurrency(order.totalPrice)}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
                            {order.orderitems.map((item) => {
                                const imageSrc = item.image.startsWith("/")
                                    ? `${BASE_URL}${item.image}`
                                    : item.image;
                                return (
                                    <Row
                                        key={item.productId}
                                        className="mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0"
                                    >
                                        <Column className="w-20">
                                            <Img
                                                width="80"
                                                alt={item.name}
                                                className="rounded"
                                                src={imageSrc}
                                            />
                                        </Column>
                                        <Column className="align-top pl-4">
                                            <Text className="mb-1 font-medium">{item.name}</Text>
                                            <Text className="mb-0 text-gray-600">
                                                Quantity: {item.qty}
                                            </Text>
                                        </Column>
                                        <Column align="right" className="align-top">
                                            <Text className="mb-0 font-medium">
                                                {formatCurrency(item.price)}
                                            </Text>
                                        </Column>
                                    </Row>
                                );
                            })}

                            {[
                                { name: "Items", price: order.itemsPrice },
                                { name: "Tax", price: order.taxPrice },
                                { name: "Shipping", price: order.shippingPrice },
                                { name: "Total", price: order.totalPrice },
                            ].map(({ name, price }) => (
                                <Row key={name} className="py-1">
                                    <Column align="right">{name}: </Column>
                                    <Column align="right" width={70} className="align-top">
                                        <Text className="m-0">{formatCurrency(price)}</Text>
                                    </Column>
                                </Row>
                            ))}
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}