import { Router } from 'express';
import { create } from 'xmlbuilder2';


function extractShopName(url) {
  const match = url.match(/(?:https:\/\/)?(.*?)\.myshopify\.com/);
  return match ? match[1] : null;
}

function generateGoogleShoppingXML(products, shop) {
  const shopName = extractShopName(shop);

  const xml = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('feed', 
      { 
        'xmlns': 'http://www.w3.org/2005/Atom',
        'xmlns:g': 'http://base.google.com/ns/1.0', 
        'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
        'xsi:schemaLocation': "http://schemas.google.com/merchant_reviews/5.0 https://www.gstatic.com/productsearch/static/reviews/5.0/merchant_reviews.xsd",
        version: '2.0' 
      }
    )

  products.forEach(product => {
    xml.ele('entry')
      .ele('g:id').txt(`<![CDATA[ ${product.id} ]]>`)
      .up()
      .ele('g:title').txt(product.title)
      .up()
      .ele('g:description').txt(product.description)
      .up()
      .ele('g:link').txt(product.link)
      .up()
      .ele('g:image_link').txt(product.imageLink)
      .up()
      .ele('g:price').txt(product.price)
      .up()
      .ele('g:availability').txt(product.availability)
      .up()
      .ele('g:brand').txt(product.brand)
      .up();
  });

  return xml.end({ prettyPrint: true });
}

export const proxyRouter = Router();

proxyRouter.get('/products', async (_req, res) => {  
  const products = res.locals.products.data.map((product) => {
    return {
      id: product.id,
      title: product.title,
      description: product.body_html,
      link: `https://${res.locals.user_shop}/products/${product.title?.toLowerCase().replace(/ /g, '-')}`,
      imageLink: product.image?.src,
      price: product.variants[0].price * 0.95,
      availability: product.variants[0].inventory_quantity > 0 ? 'in stock' : 'out of stock',
      brand: product.vendor,
    };
  });

  const xml = generateGoogleShoppingXML(products, res.locals.user_shop);

  return res.set('Content-Type', 'text/xml').status(200).send(xml);
}); 

// `
//     <item>
//       <g:id>${variant.id}</g:id>
//       <g:title>${product.title} - ${variant.title}</g:title>
//       <g:description>${product.body_html}</g:description>
//       <g:link>http://www.example.com/product/${product.handle}</g:link>
//       <g:image_link>${product.image.src}</g:image_link>
//       <g:availability>${product.status === 'active' ? 'in stock' : 'out of stock'}</g:availability>
//       <g:price>${variant.price} USD</g:price>
//       <g:brand>${product.vendor}</g:brand>
//       <g:google_product_category>Gift Cards</g:google_product_category>
//       
//       <g:gtin>${variant.sku}</g:gtin>
//       <g:mpn>${variant.sku}</g:mpn>

//       <g:condition>new</g:condition>

//       <g:adult>false</g:adult>

//       <g:shipping>
//         <g:country>US</g:country>
//         <g:service>Standard</g:service>
//         <g:price>5.99 USD</g:price>
//       </g:shipping>
//     </item>
// `;

const a = {
  "id": 8570918109483,
  "title": "Gift Card",
  "description": "This is a gift card for the store",
  "vendor": "Snowboard Vendor",
  "handle": "gift-card",
  "status": "active",
  "published_scope": "web",
  "variants": [
    {
      "id": 46425722716459,
      "title": "$10",
      "price": "10.00",
      "position": 1,
      "fulfillment_service": "gift_card",
      "weight_unit": "kg"
    },
    {
      "id": 46425722749227,
      "title": "$25",
      "price": "25.00",
      "position": 2,
      "fulfillment_service": "gift_card",
      "weight_unit": "kg"
    },
    {
      "id": 46425722781995,
      "title": "$50",
      "price": "50.00",
      "position": 3,
      "fulfillment_service": "gift_card",
      "weight_unit": "kg"
    },
    {
      "id": 46425722847531,
      "title": "$100",
      "price": "100.00",
      "position": 4,
      "fulfillment_service": "gift_card",
      "weight_unit": "kg"
    }
  ],
  "options": [
    {
      "id": 10836518306091,
      "name": "Denominations",
      "position": 1
    }
  ],
  "images": [
    {
      "id": 42228286751019,
      "position": 1,
      "alt": "Gift card that shows text: Generated data gift card",
      "width": 2881,
      "height": 2881,
      "src": "https://cdn.shopify.com/s/files/1/0815/9497/4507/products/gift_card.png?v=1692261344"
    }
  ],
  "image": {
    "id": 42228286751019,
    "position": 1,
    "alt": "Gift card that shows text: Generated data gift card",
    "width": 2881,
    "height": 2881,
    "src": "https://cdn.shopify.com/s/files/1/0815/9497/4507/products/gift_card.png?v=1692261344"
  }
};
