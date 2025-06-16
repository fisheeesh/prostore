import { getMyFavorites } from "@/lib/actions/favorite.actions"
import FavoritesTable from "./favorites-table"

export default async function FavoritePage() {
    const favorites = await getMyFavorites()

    return (
        <div className='space-y-2'>
            <h2 className="h2-bold">Favorites</h2>
            <FavoritesTable favorites={favorites} />
        </div>
    )
}
