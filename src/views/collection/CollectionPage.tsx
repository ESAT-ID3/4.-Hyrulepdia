import { Outlet, useLocation } from "react-router-dom"
import { CollectionAll } from "../../components/collectionAll/CollectionAll"


export const CollectionPage = () => {
    const location = useLocation();
    const isBaseCollection = location.pathname === "/collection";

    return (
        <div>
            {isBaseCollection && <CollectionAll />}
            <Outlet/>
        </div>
    )
}