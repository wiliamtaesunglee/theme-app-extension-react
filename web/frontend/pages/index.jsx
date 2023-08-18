import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <Page narrowWidth>
      <TitleBar title={"Google Shopping With Discount"} primaryAction={null} />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
                <TextContainer spacing="loose">
                  <Text as="h2" variant="headingMd">
                    Google Shopping with discount feature
                  </Text>
                  <Text as="h2" variant="headingMd">
                    What this app does?
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Introducing our exclusive Shopify app tailored for the Brazilian market, designed to simplify your Google Shopping experience. With just a few clicks, our app takes all the products from your store and generates an XML file that seamlessly feeds into Google Shopping.
                  </Text>
                      
                  <Text variant="bodyMd" as="p">
                    But that's not all! Recognizing the popularity of the PIX payment method in Brazil, we've added a special discount feature. Simply input a percentage, and the app will automatically apply that discount to all your products. Whether it's a seasonal sale or an exclusive offer, managing your pricing strategy has never been easier. Enhance your store's visibility, attract more customers, and take control of your online sales with our user-friendly app!
                  </Text>
                </TextContainer>
              </Stack.Item>
              <Stack.Item>
                <div style={{ padding: "0 20px" }}>
                  <Image
                    source={trophyImage}
                    alt={t("HomePage.trophyAltText")}
                    width={120}
                  />
                </div>
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <ProductsCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
