import DealCountdown from '@/components/deal-countdown'
import IconBoxes from '@/components/icon-boxes'
import ProductCarousel from '@/components/shared/product/product-carousel'
import ProductList from '@/components/shared/product/product-list'
import ViewAllProductsBtn from '@/components/view-all-products-btn'
import { getDealProductAction, getFeaturedProductsAction, getLatestProductsAction } from '@/lib/actions/product.actions'

export default async function page() {
  const latestProducts = await getLatestProductsAction()
  const featuredProducts = await getFeaturedProductsAction()
  const dealProudct = await getDealProductAction()

  return (
    <>
      {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList data={latestProducts} title='Newest Arrrivals' limit={4} />
      <ViewAllProductsBtn />
      {dealProudct && <DealCountdown data={dealProudct} />}
      <IconBoxes />
    </>
  )
}
