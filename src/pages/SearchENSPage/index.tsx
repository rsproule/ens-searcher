import { useQuery } from '@apollo/react-hooks'
import { useState } from 'react'
import { FormControl, InputGroup, Spinner } from 'react-bootstrap'
import { Link } from '../../components'
import { ENSResultTable } from '../../components/ENSDomainList'
import { ENS_NAME_QUERY } from '../../graphql/subgraph'

export const SearchENSPage = () => {
  // let [params] = useSearchParams() // in case we want to perm search in url
  let [searchString, setSearchString] = useState('')

  return (
    <div>
      <h2>Search for a specific ENS Domain:</h2>
      <SearchBar search={searchString} setSearch={setSearchString} />
      <Result searchValue={searchString} />
    </div>
  )
}

interface SearchProps {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

const SearchBar = (props: SearchProps) => {
  const { search, setSearch } = props

  return (
    <>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">Search: </InputGroup.Text>
        <FormControl
          placeholder="enter search term here..."
          aria-label="Search"
          aria-describedby="basic-addon1"
          value={search}
          onChange={(val: any) => setSearch(val.target.value)}
        />
      </InputGroup>
    </>
  )
}

interface ResultProps {
  searchValue: string
}
const Result = (props: ResultProps) => {
  const { loading, error, data } = useQuery(ENS_NAME_QUERY, {
    variables: {
      name: props.searchValue.toLowerCase(),
    },
  })
  if (props.searchValue.length < 3) {
    return <>{'Type to search. An ENS Domain must be a minimum of 3 characters.'}</>
  }
  if (loading)
    return (
      <>
        <Spinner animation="border" />
      </>
    )
  if (error) {
    return <>Failed to load</>
  }

  return (
    <>
      <ENSResultTable data={data} error={error} scoreLength={true} scoreDictionary={true} />

      {!data || !data.registrations || data.registrations.length === 0 ? (
        <p>
          If there is no entry here, then this domain was likely never
          registered. Go register now!{' '}
          <Link
            href={`https://app.ens.domains/name/${props.searchValue}.eth/register`}
          >
            ENS App
          </Link>
        </p>
      ) : (
        ''
      )}
    </>
  )
}
