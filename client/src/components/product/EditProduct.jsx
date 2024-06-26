import React, { useState, useEffect, useRef } from 'react';
import { putRequest } from '../../modules/requests/server_requests_special';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../css/editProduct.css';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import SelectProductType from './SelectProductType';

const EditProduct = ({ setProductsHandler, setEditOn, productData }) => {
    const token = useSelector((state) => state.app.token);

    const [formData, setFormData] = useState(productData);
    const op = useRef(null);


    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setFormData({
            ...formData,
            img: file
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleChangeType = (value) => {
        setFormData({
            ...formData,
            package: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const productDataUpdate = new FormData();
            for (const key in formData) {
                if (key === 'img' && formData[key] && formData[key].name) {
                    productDataUpdate.append(key, formData[key]);
                } else if (key !== 'img') {
                    productDataUpdate.append(key, formData[key]);
                }
            }

            if (formData.img && !formData.img.name) {
                const blob = new Blob([new Uint8Array(atob(formData.img).split('').map(char => char.charCodeAt(0)))], { type: 'image/png' });
                productDataUpdate.append('img', blob, 'image.png');
            }

            const dataRequest = await putRequest(`http://localhost:3000/products/${productData.id}`, productDataUpdate, token);
            if (dataRequest.ok) {
                await setProductsHandler("update", dataRequest.body.newProduct.id, dataRequest.body.newProduct);
                setEditOn(false);
            } else {
                alert('שגיאה בבקשה נסה שוב');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('שגיאה.');
        }
    };

    return (
        <>
            <div className='overlay' onClick={() => setEditOn(false)} />
            <div className='editProduct_container'>
                <FontAwesomeIcon className='exit' icon="fas fa-times" onClick={() => setEditOn(false)} />
                <form onSubmit={handleSubmit} className='createProduct_form'>
                    <label htmlFor="name">שם</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

                    <label htmlFor="weight">משקל</label>
                    <input type="text" id="weight" name="weight" value={formData.weight} onChange={handleChange} required />

                    <SelectProductType handleChangeType={handleChangeType} value={formData.package} />

                    <label htmlFor="imageFile">תמונת מוצר</label>
                    <input type="file" id="imageFile" name="imageFile" onChange={handleFileChange} accept="image/*" />

                    {formData.img && !formData.img.name && <>
                        <Button type="button" icon="pi pi-image" label="תמונה נוכחית" onClick={(e) => op.current.toggle(e)} />
                        <OverlayPanel ref={op} >
                            <img className='current_photo' style={{ width: "30vw", height: "20vh", margin: "auto" }} src={`data:image/png;base64,${formData.img}`} alt={formData.name}></img>
                        </OverlayPanel>
                    </>}

                    <label htmlFor="price">מחיר</label>
                    <input type="text" id="price" name="price" value={formData.price} onChange={handleChange} required />

                    <label htmlFor="inventory">מלאי</label>
                    <input type="text" id="inventory" name="inventory" value={formData.inventory} onChange={handleChange} required />

                    <input type="submit" value="עדכון מוצר" />
                </form>
            </div>
        </>
    );
};

export default EditProduct;
