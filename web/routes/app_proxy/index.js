import { Router } from 'express';
import { create } from 'xmlbuilder2';


function extractShopName(url) {
  const match = url.match(/(?:https:\/\/)?(.*?)\.myshopify\.com/);
  return match ? match[1] : null;
}

function generateGoogleShoppingXML(products, shop) {
  const shopName = extractShopName(shop);

  const xml = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('rss', { 'xmlns:g': 'http://base.google.com/ns/1.0', version: '2.0' })
      .ele('channel')
        .ele('title', shopName)
        .up()
        .ele('link', shop)
        .up()
        .ele('description').txt(`${shopName} products`)
        .up();


  products.forEach(product => {
    xml.ele('item')
      .ele('g:id', product.id)
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