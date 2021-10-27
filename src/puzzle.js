import web3 from './web3'

const puzzle = new web3.eth.Contract(
    JSON.parse(process.env.REACT_APP_PUZZLE_ABI),
    process.env.REACT_APP_PUZZLE_ADDRESS
)

export default puzzle;