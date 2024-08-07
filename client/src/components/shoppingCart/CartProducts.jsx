import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import QuantityInput from '../product/QuantityInput';
import { getRequest, putRequest, deleteRequest } from '../../modules/requests/server_requests';
import WorngRequest from '../../pages/WorngRequest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../css/ShoppingCart.css';
import DeleteCart from './DeleteCart';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading'
import { useSelector, useDispatch } from 'react-redux';

function CartProducts({ setChosenCartProducts, setCountCartItems }) {
    let token = useSelector((state) => state.app.token);
    let user = useSelector((state) => state.app.user);
    let cartProducts = useSelector((state) => state.details.carts);
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [worngRequest, setWorngRequest] = useState(false);
    const [deleteOn, setDeleteOn] = useState(false);
    const [currentProductToDelete, setCurrentProductToDelete] = useState({});
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function getCart() {
            if (cartProducts.length === 0) {
                if (token === '' || !user) {
                    token = localStorage.getItem('token');
                    user = JSON.parse(localStorage.getItem('currentUser'));
                }
                const reqData = await getRequest(`http://localhost:3000/cart/${user.id}`, token);
                if (reqData.ok) {
                    const mergedProducts = await mergeProducts(reqData.body);
                    await dispatch({ type: 'SET_CARTS', payload: mergedProducts });
                    await setProducts(mergedProducts);
                    setCountCartItems(mergedProducts.length);
                    setLoading(false);
                } else {
                    setWorngRequest(true);
                }
            } else {
                await setProducts(cartProducts);
                setLoading(false);
            }
        }
        getCart();
    }, [worngRequest]);

    const mergeProducts = (products) => {
        const productMap = new Map();
        products.forEach((product) => {
            const key = `${product.name}-${product.package}`;
            if (productMap.has(key)) {
                const existingProduct = productMap.get(key);
                existingProduct.amount += product.amount;
            } else {
                productMap.set(key, { ...product });
            }
        });
        return Array.from(productMap.values());
    }

    const handleCheckboxChange = async (rowData) => {
        const updatedProducts = await Promise.all(products.map(async (product) => {
            if (product.id === rowData.id) {
                const item = {
                    amount: product.amount,
                    userId: user.id,
                    productId: product.productId,
                    choose: !product.choose,
                    id: product.id,
                };
                const reqData = await putRequest(`http://localhost:3000/cart/${item.id}`, item, token);
                if (!reqData.ok) {
                    alert('משהו השתבש בבקשה נסה שוב');
                } else {
                    return { ...product, choose: item.choose };
                }
            }
            return product;
        }));
        await setProducts(updatedProducts);
        await dispatch({ type: 'SET_CARTS', payload: updatedProducts });
    };

    const handleQuantityChange = async (value, rowData) => {
        const updatedProducts = await Promise.all(products.map(async (product) => {
            if (product.id === rowData.id) {
                const item = {
                    amount: value,
                    userId: user.id,
                    productId: product.productId,
                    choose: rowData.choose,
                    id: product.id
                };
                const reqData = await putRequest(`http://localhost:3000/cart/${item.id}`, item, token);
                if (!reqData.ok) {
                    alert('משהו השתבש בבקשה נסה שוב');
                } else {
                    return { ...product, amount: item.amount };
                }
            }
            return product;
        }));
        await setProducts(updatedProducts);
        await dispatch({ type: 'SET_CARTS', payload: updatedProducts });
    };

    async function handleOpenDeleteForm(e) {

        await setCurrentProductToDelete(e);
        await setDeleteOn(true);
    }

    async function deleteFunction(id) {
        const reqData = await deleteRequest(`http://localhost:3000/cart/${id}`, token);
        if (reqData.ok) {
            let updatedProducts = products.filter(product => product.id !== id);
            await setProducts(updatedProducts);
            await dispatch({ type: 'SET_CARTS', payload: updatedProducts });
        } else {
            alert('משהו השתבש בבקשה נסה שוב');
        }
    }

    async function handleContinueToOrder() {
        const chosenProducts = products.filter(product => product.choose);

        setChosenCartProducts(chosenProducts);
        navigate('/shopping_cart/order');
    }

    const handleRowDoubleClick = (e) => {
        const rowData = e.data;
        navigate(`/products/${rowData.name}`);
    };

    return (
        <>
            {loading && <Loading />}
            {worngRequest ? <WorngRequest setWorngRequest={setWorngRequest} /> :
                <div>
                    <div className='cartProducts'>
                        <DataTable value={products} className='tableWithImg' rowKey="id" showGridlines stripedRows tableStyle={{ minWidth: '596' }} onRowDoubleClick={handleRowDoubleClick}>
                            <Column className='column_cart' field="name" header="שם" style={{ width: '80px' }}></Column>
                            <Column className='column_cart image_column' field="img" header="תמונה" body={(rowData) => <img src={`data:image/png;base64,${rowData.img}`} alt={rowData.name} style={{ width: '50px' }} />} style={{ width: '80px' }}></Column>
                            <Column className='column_cart' field="price" header="מחיר" style={{ width: '80px' }}></Column>
                            <Column className='column_cart' field="package" header="סוג אריזה" style={{ width: '80px' }}></Column>
                            <Column className='column_cart' header={<FontAwesomeIcon icon="fas fa-clipboard-check" />} body={(rowData) => <input type="checkbox" checked={Boolean(rowData.choose)} onChange={() => handleCheckboxChange(rowData)} />} style={{ width: '80px' }}></Column>
                            <Column className='column_cart' header="כמות" body={(rowData) => <QuantityInput quantity={rowData.amount} handleQuantityChange={(value) => handleQuantityChange(value, rowData)} />} style={{ width: '80px' }}></Column>
                            <Column className='column_cart' header="מחק מהסל" body={(rowData) => <FontAwesomeIcon onClick={() => handleOpenDeleteForm(rowData)} icon="fas fa-trash-alt" />} style={{ width: '80px' }}></Column>
                        </DataTable>
                        <DataTable value={products} className='tableWithoutImg' rowKey="id" showGridlines stripedRows tableStyle={{ minWidth: '596' }} onRowDoubleClick={handleRowDoubleClick}>
                            <Column className='column_cart' field="name" header="שם" style={{ width: '80px' }}></Column>
                            <Column className='column_cart' field="price" header="מחיר" style={{ width: '80px' }}></Column>
                            <Column className='column_cart' field="package" header="סוג אריזה" style={{ width: '80px' }}></Column>
                            <Column className='column_cart' header={<FontAwesomeIcon icon="fas fa-clipboard-check" />} body={(rowData) => <input type="checkbox" checked={Boolean(rowData.choose)} onChange={() => handleCheckboxChange(rowData)} />} style={{ width: '80px' }}></Column>
                            <Column className='column_cart' header="כמות" body={(rowData) => <QuantityInput quantity={rowData.amount} handleQuantityChange={(value) => handleQuantityChange(value, rowData)} />} style={{ width: '80px' }}></Column>
                            <Column className='column_cart' header="מחק מהסל" body={(rowData) => <FontAwesomeIcon onClick={() => handleOpenDeleteForm(rowData)} icon="fas fa-trash-alt" />} style={{ width: '80px' }}></Column>
                        </DataTable>
                    </div>
                    <button className='orderButton' onClick={handleContinueToOrder}>המשך להזמנה</button>
                </div>
            }
            {deleteOn && <DeleteCart setCountCartItems={setCountCartItems} currentProductToDelete={currentProductToDelete} deleteFunction={deleteFunction} setdeleteOn={setDeleteOn} />}
        </>
    )
}

export default CartProducts;
