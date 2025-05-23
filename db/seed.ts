import { PrismaClient } from "@/lib/generated/prisma";
import sampleData from "./sample-data";

//* It is async cus the prisma methods that we are gonna use to get our datas are async
async function main() {
    const prisma = new PrismaClient()
    await prisma.product.deleteMany()

    await prisma.product.createMany({
        data: sampleData.products
    })

    console.log('Database seeded successfully.')
}

main()