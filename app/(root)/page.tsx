import ProductList from '@/components/shared/product/product-list'
import { getLatestProductsAction } from '@/lib/actions/product.actions'

export default async function page() {
  const latestProducts = await getLatestProductsAction()

  return (
    <>
      <ProductList data={latestProducts} title='Newest Arrrivals' limit={4} />
    </>
  )
}
