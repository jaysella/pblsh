import Footer from "./Footer";

export default function SimpleLayout({ children }) {
  return (
    <>
      <div>{children}</div>
      <Footer />
    </>
  );
}

export function withSimpleLayout(Component) {
  Component.Layout = SimpleLayout;

  return Component;
}
