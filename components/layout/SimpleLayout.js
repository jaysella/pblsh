export default function SimpleLayout({ children }) {
  return <div>{children}</div>;
}

export function withSimpleLayout(Component) {
  Component.Layout = SimpleLayout;

  return Component;
}
