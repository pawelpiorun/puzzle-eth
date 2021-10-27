import web3 from './web3'

const abi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"winner","type":"address"},{"indexed":false,"internalType":"uint256","name":"prize","type":"uint256"}],"name":"AnswerGuessed","type":"event"},{"anonymous":false,"inputs":[],"name":"NewAnswer","type":"event"},{"inputs":[{"internalType":"string","name":"word","type":"string"}],"name":"guessAnswer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"prize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"puzzleID","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"word","type":"string"},{"internalType":"uint64","name":"id","type":"uint64"}],"name":"setNewAnswer","outputs":[],"stateMutability":"payable","type":"function"}]';

const puzzle = new web3.eth.Contract(
    JSON.parse(abi),
    process.env.REACT_APP_PUZZLE_ADDRESS
)

export default puzzle;