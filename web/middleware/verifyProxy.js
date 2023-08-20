import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import shopify from "../shopify.js";

const prisma = new PrismaClient();

export const verifyProxy = async (req, res, next) => {
  console.log('req._parsedUrl:', req._parsedUrl);
  const { signature } = req.query;
  const queryURI = req._parsedUrl.query
    .replace("/?", "")
    .replace(/&signature=[^&]*/, "")
    .split("&")
    .map((x) => decodeURIComponent(x))
    .sort()
    .join("");

  const calculatedSignature = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(queryURI, "utf-8")
    .digest("hex");
    
  if (calculatedSignature === signature) {
    res.locals.user_shop = req.query.shop;
    const session = await prisma.session.findFirst({
      where: {
        shop: req.query.shop,
      }
    });
    const products = await shopify.api.rest.Product.all({
      session,
    });
    res.locals.products = products;
    next();
  } else {
    res.send(401);
  }
};
