import { Outlet, useLocation } from 'react-router-dom';
import { CollectionAll } from '../../components/collectionAll/CollectionAll';
import SVGSpotlight from '../../components/SVGSpotlight/SVGSpotlight';

export const CollectionPage = () => {
  const location = useLocation();
  const isBaseCollection = location.pathname === '/collection';

  return (
    <div>
      {isBaseCollection && <CollectionAll />}
      <Outlet />
      <SVGSpotlight />
    </div>
  );
};
