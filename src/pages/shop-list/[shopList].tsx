import { useRouter } from 'next/router'
import ShoppingLists from '.'

const ShopListDetails = () => {
  const router = useRouter()
  const { shopList: urlId } = router.query
  return <ShoppingLists urlId={urlId} />
}

export default ShopListDetails
