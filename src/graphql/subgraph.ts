import { gql } from 'apollo-boost'

// See more example queries on https://thegraph.com/explorer/subgraph/paulrberg/create-eth-app
export const GET_TRANSFERS = gql`
  {
    transfers(first: 10) {
      id
      from
      to
      value
    }
  }
`

export const ENS_QUERY = gql`
  query ENSEntries($start: Int!, $end: Int!, $pointer: Int!) {
    registrations(
      orderBy: expiryDate
      where: { expiryDate_gt: $start, expiryDate_lt: $end }
      first: 1000
      start: $pointer
    ) {
      domain {
        labelName
      }
      expiryDate
    }
  }
`

export const ENS_NAME_QUERY = gql`
  query ENSName($name: String!) {
    registrations(where: { labelName: $name }) {
      domain {
        labelName
        owner {
          id
        }
      }
      expiryDate
    }
  }
`
