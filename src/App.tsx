import { useQuery } from '@apollo/react-hooks'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Body } from './components'
import useWeb3Modal from './hooks/useWeb3Modal'

import { GET_TRANSFERS } from './graphql/subgraph'
import { ENSSingleNamePage } from './pages/ENSSingleNamePage'
import { SearchENSPage } from './pages/SearchENSPage'
import { ENSUpcomingExpiriesPage } from './pages/lists/ENSUpcomingExpiryListPage'
import { NavBar } from './components/NavBar'

function App() {
  const { loading, error, data } = useQuery(GET_TRANSFERS)
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal()

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      console.log({ transfers: data.transfers })
    }
  }, [loading, error, data])

  return (
    <div>
      <NavBar
        provider={provider}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
      />

      <Body>
        <Routes>
          <Route path="/" element={<ENSUpcomingExpiriesPage />} />
          <Route path="/search" element={<SearchENSPage />} />
          <Route path="/ens/:name" element={<ENSSingleNamePage />} />
        </Routes>
      </Body>
    </div>
  )
}

export default App
