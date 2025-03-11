import React from "react";

import Footer from "../Footer/Footer";
import Navigation from "../Navigation/Navigation";

const Layout: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <div className="page-layout">
      <Navigation />
      <main>{props.children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
