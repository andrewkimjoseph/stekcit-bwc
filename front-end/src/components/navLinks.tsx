import { ReactNode } from 'react';
import { Link } from '@chakra-ui/react';

interface NavLinkProps {
  children: ReactNode;
  href: string;
}

const NavLink = ({ children, href }: NavLinkProps) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    textColor={"white"}
    _hover={{
      textColor: "black",
      textDecoration: "none",
      bg: "white",
    }}
    href={href}
  >
    {children}
  </Link>
);

export default NavLink;
