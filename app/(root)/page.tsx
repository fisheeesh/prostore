import ProductList from '@/components/shared/product/product-list'
import sampleData from '@/db/sample-data'

export default function page() {
  console.log(sampleData)
  return (
    <>
      <ProductList data={sampleData.products} title='Newest Arrrivals' limit={4} /></>
  )
}
