import { Route, Routes } from 'react-router-dom'
import { Body } from './components'
import { ENSSingleNamePage } from './pages/ENSSingleNamePage'
import { SearchENSPage } from './pages/SearchENSPage'
import { ENSUpcomingExpiriesPage } from './pages/lists/ENSUpcomingExpiryListPage'
import { NavBar } from './components/NavBar'

function App() {
  // const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal()

  return (
    <div>
      <NavBar
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
