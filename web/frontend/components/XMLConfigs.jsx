import { useState } from "react";
import { Card, Checkbox, Text, Button } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function XMLConfigs() {
  const emptyToastProps = { content: null };
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const [options, setOptions] = useState({
    autoGTIN: false,
    allCustom: false,
    exportFirstVariant: false,
    titleWithVariantTitle: false,
    utmTracking: true,
    defaultCurrency: true,
    idToSku: false,
    idToVariantSKU: false,
    idToProductId: false,
    idToVariantId: false,
    secondImage: false,
    mainImage: false,
  });
  const handleChange = (e, name) => {
    setOptions({ ...options, [name]: e });
  }

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/config",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const handleSubmit = async (configs) => {
    try {
      const response = await fetch('/api/products/config', {
        method: 'POST',
        body: JSON.stringify(configs),
        headers: {
          'Content-Type': 'application/json'
        }
      }, configs);
      console.log(response)
    } catch (error) {
      console.error(error.message)
    }
  }

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  return (
    <>
      <Card
        title={"Configuration XML Generator"}
        sectioned
      >
        <div>
          <Text as="h2" variant="headingMd">Variants and Titles</Text>
          <div style={{ margin: "8px 0 16px" }}>
            <Checkbox
              name='autoGTIN'
              label="Do not auto generate random GTINs if no barcode is set"
              checked={options.autoGTIN}
              onChange={(e) => handleChange(e, 'autoGTIN')}
            />
            <Text variant="bodySm" as="p">
              Default is off which can help with approval of products, but will give a GTIN warning in Merchant. Note: you might need to set the products as custom if they don´t have a GTINs.
            </Text>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Checkbox
              name="allCustom"
              label="All products are custom"
              checked={options.allCustom}
              onChange={(e) => handleChange(e, 'allCustom')}
            />
            <Text variant="bodySm" as="p">
              Will clear g:gtin-field + g:mnp-field and set g:identifier-exists-field to false
            </Text>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Checkbox
              name="exportFirstVariant"
              label="Export only the first/main variant"
              checked={options.exportFirstVariant}
              onChange={(e) => handleChange(e, 'exportFirstVariant')}
            />
            <Text variant="bodySm" as="p">
              This will make the feed smaller and will not put variant-id in the g:id-field
            </Text>
          </div>


          <div style={{ marginBottom: 16 }}>
            <Checkbox
              name="titleWithVariantTitle"
              label="Do not add UTM traking paramters to the links"
              checked={options.titleWithVariantTitle}
              onChange={(e) => handleChange(e, 'titleWithVariantTitle')}
            />
            <Text variant="bodySm" as="p">
              Default is to add utm_source=google&utm_medium=cpc&utm_campaign=google&shopping parameters so shopify can show marketing statistics.
            </Text>
          </div>


          <div style={{ marginBottom: 16 }}>
            <Checkbox
              name="utmTracking"
              label="Do not add default currency to the URL"
              checked={options.utmTracking}
              onChange={(e) => handleChange(e, 'utmTracking')}
            />
            <Text variant="bodySm" as="p">
              Will clear g:gtin-field + g:mnp-field and set g:identifier-exists-field to false
            </Text>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Checkbox
              name="defaultCurrency"
              label="Do not add default currency to the URL"
              checked={options.defaultCurrency}
              onChange={(e) => handleChange(e, 'defaultCurrency')}
            />
            <Text variant="bodySm" as="p">
              Will clear g:gtin-field + g:mnp-field and set g:identifier-exists-field to false
            </Text>
          </div>
        </div>

        <div>
          <Text as="h2" variant="headingMd">Ids & Images</Text>
          <div style={{ margin: "8px 0 16px" }}>
            <Checkbox
              name="idToSku"
              label="Set g:id-field to product sky (g:mpn field in the feed)"
              checked={options.idToSku}
              onChange={(e) => handleChange(e, 'idToSku')}
            />
            <Text variant="bodySm" as="p">
              Default is shopify_XX_product-id_variant-id.
            </Text>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Checkbox
              name="idToVariantSKU"
              label="Set g:id-field to variant sku"
              checked={options.idToVariantSKU}
              onChange={(e) => handleChange(e, 'idToVariantSKU')}
            />
            <Text variant="bodySm" as="p">
              Use only if each variant has a unique SKU.
            </Text>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Checkbox
              name="idToProductId"
              label="Set g:id-field to Shopify's product id"
              checked={options.idToProductId}
              onChange={(e) => handleChange(e, 'idToProductId')}
            />
            <Text variant="bodySm" as="p">
              Don't use this if you have product vairant's as you will have duplicate ID's.
            </Text>
          </div>


          <div style={{ marginBottom: 16 }}>
            <Checkbox
              name="idToVariantId"
              label="Set g:id-field to Shopify's variant id"
              checked={options.idToVariantId}
              onChange={(e) => handleChange(e, 'idToVariantId')}
            />
            <Text variant="bodySm" as="p">
              This is a unique number for each variant (last part of the default ID).
            </Text>
          </div>


          <div style={{ marginBottom: 16 }}>
            <Checkbox
              name="secondImage"
              label="Use second image"
              checked={options.secondImage}
              onChange={(e) => handleChange(e, 'secondImage')}
            />
            <Text variant="bodySm" as="p">
              Default is the first image. if first image is not allowed, you can add a second image which is allowed and use this setting. 
            </Text>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Checkbox
              name="mainImage"
              label="Use the image of the main product (not variant)"
              checked={options.mainImage}
              onChange={(e) => handleChange(e, 'mainImage')}
            />
            <Text variant="bodySm" as="p">
              The main image is the image which is usually shown on the category page.
            </Text>
          </div>
        </div>
      </Card>

      <Card
        title={"Configuration XML Generator"}
        sectioned
      >
        <Text as="h2" variant="headingMd">XML url generator</Text>
        <br />
        <Button onClick={() => handleSubmit(options)} primary>Generate Google Shopping XML</Button>
        <br />
      </Card>
    </>
  );
}
