import shopify from "../shopify.js";

export async function fetchAllProducts(session) {
  let allProducts = [];
  let hasNextPage = true;
  let lastCursor = null;

  console.log('*****', session)

  while (hasNextPage) {
      const response = await new shopify.api.clients.Graphql({ session }).query({
          data: `query {
              products(first: 10, after: ${lastCursor ? `"${lastCursor}"` : null}, reverse: true) {
                pageInfo{
                  hasNextPage
                }
                edges {
                  node {
                    description
                    vendor
                    variants(first: 20, reverse: true) {
                      edges {
                        node {
                          image {
                            url
                          }
                          id
                          displayName
                          compareAtPrice
                          inventoryQuantity
                          price
                          title
                          sku
            
                        }
                      }
                    }
                    description
                    id
                    images(first: 10, reverse: true) {
                      edges {
                        node {
                          id
                        }
                      }
                    }
                    productCategory {
                      productTaxonomyNode {
                        id
                      }
                    }
                    productType
                    status
                    collections(first: 10, reverse: true) {
                      edges {
                        node {
                          id
                        }
                      }
                    }
                    tags
                  }
                }
              }
          }`,
      });

      console.log(response)

      // allProducts = allProducts.concat(response.data.products.edges.map(edge => edge.node));

      // hasNextPage = response.data.products.pageInfo.hasNextPage;

      // if (hasNextPage) {
      //     lastCursor = response.data.products.edges[response.data.products.edges.length - 1].cursor;
      // }
  }

  return allProducts;
}
