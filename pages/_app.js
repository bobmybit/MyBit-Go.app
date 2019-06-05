import React from 'react';
import { hot } from 'react-hot-loader/root'
import App, { Container } from 'next/app';
import AirtableProvider, { withAirtableContext } from 'components/AirtableContext';
import BlockchainProvider from 'components/BlockchainContext';
import KyberProvider from 'components/KyberContext';
import NotificationsProvider from 'components/NotificationsContext';
import ThreeBoxProvider from 'components/ThreeBoxContext';
import TermsOfServiceProvider from 'components/TermsOfServiceContext';
import Notifications from 'components/Notifications';
import MetamaskProvider from 'components/MetamaskContext';
import CivicProvider from "ui/CivicContext";
import Head from 'components/Head';
import GlobalStyle from 'components/globalStyle';
import AppWrapper from 'components/AppWrapper';
import Theme from 'components/Theme'
import MobileMenu from 'components/MobileMenu'
import BancorContainer from 'ui/BancorContainer';
import Cookie from 'js-cookie';
import Router from 'next/router';
import { navbarOptions } from 'constants/navigationBar';
import { WEB3_BACKUP_PROVIDER } from 'constants/web3BackupProvider';
import { FULL_SCREEN_PAGES } from 'constants/fullScreenPages';
import { COOKIES } from 'constants/cookies';
import { SUPPORTED_NETWORKS } from 'constants/supportedNetworks';

class MyApp extends App {
  state = {
    mobileMenuOpen: false,
    network: undefined,
    userHasMetamask: undefined,
  }

  saveFirstVisit = () => {
    try {
      if (!Cookie.get(COOKIES.NEW_USER)) {
        Cookie.set(COOKIES.NEW_USER, 'true');
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  setNetwork = network => this.setState({network})

  setUserHasMetamask = userHasMetamask => this.setState({userHasMetamask})

  prefetchPages = () => {
    Router.prefetch('/onboarding')
    Router.prefetch('/asset-manager')
    Router.prefetch('/asset')
    Router.prefetch('/transaction-history')
    Router.prefetch('/explore')
    Router.prefetch('/portfolio')
    Router.prefetch('/help')
    Router.prefetch('/watch-list')
    Router.prefetch('/list-asset')
  }

  componentDidMount = () => {
    require('utils/disableReactDevTools');
    this.prefetchPages();
    this.saveFirstVisit()
  }

  handleMobileMenuClicked = (state) => {
    this.setState({
      mobileMenuOpen: state,
    })
  }

  render () {
    const { Component, pageProps, router } = this.props;
    const {
      mobileMenuOpen,
      network,
      userHasMetamask,
    } = this.state;

    const isFullScreenPage = FULL_SCREEN_PAGES.includes(router.pathname);

    return (
      <Container>
        <GlobalStyle />
        <Head/>
        <Theme>
          <WithProviders
            setNetwork={this.setNetwork}
            setUserHasMetamask={this.setUserHasMetamask}
            network={network}
            userHasMetamask={userHasMetamask}
          >
            <Notifications />
            <MobileMenu
              isOpen={mobileMenuOpen}
              items={navbarOptions}
              currentPath={router.route}
              handleMobileMenuState={this.handleMobileMenuClicked}
            >
              <React.Fragment>
                <BancorContainer>
                  <AppWrapper
                    isFullScreenPage={isFullScreenPage}
                    handleMobileMenuState={this.handleMobileMenuClicked}
                  >
                    <Component
                      {...pageProps}
                      currentPath={router.route}
                    />
                  </AppWrapper>
                </BancorContainer>
              </React.Fragment>
            </MobileMenu>
          </WithProviders>
        </Theme>
      </Container>
    )
  }
}

const WithProviders = ({ children, setNetwork, network, setUserHasMetamask, userHasMetamask }) => (
    <NotificationsProvider>
        <AirtableProvider
          network={network}
          userHasMetamask={userHasMetamask}
        >
          <KyberProvider
            network={network}
            supportedNetworks={SUPPORTED_NETWORKS}
            userHasMetamask={userHasMetamask}
          >
          <MetamaskProvider
            backupProvider={WEB3_BACKUP_PROVIDER}
            supportedNetworks={SUPPORTED_NETWORKS}
            setNetwork={setNetwork}
            setUserHasMetamask={setUserHasMetamask}
          >
            <BlockchainProvider
              supportedNetworks={SUPPORTED_NETWORKS}
            >
            <ThreeBoxProvider>
              <CivicProvider>
                <TermsOfServiceProvider>
                  {children}
                </TermsOfServiceProvider>
              </CivicProvider>
            </ThreeBoxProvider>
            </BlockchainProvider>
            </MetamaskProvider>
          </KyberProvider>
        </AirtableProvider>

    </NotificationsProvider>
);

export default hot(MyApp);
