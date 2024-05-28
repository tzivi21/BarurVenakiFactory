import * as React from 'react';
import { NavLink } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../css/productShort.css'
import { getRequest } from '../../modules/requests/server_requests';
import { useState } from 'react';
import DeleteProduct from './DeleteProduct';

export default function ProductShort({ productData, status, showProducts, setShowProducts, token }) {
  const [deleteOn, setDeleteOn] = useState(false);

  console.log(productData);

  function handleEdit(event) {
    event.stopPropagation()

  }

  async function handleDelete(event) {
    event.stopPropagation()
    await setDeleteOn(true);
  }

  return (
    <>
      <div>
        <NavLink to={`${productData.name}`}>
        <Card sx={{ maxWidth: 345 }} >
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={`data:'image/png';base64,${productData.img}`}
              alt={productData.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {productData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {productData.minPrice == productData.maxPrice ?
                  <h5>מחיר {productData.minPrice}</h5> :
                  <p>טווח מחירים {productData.minPrice}-{productData.maxPrice}₪</p>
                }
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Tooltip describeChild title={status == "manager" ? "ערוך" : "הוסף לסל הקניות"}>
              {/* <NavLink to={`products/${productData.name}`}><Button size="small" color="primary"> */}
              {status == "manager" ?
                <FontAwesomeIcon icon="fas fa-pencil-alt" onClick={(e) => handleEdit(e)} />
                :
                <FontAwesomeIcon icon="fas fa-shopping-cart" />
              }
              {/* </Button>
              </NavLink> */}
            </Tooltip>
            <Tooltip describeChild title='מחק'>
              {/* <NavLink to={`products/${productData.name}`}><Button size="small" color="primary"> */}

              <FontAwesomeIcon icon="fas fa-trash" onClick={(e) => handleDelete(e)} />

              {/* </Button>
              </NavLink> */}
            </Tooltip>
          </CardActions>
        </Card>
        </NavLink>
      </div>
      {deleteOn && <DeleteProduct setDeleteOn={setDeleteOn} showProducts={showProducts} setShowProducts={setShowProducts} token={token} productsName={productData.name} />}
   
    </>
  );
}