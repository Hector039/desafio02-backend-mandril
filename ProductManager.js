import fs from "fs";

class Product {
    constructor(id, title, description, price, thumbnail, code, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    static ultimoId = 0;

    constructor() {
        this.path = "./archivoProductos.json";
        this.products = [];
    }

    async addProduct(title, description, price, thumbnail, code, stock) {//validar que no se repita el campo "code" y que todos los campos sean obligatorios. id autoincrementable

        try {
            const readingFile = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
            this.products = [...readingFile];
        } catch {
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(this.products));
            } catch (error) {
                console.log("Se produjo un error creando el archivo", error.name);
            }
        }

        const isInProducts = this.products.some(product => product.code === code);

        if (isInProducts) {
            console.log("Codigo Ingresado existente, por favor ingrese uno diferente");
        } else if (title === undefined || description === undefined || price === undefined || thumbnail === undefined || code === undefined || stock === undefined) {
            console.log("Faltan ingresar campos.");
        } else {

            const totalIds = this.products.reduce((acumulador, producto) => acumulador + producto.id, 0);

            ProductManager.ultimoId++;

            const product = new Product(ProductManager.ultimoId + totalIds, title, description, price, thumbnail, code, stock);

            this.products.push(product);

            try {
                await fs.promises.writeFile(this.path, JSON.stringify(this.products));
            } catch (error) {
                console.log("Se produjo un error creando el producto nuevo", error.name);
            }

            console.log("Se ingresó el producto correctamente");
        }
    }

    async getProducts() {
        try {
            const result = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
            console.log(result);

        } catch (error) {
            console.log("error al leer el archivo", error.name);
        }
    }

    async getProductById(id) {
        try {
            const readingFile = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
            const isInProducts = readingFile.some(product => product.id === id);
            
            if (isInProducts) {
                const productFind = readingFile.find(product => product.id === id);
                console.log(productFind);
            } else {
                console.log("No se encontró el producto, intente con otro ID");
            }
        } catch (error) {
            console.log("error al leer el archivo", error.name);
        }
    }

    async updateProduct(id, newPrice) {//actulizamos precio del producto, con ID y el precio nuevo
        try {
            const temporalFile = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
            const isInProducts = temporalFile.some(product => product.id === id);

            if (isInProducts) {
                temporalFile.forEach((product) => {
                    if (product.id === id) {
                        product.price = newPrice;
                        console.log("Se actualizó el precio:", newPrice, "del producto ID:", id);
                    }
                })
            } else {
                console.log("No se encontró el ID:", id);
            }

            try {
                await fs.promises.writeFile(this.path, JSON.stringify(temporalFile));
            } catch (error) {
                console.log("Se produjo un error creando el producto nuevo", error.name);
            }

        } catch (error){
            console.log("Error al buscar arhivo.", error.name);
        }
    }

    async deleteProduct(id) {
        try {
            const temporalFile = JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
            const isInProducts = temporalFile.some(product => product.id === id);
            if (isInProducts) {
                const dataFiltered = temporalFile.filter((product) => product.id !== id);

                try {
                    await fs.promises.writeFile(this.path, JSON.stringify(dataFiltered));
                } catch (error) {
                    console.log("Se produjo un error creando el producto nuevo", error.name);
                }

                console.log("Se eliminó el producto de id:", id);
            } else {
                console.log("No se encontró el ID:", id);
            }
        } catch (error) {
            console.log("Error al buscar arhivo.", error.name)
        }
    }

}

const productManager = new ProductManager();

await productManager.addProduct(
    "Silla de Oficina",
    "Silla de oficina ergonómica",
    65000,
    "https://dummyimage.com/600x400/000/fff",
    "sillaCod00",
    5
);

await productManager.addProduct(
    "Escritorio de Oficina",
    "Escritorio de oficina de madera",
    102000,
    "https://dummyimage.com/600x400/000/fff",
    "escritorioCod00",
    2
);

await productManager.addProduct(
    "Armario de Oficina",
    "Armario de Pino",
    156000,
    "https://dummyimage.com/600x400/000/fff",
    "armarioCod00",
    1
);

await productManager.getProducts();

await productManager.getProductById(5);

await productManager.updateProduct(1, 10000);

await productManager.deleteProduct(7);

