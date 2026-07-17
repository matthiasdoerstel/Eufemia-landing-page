import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import PlatformOverview, { mapCmsComponents } from "../../components/PlatformOverview";

const AndroidPage: React.FC = () => {
  const data = useStaticQuery(graphql`
    query AndroidComponentsQuery {
      allSanityComponent(filter: { platform: { eq: "android" } }, sort: { name: ASC }) {
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

  return <PlatformOverview platform="android" components={mapCmsComponents(data?.allSanityComponent?.nodes)} />;
};

export default AndroidPage;

export const Head = () => <title>Android Components | Eufemia Design System</title>;
