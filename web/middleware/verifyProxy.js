import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import shopify from "../shopify.js";

export const prisma = new PrismaClient();

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
    const configs = await prisma.xMLConfig.findUnique({
      where: {
        shop: req.query.shop,
      }
    });
    const session = await prisma.session.findFirst({
      where: {
        shop: req.query.shop,
      }
    });
    const products = await shopify.api.rest.Product.all({
      session,
    });
    res.locals.products = products;
    res.locals.configs = configs;
    next();
  } else {
    res.send(401);
  }
};

// <entry>
// <g:id>
// <![CDATA[ shopify_BR_6668620660839_39752409841767 ]]>
// </g:id>
// <variant_id>39752409841767</variant_id>
// <variant_sku>
// <![CDATA[ PRTN012MC ]]>
// </variant_sku>
// <g:item_group_id>6668620660839</g:item_group_id>
// <title>
// <![CDATA[ Whey Protein Woman - 450g - Milkshake de Chocolate ]]>
// </title>
// <title_org>
// <![CDATA[ Whey Protein Woman - 450g ]]>
// </title_org>
// <g:image_link>
// <![CDATA[ https://cdn.shopify.com/s/files/1/0273/2323/6455/products/WHEY_WOMAN_450g_01_89779308-9ed1-4588-8c50-b763b7011e3c.jpg?v=1656529524 ]]>
// </g:image_link>
// <g:brand>
// <![CDATA[ Iridium Labs ]]>
// </g:brand>
// <description>
// <![CDATA[ Com 32g de proteína por dose, 15g de colágeno BODYBALANCE™ e zero açúcar, aumenta a performance atlética, favorece a definição muscular e reduz a gordura corporal. ]]>
// </description>
// <link>
// <![CDATA[ https://www.iridiumlabs.com.br/products/iridium-whey-woman-450g?variant=39752409841767&currency=BRL&utm_source=google&utm_medium=cpc&utm_campaign=google+shopping ]]>
// </link>
// <g:condition>
// <![CDATA[ new ]]>
// </g:condition>
// <g:sale_price>
// <![CDATA[ 149.90 BRL ]]>
// </g:sale_price>
// <g:price>
// <![CDATA[ 149.90 BRL ]]>
// </g:price>
// <inventory_quantity>199</inventory_quantity>
// <inventory>199</inventory>
// <taxable>
// <![CDATA[ yes ]]>
// </taxable>
// <g:mpn>
// <![CDATA[ PRTN012MC ]]>
// </g:mpn>
// <g:product_type>
// <![CDATA[ Produto ]]>
// </g:product_type>
// <g:shipping_weight>
// <![CDATA[ 576 g ]]>
// </g:shipping_weight>
// <g:gtin>
// <![CDATA[ 7899732112593 ]]>
// </g:gtin>
// <g:identifier_exists>
// <![CDATA[ TRUE ]]>
// </g:identifier_exists>
// <inventory_management>
// <![CDATA[ shopify ]]>
// </inventory_management>
// <inventory_policy>
// <![CDATA[ deny ]]>
// </inventory_policy>
// <g:availability>
// <![CDATA[ in stock ]]>
// </g:availability>
// <category1_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/categorias ]]>
// </category1_url>
// <category1_title>
// <![CDATA[ Categorias ]]>
// </category1_title>
// <category1_breadcrumbs>
// <![CDATA[ Categorias ]]>
// </category1_breadcrumbs>
// <category2_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/whey-protein ]]>
// </category2_url>
// <category2_title>
// <![CDATA[ Whey Protein ]]>
// </category2_title>
// <category2_breadcrumbs>
// <![CDATA[ Whey Protein ]]>
// </category2_breadcrumbs>
// <category3_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/objetivos ]]>
// </category3_url>
// <category3_title>
// <![CDATA[ Objetivos ]]>
// </category3_title>
// <category3_breadcrumbs>
// <![CDATA[ Objetivos ]]>
// </category3_breadcrumbs>
// <category4_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/hipertrofia ]]>
// </category4_url>
// <category4_title>
// <![CDATA[ Massa Muscular ]]>
// </category4_title>
// <category4_breadcrumbs>
// <![CDATA[ Massa Muscular ]]>
// </category4_breadcrumbs>
// <category5_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/all ]]>
// </category5_url>
// <category5_title>
// <![CDATA[ Todos os Produtos ]]>
// </category5_title>
// <category5_breadcrumbs>
// <![CDATA[ Todos os Produtos ]]>
// </category5_breadcrumbs>
// <category6_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/menu ]]>
// </category6_url>
// <category6_title>
// <![CDATA[ Menu Iridium Whey Woman 450g ]]>
// </category6_title>
// <category6_breadcrumbs>
// <![CDATA[ Menu Iridium Whey Woman 450g ]]>
// </category6_breadcrumbs>
// <category7_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/categoria-whey-protein ]]>
// </category7_url>
// <category7_title>
// <![CDATA[ Categoria - Whey Protein ]]>
// </category7_title>
// <category7_breadcrumbs>
// <![CDATA[ Categoria - Whey Protein ]]>
// </category7_breadcrumbs>
// <category8_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/iridium-black-linha-woman ]]>
// </category8_url>
// <category8_title>
// <![CDATA[ Iridium Black - Linha Woman ]]>
// </category8_title>
// <category8_breadcrumbs>
// <![CDATA[ Iridium Black - Linha Woman ]]>
// </category8_breadcrumbs>
// <category9_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/iridium-black-ganho-de-massa ]]>
// </category9_url>
// <category9_title>
// <![CDATA[ Iridium Black - Ganho de Massa ]]>
// </category9_title>
// <category9_breadcrumbs>
// <![CDATA[ Iridium Black - Ganho de Massa ]]>
// </category9_breadcrumbs>
// <category10_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/iridium-black-todas-ofertas ]]>
// </category10_url>
// <category10_title>
// <![CDATA[ Iridium Black - Todas Ofertas ]]>
// </category10_title>
// <category10_breadcrumbs>
// <![CDATA[ Iridium Black - Todas Ofertas ]]>
// </category10_breadcrumbs>
// <category11_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/whey-protein-woman-450g ]]>
// </category11_url>
// <category11_title>
// <![CDATA[ Whey Protein Woman ]]>
// </category11_title>
// <category11_breadcrumbs>
// <![CDATA[ Whey Protein Woman ]]>
// </category11_breadcrumbs>
// <category12_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/dezembro-pricipais ]]>
// </category12_url>
// <category12_title>
// <![CDATA[ Verão no Shape ]]>
// </category12_title>
// <category12_breadcrumbs>
// <![CDATA[ Verão no Shape ]]>
// </category12_breadcrumbs>
// <category13_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/carnaval-woman ]]>
// </category13_url>
// <category13_title>
// <![CDATA[ Carnaval Woman ]]>
// </category13_title>
// <category13_breadcrumbs>
// <![CDATA[ Carnaval Woman ]]>
// </category13_breadcrumbs>
// <category14_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/woman ]]>
// </category14_url>
// <category14_title>
// <![CDATA[ Woman ]]>
// </category14_title>
// <category14_breadcrumbs>
// <![CDATA[ Woman ]]>
// </category14_breadcrumbs>
// <category15_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/consumidor-hipertrofia ]]>
// </category15_url>
// <category15_title>
// <![CDATA[ Consumidor Hipertrofia ]]>
// </category15_title>
// <category15_breadcrumbs>
// <![CDATA[ Consumidor Hipertrofia ]]>
// </category15_breadcrumbs>
// <category16_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/consumidor-woman ]]>
// </category16_url>
// <category16_title>
// <![CDATA[ Consumidor Woman ]]>
// </category16_title>
// <category16_breadcrumbs>
// <![CDATA[ Consumidor Woman ]]>
// </category16_breadcrumbs>
// <category17_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/whey-protein-1 ]]>
// </category17_url>
// <category17_title>
// <![CDATA[ Coleção Whey Protein ]]>
// </category17_title>
// <category17_breadcrumbs>
// <![CDATA[ Coleção Whey Protein ]]>
// </category17_breadcrumbs>
// <category18_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/colecao-woman ]]>
// </category18_url>
// <category18_title>
// <![CDATA[ Coleção Woman ]]>
// </category18_title>
// <category18_breadcrumbs>
// <![CDATA[ Coleção Woman ]]>
// </category18_breadcrumbs>
// <category19_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/saude-beleza ]]>
// </category19_url>
// <category19_title>
// <![CDATA[ Saúde & Beleza ]]>
// </category19_title>
// <category19_breadcrumbs>
// <![CDATA[ Saúde & Beleza ]]>
// </category19_breadcrumbs>
// <category20_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/compre-e-ganhe ]]>
// </category20_url>
// <category20_title>
// <![CDATA[ Compre e ganhe ]]>
// </category20_title>
// <category20_breadcrumbs>
// <![CDATA[ Compre e ganhe ]]>
// </category20_breadcrumbs>
// <category21_url>
// <![CDATA[ https://www.iridiumlabs.com.br/collections/proteinas ]]>
// </category21_url>
// <category21_title>
// <![CDATA[ Proteínas ]]>
// </category21_title>
// <category21_breadcrumbs>
// <![CDATA[ Proteínas ]]>
// </category21_breadcrumbs>
// <option_sabor>
// <![CDATA[ Milkshake de Chocolate ]]>
// </option_sabor>
// <variant_title>
// <![CDATA[ Milkshake de Chocolate ]]>
// </variant_title>
// <g:additional_image_link>
// <![CDATA[ https://cdn.shopify.com/s/files/1/0273/2323/6455/products/WHEY_WOMAN_450g_03_a1205cb3-64a0-4f99-a76f-4370639c20aa.jpg?v=1656529524 ]]>
// </g:additional_image_link>
// <g:additional_image_link>
// <![CDATA[ https://cdn.shopify.com/s/files/1/0273/2323/6455/products/WHEY_WOMAN_450g_02.jpg?v=1656529531 ]]>
// </g:additional_image_link>
// <tags>
// <![CDATA[ Categorias, Hipertrofia, Linha Woman, Objetivos, Produto, tag-definição muscular, tag-força, tag-hipertrofia, Whey Protein ]]>
// </tags>
// <template_suffix>
// <![CDATA[ shogun ]]>
// </template_suffix>
// </entry>