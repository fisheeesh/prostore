import ProductCarousel from '@/components/shared/product/product-carousel'
import ProductList from '@/components/shared/product/product-list'
import { getFeaturedProductsAction, getLatestProductsAction } from '@/lib/actions/product.actions'

export default async function page() {
  const latestProducts = await getLatestProductsAction()
  const featuredProducts = await getFeaturedProductsAction()

  return (
    <>
      {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList data={latestProducts} title='Newest Arrrivals' limit={4} />
    </>
  )
}
