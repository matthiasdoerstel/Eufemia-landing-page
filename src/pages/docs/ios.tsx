import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import PlatformOverview, { mapCmsComponents } from "../../components/PlatformOverview";

const IOSPage: React.FC = () => {
  const data = useStaticQuery(graphql`
    query IOSComponentsQuery {
      allSanityComponent(filter: { platform: { eq: "ios" } }, sort: { name: ASC }) {
        nodes {
          id
          name
          shortDescription
          slug {
            current
          }
        }
      }
    }
  `);

  return <PlatformOverview platform="ios" components={mapCmsComponents(data?.allSanityComponent?.nodes)} />;
};

export default IOSPage;

export const Head = () => <title>iOS Components | Eufemia Design System</title>;
