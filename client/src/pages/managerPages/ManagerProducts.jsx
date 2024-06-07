import React, { useEffect, useState } from 'react';
import { getRequest } from '../../modules/requests/server_requests';
import WorngRequest from '../WorngRequest';
import FullProduct from '../../components/product/FullProduct';
import AddProduct from '../../components/product/AddProduct';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import '../../css/managerProducts.css';

function ManagerProducts({ status, token, products, setProducts, setProductsHandler }) {
  const [wrongRequest, setWorngRequest] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function getProducts() {
      const responseData = await getRequest('http://localhost:3000/products', token);
      if (responseData.ok) {
        await setProducts(responseData.body);
      } else {
        alert('בעיה בטעינת הנתונים. נסה שוב');
      }
    }
    getProducts();
  }, [token, setProducts]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {wrongRequest ? <WorngRequest className='wrongRequest' setWorngRequest={setWorngRequest} /> :
        <div>
          <div className="searchContainer">
            <FontAwesomeIcon icon={faSearch} className="searchIcon" />
            <input
              type="text"
              placeholder="חפש מוצר..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="searchInput"
            />
          </div>
          <div className="allProducts">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((productData) => (
                <FullProduct className="fullProduct"
                  token={token}
                  status={status}
                  productData={productData}
                  key={productData.id}
                  setProductsHandler={setProductsHandler}
                />
              ))
            ) : (
              <div className="noProductsMessage">לא נמצאו מוצרים תואמים</div>
            )}
          </div>
          <Tooltip className="add_product_button"   onClick={() => setAddProduct(true)} describeChild title='הוסף מוצר'>
            <FontAwesomeIcon icon={faPlusSquare} className='addIcon'/>
          </Tooltip>
          {addProduct && <AddProduct  token={token} setAddProduct={setAddProduct} setProductsHandler={setProductsHandler} />}
        </div>}
    </div>
  );
}

export default ManagerProducts;
