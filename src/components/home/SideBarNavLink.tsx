import { CSSProperties, FunctionComponent } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import theme from "theme";

const activeBackground = "rgba(255, 255, 255, 0.1)";

interface ButtonProps {
  readonly onClick?: VoidFunction;
  readonly style: CSSProperties;
}

interface LinkProps extends ButtonProps {
  readonly to: string;
}

interface AnchorProps extends ButtonProps {
  readonly href: string;
}

type WrapperProps = LinkProps | ButtonProps | AnchorProps;

interface SideBarNavLinkProps {
  readonly label: string;
  readonly icon: JSX.Element;
  readonly to?: string;
  readonly href?: string;
  readonly onClick?: VoidFunction;
}

const Wrapper: FunctionComponent<WrapperProps> = ({ children, ...props }) => {
  if ("to" in props && props.to) {
    return <Link { ...props }>{ children }</Link>;
  } else if ("href" in props && props.href) {
    return (
      <a target="_blank" rel="noreferrer" { ...props }>
        { children }
      </a>
    );
  } else {
    return <Box { ...props }>{ children }</Box>;
  }
};

const SideBarNavLink: FunctionComponent<SideBarNavLinkProps> = ({
  label,
  icon,
  to,
  href,
  onClick,
}) => {
  const resolved = useResolvedPath(to || "");
  const match = useMatch({ path: resolved.pathname, end: false });
  const isActiveLink = to && match;

  return (
    <Wrapper
      onClick={ onClick }
      to={ to }
      href={ href }
      style={ {
        textDecoration: "none",
        minWidth: "100%",
        cursor: "pointer",
      } }
    >
      <Stack
        direction="row"
        spacing={ 2.5 }
        sx={ {
          fontSize: "12px",
          lineHeight: "15px",
          fontWeight: 600,
          font: theme.typography.button.font,
          alignItems: "center",
          borderRadius: "6px",
          padding: "12px 20px",
          color: "white",
          background: isActiveLink ? activeBackground : "transparent",
          opacity: isActiveLink ? 1 : 0.5,
          transition: "background-color 0ms",
          display: "flex",
          textTransform: "none",
          justifyContent: "flex-start",
          "&:hover": {
            opacity: "1",
            background: `${activeBackground}`,
          },
        } }
        data-testid="navStyled"
      >
        { icon }
        <span>{ label }</span>
      </Stack>
    </Wrapper>
  );
};

export default SideBarNavLink;
