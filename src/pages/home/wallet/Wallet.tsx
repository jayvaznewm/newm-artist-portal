import { FunctionComponent } from "react";
import { Box, Button, Container } from "@mui/material";
import { FilledButton, Typography } from "elements";
import theme from "theme";
import { UnclaimedRoyalties } from "./UnclaimedRoyalties";
import TabbedContainer from "./TabbedContainer";
import Portfolio from "./Portfolio";
import Transactions from "./Transactions";

const Wallet: FunctionComponent = () => {
  return (
    <Container
      maxWidth={ false }
      sx={ {
        marginLeft: [null, null, 4.5],
        overflow: "auto",
        paddingY: 7.5,
        textAlign: ["center", "initial"],
      } }
    >
      <Box
        sx={ {
          display: "flex",
          justifyContent: ["center", "space-between"],
          alignItems: "center",
        } }
      >
        <Typography
          sx={ { display: ["none", "block"] } }
          variant="h3"
          fontWeight={ 800 }
          mb={ 5 }
        >
          WALLET
        </Typography>
        <FilledButton
          sx={ { mr: [0,4.75], mb: 5 } }
          backgroundColor={ theme.gradients.crypto }
        >
          Connect Wallet
        </FilledButton>
      </Box>
      <UnclaimedRoyalties unclaimedRoyalties={ 5.35 } />
      <TabbedContainer
        sx={ { pt: 5 } }
        label1="PORTFOLIO"
        label2="TRANSACTIONS"
        Component1={ Portfolio }
        Component2={ Transactions }
      />
    </Container>
  );
};

export default Wallet;
