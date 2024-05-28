const DB_actions = require('../DB_access/productsDB_handler');
const { getProductByName } = require('../api/controllers/productsController');
const converts = require('../modules/converts');

const ProductsServices = {
    createProduct: async (product) => {
        return await DB_actions.createProduct(product);
    },

    getAllProducts: async () => {
        const products = await DB_actions.getAllProducts();
        const updatedProducts = await Promise.all(products.map(async (product) => {
            const { imgUrl, ...productWithoutImg } = product;
            const img = await converts.convertUrlToImageFile(product.imgUrl);
            return { ...productWithoutImg, img: img };
        }));
        return updatedProducts;
    },
    getAllShortListProducts: async () => {
        const products = await DB_actions.getAllShortListProducts();
        const updatedProducts = await Promise.all(products.map(async (product) => {
            const { imgUrl, ...productWithoutImg } = product;
            const img = await converts.convertUrlToImageFile(product.imgUrl);
            return { ...productWithoutImg, img: img };
        }));
        return updatedProducts;
    },

    getProductByName: async (name) => {
        const products = await DB_actions.getProductByName(name);
        const updatedProducts = await Promise.all(products.map(async (product) => {
            const { imgUrl, ...productWithoutImg } = product;
            const img = await converts.convertUrlToImageFile(product.imgUrl);
            return { ...productWithoutImg, img: img };
        }));
        return updatedProducts;
    },

    updateProduct: async (updatedProductData) => {
        return await DB_actions.updateProduct(updatedProductData);
    },

    deleteProduct: async (id) => {
        await DB_actions.deleteProduct(id);
    },
    getProductByNameAndPackage: async (name, package) => {
        const product = await DB_actions.getProductByNameAndPackage(name, package);
        return product;
    },
    getNextProductId: async()=>{
        const id = await DB_actions.getNextProductId();
        return id;
    }
};

module.exports = ProductsServices;
