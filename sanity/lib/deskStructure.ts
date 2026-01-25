import { StructureBuilder } from "sanity/structure";
import { DocumentsIcon, ComposeIcon, CogIcon } from "@sanity/icons";

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // First Section: Pages Overview
      S.listItem()
        .title("Pages")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("All Pages")
            .items([
              S.listItem()
                .title("Home Pages")
                .schemaType("landingPage")
                .child(S.documentTypeList("landingPage").title("Home Pages")),
              S.listItem()
                .title("Services Pages")
                .schemaType("servicesPage")
                .child(S.documentTypeList("servicesPage").title("Services Pages")),
              S.listItem()
                .title("About Pages")
                .schemaType("aboutPage")
                .child(S.documentTypeList("aboutPage").title("About Pages")),
              S.listItem()
                .title("Contact Pages")
                .schemaType("contactPage")
                .child(S.documentTypeList("contactPage").title("Contact Pages")),
              S.listItem()
                .title("Work Pages")
                .schemaType("workPage")
                .child(S.documentTypeList("workPage").title("Work Pages")),
              S.listItem()
                .title("Blog Pages")
                .schemaType("blogPage")
                .child(S.documentTypeList("blogPage").title("Blog Pages")),
            ])
        ),

      S.divider(),

      // Home Page - Quick Access
      S.listItem()
        .title("Home Page")
        .icon(ComposeIcon)
        .schemaType("landingPage")
        .child(S.documentTypeList("landingPage").title("Home Pages")),

      // Service Pages - Contains sub-pages like Shopify Development
      S.listItem()
        .title("Service Pages")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Service Pages")
            .items([
              S.listItem()
                .title("Shopify Development Page")
                .schemaType("shopifyDevelopmentPage")
                .child(
                  S.documentTypeList("shopifyDevelopmentPage").title("Shopify Development Page")
                ),
              S.listItem()
                .title("Migrate Page")
                .schemaType("migratePage")
                .child(
                  S.documentTypeList("migratePage").title("Migrate Page")
                ),
              S.listItem()
                .title("Shopify POS Page")
                .schemaType("shopifyPosPage")
                .child(
                  S.documentTypeList("shopifyPosPage").title("Shopify POS Page")
                ),
              S.listItem()
                .title("All Packages Page")
                .schemaType("allPackagesPage")
                .child(
                  S.documentTypeList("allPackagesPage").title("All Packages Page")
                ),
              S.listItem()
                .title("Package Detail Pages")
                .schemaType("packageDetailPage")
                .child(
                  S.documentTypeList("packageDetailPage").title("Package Detail Pages")
                ),
            ])
        ),

      // Shopify Pages - Contains Shopify Platform, POS Info, TCO Calculator, x PIM, x AI, Why Shopify
      S.listItem()
        .title("Shopify Pages")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Shopify Pages")
            .items([
              S.listItem()
                .title("Shopify Platform Page")
                .schemaType("shopifyPlatformPage")
                .child(
                  S.documentTypeList("shopifyPlatformPage").title("Shopify Platform Page")
                ),
              S.listItem()
                .title("Shopify POS Info Page")
                .schemaType("shopifyPosInfoPage")
                .child(
                  S.documentTypeList("shopifyPosInfoPage").title("Shopify POS Info Page")
                ),
              S.listItem()
                .title("Shopify TCO Calculator Page")
                .schemaType("shopifyTcoCalculatorPage")
                .child(
                  S.documentTypeList("shopifyTcoCalculatorPage").title("Shopify TCO Calculator Page")
                ),
              S.listItem()
                .title("Shopify x PIM Page")
                .schemaType("shopifyXPimPage")
                .child(
                  S.documentTypeList("shopifyXPimPage").title("Shopify x PIM Page")
                ),
              S.listItem()
                .title("Shopify x AI Page")
                .schemaType("shopifyXAiPage")
                .child(
                  S.documentTypeList("shopifyXAiPage").title("Shopify x AI Page")
                ),
              S.listItem()
                .title("Why Shopify Page")
                .schemaType("whyShopifyPage")
                .child(
                  S.documentTypeList("whyShopifyPage").title("Why Shopify Page")
                ),
              S.listItem()
                .title("Vipps Hurtigkasse Page")
                .schemaType("vippsHurtigkassePage")
                .child(
                  S.documentTypeList("vippsHurtigkassePage").title("Vipps Hurtigkasse Page")
                ),
            ])
        ),

      S.listItem()
        .title("About Page")
        .schemaType("aboutPage")
        .child(S.documentTypeList("aboutPage").title("About Pages")),

      S.listItem()
        .title("Contact Page")
        .schemaType("contactPage")
        .child(S.documentTypeList("contactPage").title("Contact Pages")),

      S.listItem()
        .title("Work Page")
        .schemaType("workPage")
        .child(S.documentTypeList("workPage").title("Work Pages")),

      S.listItem()
        .title("Blog Page")
        .schemaType("blogPage")
        .child(S.documentTypeList("blogPage").title("Blog Pages")),

      S.listItem()
        .title("Partners Page")
        .schemaType("partnersPage")
        .child(S.documentTypeList("partnersPage").title("Partners Pages")),

      // Merch Pages
      S.listItem()
        .title("Merch Pages")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Merch Pages")
            .items([
              S.listItem()
                .title("Merch Page")
                .schemaType("merchPage")
                .child(
                  S.documentTypeList("merchPage").title("Merch Page")
                ),
              S.listItem()
                .title("Merch Product Settings")
                .schemaType("merchProductSettings")
                .child(
                  S.documentTypeList("merchProductSettings").title("Merch Product Settings")
                ),
            ])
        ),

      S.divider(),

      // Site Settings
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Site Settings")
            .items([
              S.listItem()
                .title("Header Settings")
                .schemaType("headerSettings")
                .child(
                  S.documentTypeList("headerSettings").title("Header Settings")
                ),
              S.listItem()
                .title("Footer Settings")
                .schemaType("footerSettings")
                .child(
                  S.documentTypeList("footerSettings").title("Footer Settings")
                ),
            ])
        ),
    ]);
