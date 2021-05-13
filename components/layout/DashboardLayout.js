import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import Image from "next/image";
import { useFaunaUser } from "../../hooks/useFaunaUser";
import Dropdown, {
  DropdownButton,
  DropdownItems,
  DropdownItem,
} from "../Dropdown";
import SearchBar from "../SearchBar";
import Footer from "./Footer";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  linkStyles,
  focusStyles,
  buttonHoverStyles,
} from "../../shared/styles";

export default function DashboardLayout({ children }) {
  const { user } = useUser();
  const { faunaUserStatus, faunaUserData } = useFaunaUser();

  return (
    <div>
      <Header>
        <Left>
          <Link href="/dashboard" passHref>
            <NavButton>
              <Image
                src="/logo-light.svg"
                alt="pblsh logo"
                width={120}
                height={40}
              />
            </NavButton>
          </Link>

          <SearchBar />
        </Left>

        <Right>
          <Link href="/folders" passHref>
            <NavLink>Folders</NavLink>
          </Link>

          <Link href="/pages" passHref>
            <NavLink>Pages</NavLink>
          </Link>

          <Dropdown>
            <DropdownButton>
              <NavDropdown>
                <Image
                  src="/icons/person.svg"
                  alt="User profile"
                  width={20}
                  height={20}
                />
              </NavDropdown>
            </DropdownButton>
            {user ? (
              <DropdownItems>
                <DropdownItem link href="/profile">
                  {/* {(faunaUserData && faunaUserData?.name) || "Loading..."} */}
                  Profile
                  <span>
                    {(faunaUserData && faunaUserData?.email) || "Loading..."}
                  </span>
                </DropdownItem>
                <DropdownItem link href="/onboarding">
                  Onboarding
                </DropdownItem>
                <DropdownItem link href="/settings">
                  Settings
                </DropdownItem>
                <DropdownItem link href="/api/auth/logout">
                  Log Out
                </DropdownItem>
              </DropdownItems>
            ) : (
              <DropdownItems>
                <DropdownItem link href="/api/auth/login">
                  Log In
                </DropdownItem>
              </DropdownItems>
            )}
          </Dropdown>
        </Right>
      </Header>

      <div>{children}</div>

      <Footer></Footer>
    </div>
  );
}

export function withDashboardLayout(Component) {
  Component.Layout = DashboardLayout;

  return Component;
}

export const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 2rem calc(5rem - 0.75rem);
`;

export const Left = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

export const navElement = css`
  ${linkStyles};
  ${buttonHoverStyles};

  display: flex;
  align-content: center;
  padding: 0.75rem;
  border-radius: var(--base-border-radius);
`;

export const Right = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

export const NavButton = styled.a`
  ${navElement}
`;

export const NavLink = styled.a`
  ${linkStyles};

  color: var(--color-white-muted);
  padding: calc(0.75rem + 2px) 0.75rem 0.75rem;
  border-radius: var(--base-border-radius);
  transition: color calc(var(--base-transition-in-duration) / 1.5) ease-out,
    box-shadow calc(var(--base-transition-in-duration) / 1.5) ease-out;

  &:hover,
  &:focus {
    color: var(--color-white);
    transition: color calc(var(--base-transition-out-duration) / 1.5) ease-in,
      box-shadow calc(var(--base-transition-out-duration) / 1.5) ease-in;
  }

  &:focus {
    --color-outline: var(--color-highlight);
    ${focusStyles};
  }
`;

export const NavDropdown = styled.div`
  ${navElement};
`;
