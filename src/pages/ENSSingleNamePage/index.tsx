import { useQuery } from '@apollo/react-hooks'
import {
  Button,
  Card,
  Col,
  Row,
  Spinner,
} from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { Link } from '../../components'
import {
  DateComponent,
  ENSEntry,
  parseRespones,
} from '../../components/ENSDomainList'
import { ENS_NAME_QUERY } from '../../graphql/subgraph'

export const ENSSingleNamePage = () => {
  const { name } = useParams()
  const { loading, error, data } = useQuery(ENS_NAME_QUERY, {
    variables: {
      name: name,
    },
  })
  if (error) {
    return <>{JSON.stringify(error)}</>
  }
  return (
    <div>
      <Card bg="dark">
        <Card.Header
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <h1>{name}.eth</h1>
        </Card.Header>
        <Card.Body>
          {loading ? <Spinner animation="border" /> : <CardBody data={data} />}
        </Card.Body>
      </Card>
    </div>
  )
}

const CardBody = (props: any) => {
  const { data } = props
  const entry: ENSEntry = parseRespones(data.registrations[0])

  return (
    <>
      <Row style={{ margin: '10px' }}>
        <Col>
          <Card bg="dark">
            <Card.Title>Current Owner:</Card.Title>
            <Card.Footer>
              <Link href={`https://etherscan.io/address/${entry.owner}`}>
                {entry.owner}
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        <Col>
          <Card bg="dark">
            <Card.Title>Expiry Date:</Card.Title>
            <Card.Footer>
              <DateComponent date={entry.expiryDate} />
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Row style={{ margin: '10px' }}>
        <Col>
          <Card bg="dark">
            <Card.Title>Available to purchase at a premium date:</Card.Title>
            <Card.Footer>
              <DateComponent date={entry.availableDate} />
            </Card.Footer>
          </Card>
        </Col>
        <Col>
          <Card bg="dark">
            <Card.Title>Available for free date:</Card.Title>
            <Card.Footer>
              <DateComponent date={entry.availableFreeDate} />
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Card.Footer>
        <Button
          style={{ float: 'right' }}
          onClick={() =>
            window.open(
              `https://app.ens.domains/name/${entry.name}.eth/register`,
              '_blank',
            )
          }
        >
          View on ENS App
        </Button>
      </Card.Footer>
    </>
  )
}
