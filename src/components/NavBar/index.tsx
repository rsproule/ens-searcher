//// *** Uncomment all the code here to add the ability to login with wallet 
//// *** in case you want to interact with smart contracts

// import { useEffect, useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
// import { WalletButton } from '../WalletButton'

interface NavBarProps {
  provider: any
  loadWeb3Modal: any
  logoutOfWeb3Modal: any
}

export const NavBar = (props: NavBarProps) => {
  // const { provider, loadWeb3Modal, logoutOfWeb3Modal } = props
  // const [account, setAccount] = useState<string>('')
  // useEffect(() => {
  //   async function fetchAccount() {
  //     try {
  //       if (!provider) {
  //         return
  //       }
  //       // Load the user's accounts.
  //       const accounts = await provider.listAccounts()
  //       setAccount(accounts[0])
  //     } catch (err) {
  //       setAccount('')
  //       console.error(err)
  //     }
  //   }
  //   fetchAccount()
  // }, [account, provider, setAccount])

  return (
    <Navbar collapseOnSelect bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">ENS Sniper Service</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* <Nav.Link href="/">Home</Nav.Link> */}
            <LinkContainer to="/">
              <Nav.Link>Expiring Soon!</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/search">
              <Nav.Link>Search</Nav.Link>
            </LinkContainer>
            {/* {account ? (
              <LinkContainer to={`/accounts/${account}/snipes`}>
                <Nav.Link>My Snipes</Nav.Link>
              </LinkContainer>
            ) : (
              ''
            )} */}
          </Nav>
        </Navbar.Collapse>
        {/* <WalletButton
          provider={provider}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
        /> */}
      </Container>
    </Navbar>
  )
}
