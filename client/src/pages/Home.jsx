import React from 'react'
import { useState ,useEffect} from 'react';
import '../css/home.css';
import ProductShort from '../components/product/ProductShort'
import WorngRequest from '../pages/WorngRequest';
import {getRequest} from '../modules/requests/server_requests'
let products;
function Home({ status ,token}) {
  const [showProducts, setShowProducts] = useState([]);
  const [wrongRequest, setWrongRequest] = useState(false);
  useEffect(() => {
    async function fatchData() {
      if(token=="")
        {
          
        }
      let dataRequest = await getRequest(`http://localhost:3000/products/shortList`,token);
      if (dataRequest.ok) {
        products = dataRequest.body;
        setShowProducts(products);
      }
      else {
        setWrongRequest(true);
      }
    }
    fatchData();
  }, [wrongRequest]);
  return (

   wrongRequest ? <WorngRequest setWrongRequest={setWrongRequest} /> :
        <div className="allProducts">
          {showProducts.length > 0 && showProducts.map((productData) => {
           return <ProductShort className="productShort" productData={productData}  key={productData.id} status={status} />;
          })}
       </div>
  )
}

export default Home
