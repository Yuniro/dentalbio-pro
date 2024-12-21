import { useState } from 'react';

const Shop = () => {
  const [isShopVisible, setIsShopVisible] = useState(false);

  const toggleShop = () => {
    setIsShopVisible(!isShopVisible);
  };

  return (
    <div>
      <button onClick={toggleShop} className="shop-link">Toggle Shop</button>
      {isShopVisible && (
        <div className="shop-cards">
          {/* Your shop card content */}
        </div>
      )}
    </div>
  );
};

export default Shop;
