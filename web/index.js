// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import { prisma, verifyProxy } from "./middleware/verifyProxy.js";
import { proxyRouter } from "./routes/app_proxy/index.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.use("/proxy_route", verifyProxy, proxyRouter);

app.get("/api/products/all", async (_req, res) => {
  const products = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(products);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post('/api/products/config', async (_req, res) => {
  const shop = res.locals.shopify?.session.shop
  if (!shop) {
    return res.status(400).json({ success: false, message: "Shop information is missing." });
  }

  const shopData = await new shopify.api.clients.Graphql({ session: res.locals.shopify.session }).query({
    data: `query {
      shop {
        currencyCode
      }
    }`,
  });

  console.log('shopData', shopData?.body?.data?.shop.currencyCode)

  const url = `https://${shop}/apps/google-shopping-pix/products`;

  try {

    await prisma.xMLConfig.upsert({
      where: {
        shop: shop,
      },
      update: {
        ..._req.body,
        currencyCode: shopData?.body?.data?.shop.currencyCode
      },
      create: {
        shop: shop,
        ..._req.body,
        currencyCode: shopData?.body?.data?.shop.currencyCode
      }
    });

    res.status(200)
      .json({ body: { url }, success: true });
  } catch(e) {
    console.log('error', e);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
