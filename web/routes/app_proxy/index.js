import { Router } from 'express';
import shopify from '../../shopify.js';
import axios from 'axios';

export const proxyRouter = Router();

proxyRouter.get('/products', async (_req, res) => {
  console.log('locals >>', _req.query)
  // try {
  //   const data = axios.get('https://google-shopping-pix-feature.myshopify.com/admin/api/2021-07/products.json')
  //   // console.log('data ', data)
  // } catch (e) {
  //   console.log('error')
  // }
  return res.status(200).send({ content: "Products list" });
}); 