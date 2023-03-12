// app에서는 Shop class 내 클래스를 화면에 그릴 때, 수동으로 render 해주었기 때문에
// 여기서는 그 부분을 개선해 볼 것임
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
    constructor(renderHookId, shouldRender = true) {
        this.hookId = renderHookId;if (shouldRender) {
            this.render();
        }

    }

    render() {

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
    // products 프로퍼티를 외부에서 설정할 수 없다는 것을 명확히 하고 싶다면 (products는 ProductList 내부에서만 사용 가능)
    // JavaScript에서는 앞에 # 기호를 입력
    // 클래스의 내부 또는 객체의 내부에서
    // 이것을 반환하거나 private 프로퍼티로 설정
    #products = [];
    constructor(renderHookId) {
        super(renderHookId, false);
        this.render();
        this.fetchProducts();
    }

    fetchProducts() {
        this.#products = [
            new Product('product A', 'https://picsum.photos/id/2/700/300', 'a desc',19.99),
            new Product('product B', 'https://picsum.photos/id/48/700/300', 'B desc',89.99)
        ];
        this.renderProducts();
    }

    renderProducts() {
        for (const prod of this.#products) {
            new ProductItem(prod, 'prod-list');
        }
    }
    render() {
        this.creatRootElement('ul', 'prod-list', [new ElementAttribute('id', 'prod-list')]);
        if (this.#products && this.#products.length > 0) {
            this.renderProducts();
        }
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
        super(renderHookId, false);
        // 화살표 함수는 this에 바인딩 되는지 상관하지 않음
        // 결국 클래스에 의해 만들어진 객체를 참조
        this.orderProducts = () => {
            console.log('ordering...');
            console.log(this.items);
        }
        this.render();
    }
    addProduct(product) {
        const updatedItems = [...this.items];
        updatedItems.push(product);
        this.cartItems = updatedItems;
    }


    render() {
        const cartEl = this.creatRootElement('section', 'cart');
        cartEl.innerHTML = `
            <h2>Total: \$${0}</h2>
            <button>Order Now!</button>
        `;
        const orderButton = cartEl.querySelector('button');
        orderButton.addEventListener('click', this.orderProducts)
        this.totalOutput = cartEl.querySelector('h2');
    }
}
class ProductItem extends Component {
    product;
    constructor(product, renderHookId) {
        super(renderHookId, false);
        this.product = product;
        this.render();
    }

    addToCart() {
        App.addProductToCart(this.product);
    }

    render() {
        const prodEl = this.creatRootElement('li', "product-item")
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

class Shop extends Component {
    constructor() {
        super();
    }
    render() {
        this.cart = new ShoppingCart('app');
        new ProductList('app');
    }
}

class App {
    static cart;
    static init() {
        const shop = new Shop();
        this.cart = shop.cart;
    }
    //App 클래스와 정적 메서드를 프록시로 사용
    static addProductToCart(product) {
        this.cart.addProduct(product);
    }
}

App.init();
