
class Product {
    // 클래스 필드
    title = 'DEFAULT';
    imageUrl;
    description;
    price;

    constructor(title, image, desc, price) {
        // 클래스 속성 (property)
        this.title = title;
        this.imageUrl = image;
        this.description = desc;
        this.price = price;
    }
}
class Component {
    constructor(renderHookId) {
        this.hookId = renderHookId;
    }

    creatRootElement(tag, cssClasses, attributes) {
        const rootElement = document.createElement(tag);
        if (cssClasses) {
            rootElement.className = cssClasses;
        }
        if (attributes && attributes.length > 0) {
            for (const attr of attributes) {
                rootElement.setAttribute(attr.name, attr.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return rootElement;
    }
}

class ProductList extends Component {
    products = [
        new Product('product A', 'https://picsum.photos/id/2/700/300', 'a desc',19.99),
        new Product('product B', 'https://picsum.photos/id/48/700/300', 'B desc',89.99)
    ];

    constructor(renderHookId) {
        super(renderHookId);
    }

    render() {

        // const prodList = document.createElement('ul');
        this.creatRootElement('ul', 'prod-list', [new ElementAttribute('id', 'prod-list')]);
        // prodList.id = 'prod-list'
        // prodList.className = 'product-list';
        for (const prod of this.products) {
            const productItem = new ProductItem(prod, 'prod-list');
            productItem.render();
            // prodList.append(prodEl);
        }
        // return prodList;
    }
}

class ElementAttribute {
    constructor(attrName, attrValue) {
        this.name = attrName;
        this.value = attrValue;
    }

}

class ShoppingCart extends Component {
    items = [];

    set cartItems(value) {
        this.items = value;
        this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(2)}</h2>`

    }
    get totalAmount() {
        const sum = this.items.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.price;
        }, 0)
        return sum;
    }
    constructor(renderHookId) {
        super(renderHookId);
    }
    addProduct(product) {
        const updatedItems = [...this.items];
        updatedItems.push(product);
        this.cartItems = updatedItems;
    }
    render() {
        const cartEl = this.creatRootElement('section', 'cart');
        // const cartEl = document.createElement('section');
        cartEl.innerHTML = `
            <h2>Total: \$${0}</h2>
            <button>Order Now!</button>
        `;
        // cartEl.className = 'cart';
        this.totalOutput = cartEl.querySelector('h2');
        // return cartEl;
    }
}
class ProductItem extends Component {
    product;
    constructor(product, renderHookId) {
        super(renderHookId);
        this.product = product;
    }

    addToCart() {
        App.addProductToCart(this.product);
    }

    render() {
        // const prodEl = document.createElement("li");
        const prodEl = this.creatRootElement('li', "product-item")
        // prodEl.className = 'product-item';

        prodEl.innerHTML = `
                <div>
                    <img src="${this.product.imageUrl}" alt="${this.product.title}"/>
                    <div class="product-item__content">
                        <h2>${this.product.title}</h2>
                        <h3>\$${this.product.price}</h3>
                        <p>${this.product.description}</p>
                        <button>Add to Cart</button>
                    </div>
                </div>
            `;
        const addCartBtn = prodEl.querySelector('button');
        addCartBtn.addEventListener('click', this.addToCart.bind(this)); //this는 ProductItem 객체를 뜻함
        // addCartBtn.addEventListener('click', this.addToCart); => 이렇게 하면 버튼에 바인딩
        // [참고]  JavaScript는 이벤트 소스에 this를 바인딩,
        // 윗 줄 처럼 하면 나중에 효과적으로 실행되는 객체나 클래스가 아니라  버튼에 바인딩
        // return prodEl;
    }
}

class Shop {
    render() {
        // const renderHook = document.getElementById("app");
        this.cart = new ShoppingCart('app');
        this.cart.render();
        const productList = new ProductList('app');
        productList.render();

        // renderHook.append(cartEl);
        // renderHook.append(prodListEl);

    }
}

class App {
    static cart;
    static init() {
        const shop = new Shop();
        shop.render();
        this.cart = shop.cart;
    }
    //App 클래스와 정적 메서드를 프록시로 사용
    static addProductToCart(product) {
        this.cart.addProduct(product);
    }
}

App.init();
