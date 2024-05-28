
// import React, { useState,useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import WorngRequest from '../../pages/WorngRequest';
// import {getRequest} from '../../modules/requests/server_requests';

// function Product({ token }) {
//   const [ products, setProducts ]= useState();
//   const { nameProduct } = useParams();
//   const [worngRequest, setWorngRequest ] = useState(false);
//   useEffect(() => {
//     async function fatchData() {
//       let dataRequest = await getRequest(`http://localhost:3000/products/${nameProduct}`, token);
//       if (dataRequest.ok) {
//         console.log(dataRequest.body);
//         setProducts(dataRequest.body)
//       }
//       else {
//          setWorngRequest(true);
//       }
//     }
//     fatchData();
//   }, [worngRequest]);

//   return (
//     <div>
//       {worngRequest ? <WorngRequest className='wrongRequest' setWorngRequest={setWorngRequest} /> :
//         <div>
//           obo;v
//         </div>
//       }
//     </div>
//   );
// }

// export default Product;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WorngRequest from '../../pages/WorngRequest';
import { getRequest } from '../../modules/requests/server_requests';
import '../../css/product.css';
import Slider from '../product/Slider';
import SelectType from './SelectType'
import QuantityInput from './QuantityInput';
let prices={min:0, max:10};
const Product = ({ token, addToCart }) => {
  const [products, setProducts] = useState([]);
  const { nameProduct } = useParams();
  const [wrongRequest, setWrongRequest] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedType, setSelectedType] = useState('בחר סוג אריזה');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchData() {
      let dataRequest = await getRequest(`http://localhost:3000/products/${nameProduct}`, token);
      if (dataRequest.ok) {
        setProducts(dataRequest.body);
        prices = getMinMaxPrices(dataRequest.body);
      } else {
        setWrongRequest(true);
      }
    }
    fetchData();
  }, [nameProduct, token]);

  const handleTypeChange = (valueType) => {
    const selectedProductIndex = products.findIndex(product => product.package === valueType);
    const selectedProduct = products[selectedProductIndex];
    setCurrentProduct(selectedProduct);
    setCurrentSlide(selectedProductIndex);
  };

  const handleQuantityChange = (quantity) => {
    setQuantity(quantity);
  };

  const handleAddToCart = () => {
    const item = {
      ...currentProduct,
      quantity,
    };
    addToCart(item);
  };

  if (wrongRequest) {
    return <WorngRequest className='wrongRequest' setWrongRequest={setWrongRequest} />;
  }

  return (
    <div className="product">
      <div className="product-images">
        {products.length !== 0 && <Slider sliders={products} currentSlide={currentSlide} />}
      </div>
      <div className="product-details">
        <h3>{products.length !== 0 && products[0].name}</h3>
        <p className="product-price">
          {currentProduct ? currentProduct.price :prices.min==prices.max? `${prices.min}`: `${prices.min}-${prices.max}`}₪
        </p>
        <div className="product-options">
          <div className="product-type">
            <SelectType handleTypeChange={handleTypeChange} products={products} />
          </div>
          <div className="product-quantity">
            <label htmlFor="quantity">כמות</label>
            <QuantityInput quantity={quantity} handleQuantityChange={handleQuantityChange} />
          </div>
        </div>
        <button className="add-to-cart" onClick={handleAddToCart}>
          הוסף לעגלה
        </button>
      </div>
    </div>
  );
};

function getMinMaxPrices(products) {
  if (products.length === 0) return { min: 0, max: 0 };
  return products.reduce((acc, product) => {
    if (product.price < acc.min) acc.min = product.price;
    if (product.price > acc.max) acc.max = product.price;
    return acc;
  }, { min: products[0].price, max: products[0].price });
}

export default Product;