import { useQuery } from '@apollo/react-hooks'
import {
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap'
import { ENS_QUERY } from '../../graphql/subgraph'
import { ENGLISH } from '../../dictionary/words'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import DateTimePicker from 'react-datetime-picker'

const ENGLISH_WORDS: string[] = ENGLISH.split('\n').map((word: string) =>
  word.toLowerCase(),
)
const DAY_MILLIS: number = 24 * 60 * 60 * 1000
const DAY: number = 24 * 60 * 60
const DEFAULT_START_DATE: Date = new Date(Date.now() - 90 * DAY_MILLIS)
const DEFAULT_END_DATE: Date = new Date(Date.now() - 83 * DAY_MILLIS)

const dateToTimestamp = (date: Date) => {
  return parseInt((date.getTime() / 1000).toFixed(0))
}

export const ENSDomainList = () => {
  const [start, setStart] = useState(DEFAULT_START_DATE)
  const [end, setEnd] = useState(DEFAULT_END_DATE)
  const [dictionaryEnabled, setDictionartScoreEnabled] = useState<boolean>(
    true,
  )
  const [lengthSortEnabled, setLengthSortEnabled] = useState<boolean>(true)

  const { loading, error, data } = useQuery(ENS_QUERY, {
    variables: {
      start: dateToTimestamp(start),
      end: dateToTimestamp(end),
      pointer: 0,
    },
  })

  return (
    <div>
      <h1>ENS Expiring Name Finder</h1>
      <p>
        Use this tool to search for when domains are about to be released. There
        are some helpful scoring tools that help find the good ones!
      </p>
      <Card bg="dark" style={{ padding: '10px' }}>
        <p>
          Note that the default start day is 90 days in the past, because a
          record that expired 90 days ago is about to be snipeable. You can look
          further in the past to see the records that have already expired but
          are not claimed yet.
        </p>

        <Container fluid="sm">
          <Row className="align-items-center">
            <Col xs="auto">
              <Form.Label>Search Start Date+Time: </Form.Label>
              <div style={{ backgroundColor: 'white' }}>
                <DateTimePicker
                  clearIcon={null}
                  value={start}
                  onChange={(date: Date) => setStart(date)}
                />
              </div>
            </Col>
            <Col xs="auto">
              <Form.Label>Search End Date+Time: </Form.Label>
              <div style={{ backgroundColor: 'white' }}>
                <DateTimePicker
                  clearIcon={null}
                  value={end}
                  onChange={(date: Date) => setEnd(date)}
                />
              </div>
            </Col>
            <Col xs="auto">
              <Form>
                <Col xs="auto">
                  <Form.Check
                    checked={lengthSortEnabled}
                    onChange={(event: any) =>
                      setLengthSortEnabled(event.target.checked)
                    }
                    type="switch"
                    id="custom-switch"
                    label="Score length"
                  />
                </Col>
                <Col xs="auto">
                  <Form.Check
                    checked={dictionaryEnabled}
                    onChange={(event: any) =>
                      setDictionartScoreEnabled(event.target.checked)
                    }
                    type="switch"
                    label="Score if English word"
                    id="disabled-custom-switch"
                  />
                </Col>
              </Form>
            </Col>
          </Row>
        </Container>
      </Card>

      <div style={{ marginTop: '10px', alignContent: 'center' }}>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <ENSResultTable
            data={data}
            error={error}
            scoreLength={lengthSortEnabled}
            scoreDictionary={dictionaryEnabled}
          />
        )}
      </div>
    </div>
  )
}
interface DisplayProps {
  data: any
  error: any
  scoreLength: boolean
  scoreDictionary: boolean
}
const MAX_SCORE = 1000
const MIN_BYTES_ENS = 3

const inDictionary = (word: string) => {
  //   const ENGLISH_WORDS: string[] = (await (await fetch(dictionaryText)).text()).split('\n')

  return ENGLISH_WORDS.includes(word.toLowerCase())
}
// score is based on the length of the
const score = (
  name: string,
  scoreLength: boolean,
  scoreDictionary: boolean,
): number => {
  let numBytes: number = Buffer.byteLength(name, 'utf8')
  // length max score is acheived by being of length 3. A longer name decreasing in score exponentially
  let lengthScore = scoreLength
    ? MAX_SCORE / (numBytes - (MIN_BYTES_ENS - 1))
    : 0
  // binary is word multiplier
  let dictionaryScore: number = scoreDictionary
    ? inDictionary(name)
      ? MAX_SCORE
      : 0
    : 0

  return lengthScore + dictionaryScore
}

export const ENSResultTable = (props: DisplayProps) => {
  const navigate = useNavigate()
  const { data, error, scoreLength, scoreDictionary } = props
  if (error) {
    return <Error error={error} />
  }
  console.log(data.registrations.length)
  let ensEntries: ENSEntry[] = data.registrations
    .map(parseRespones)
    // try to filter out some of the invalid addresses, these are worthless
    .filter((entry: ENSEntry) => entry.name === entry.name.toLowerCase()) 
    .map((ensEntry: ENSEntry) => {
      ensEntry.score = score(ensEntry.name, scoreLength, scoreDictionary)
      return ensEntry
    })
  return (
    <>
      <Table
        responsive
        striped
        bordered
        hover
        variant="dark"
        size="sm"
        cellPadding={'25px'}
      >
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Expiry Date</th>
            <th>Available at $100k Premium Date</th>
            <th>Available Date (No Premium)</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {ensEntries
            .sort((a, b) => b.score - a.score)
            .map((entry: ENSEntry, i: number) => {
              return (
                <tr onClick={() => navigate(`/ens/${entry.name}`)} key={i}>
                  <td>{i}</td>
                  <td>{entry.name}</td>
                  <td>
                    <DateComponent date={entry.expiryDate} />
                  </td>
                  <td>
                    <DateComponent date={entry.availableDate} />
                  </td>
                  <td>
                    <DateComponent date={entry.availableFreeDate} />
                  </td>
                  <td>{entry.score.toFixed(2)}</td>
                </tr>
              )
            })}
        </tbody>
      </Table>
    </>
  )
}

const isPast = (date: number, compare: number = Date.now()) => {
  return date < compare / 1000
}

const Error = (error: any) => {
  return (
    <div>
      Failed to fetch:
      {JSON.stringify(error)}
    </div>
  )
}
export const DateComponent = (props: any) => {
  const { date } = props
  return (
    <span
      style={{
        backgroundColor: isPast(date)
          ? 'red'
          : isPast(date, Date.now() + 1 * DAY_MILLIS)
          ? 'orange'
          : '',
      }}
    >
      {toHumanReadableDate(date)}
    </span>
  )
}

const toHumanReadableDate = (millis: number): string => {
  return (
    new Date(millis * 1000).toLocaleDateString() +
    ' ' +
    new Date(millis * 1000).toLocaleTimeString()
  ) //.toISOString().split('T')[0]
}

export interface ENSEntry {
  name: string
  expiryDate: number
  availableDate: number
  availableFreeDate: number
  score: number
  owner: string
}
export const parseRespones = (registration: any) => {
  let name: string = registration['domain']['labelName']
  let owner: string = registration['domain']['owner']
    ? registration['domain']['owner']['id']
    : ''
  let expiryDate: number = parseInt(registration['expiryDate'])
  let availableDate: number = expiryDate + 90 * DAY
  let availableFreeDate: number = expiryDate + 118 * DAY
  return {
    name,
    expiryDate,
    availableDate,
    availableFreeDate,
    owner,
  } as ENSEntry
}
