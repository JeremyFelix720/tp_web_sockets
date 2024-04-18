import { useCallback, useEffect, useState } from 'react'
// import { useNavigate } from "react-router-dom";
import './App.css'
import { socket } from './modules/socket'

function App() {
  const [messageList, updateMessageList] = useState<string[]>([])
  const [newMessage, updateNewMessage] = useState<string>('')

  const [gameInProgress, updateGameInProgress] = useState<boolean>(false)
  const [gameInfo, updateGameInfo] = useState<string>('')
  const [endGameSentence, updateEndGameSentence] = useState<string>('')
  const [proposalNumber, updateProposalNumber] = useState<number>(0)

  // const navigate = useNavigate();

  useEffect(() => {

    // Avant de les créer et s'ils existent, on se désabonne de l'événement
    socket.off('chat message')
    socket.off('chouchou')
    socket.off('BOUM !!')

    // TP - GUESS THE NUMBER
    socket.off('start-game')
    socket.off('end-game')
    socket.off('hint')

    socket.on('chat message', (msg: string) => {
      console.log('new message received', msg)
      updateMessageList([...messageList, msg])
    })

    // Reception du message 'chouchou' de la part du serveur
    socket.on('chouchou', () => {
      updateMessageList([...messageList, 'chouchou'])
    })

    // Reception du message 'BOUM !!' de la part du serveur
    socket.on('BOUM !!', () => {
      updateMessageList([...messageList, 'BOUM !!'])
    })


    // TP - GUESS THE NUMBER

    socket.on('start-game', () => {
      console.log('start game')
      updateGameInProgress(true)
      updateGameInfo("Début d'une partie : trouver un nombre entre 1 et 100")
    })

    socket.on('end-game', (sentence: string) => {
      updateEndGameSentence(sentence)
    })

    // Reception du message (variable en fonction de la dernière valeur) de la part du serveur
    socket.on('hint', (hint: string) => {
      updateGameInfo(hint)
    })

    // Quand le composant se démonte...
    return () => {
      socket.off('chat message')
      socket.off('chouchou')
      socket.off('BOUM !!')

      socket.off('start-game')
      socket.off('end-game')
      socket.off('proposal-number')
    }
  })



  const handleChangeProposalNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProposalNumber(parseInt(e.target.value))
  }

  const handleSendProposalNumber = () => {
    socket.emit('proposalNumber', proposalNumber)
  }


  const handleStartGuessTheNumberGame = useCallback(() => {
    updateGameInProgress(true);
  }, [])

  const handleLeaveGuessTheNumberGame = useCallback(() => {
    updateGameInProgress(false);
  }, [])


  return (
    <div>
      { gameInProgress === false ?

        <div>
          <h1>HOME</h1>

          {/* Affichage du message reçu par le serveur */}
          <ul>
            {messageList.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>

          <form action="">
            <input 
              type="text"
              id="message" 
              onChange={(e) => updateNewMessage(e.target.value)}
              value={newMessage} 
            />
            <button
              onClick={(e) => {
                e.preventDefault()
                socket.emit('chat message', newMessage)
                updateNewMessage('')
              }}
            >
              Send
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                socket.emit('send-others-a-message', newMessage)
                updateNewMessage('')
              }}
            >
              Send to others
            </button>

            <button
              onClick={(e) => {
                e.preventDefault()
                socket.emit('send-to-last-socket', newMessage)
                updateNewMessage('')
              }}
            >
              Send to last socket
            </button>

            <button
              onClick={(e) => {
                e.preventDefault()
                socket.emit('patate')
                //updateNewMessage('')
              }}
            >
              Envoyer 'PATATE' au serveur
            </button>

            <button
              onClick={(e) => {
                e.preventDefault()
                socket.emit('BIM !')
              }}
            >
              Envoyer 'BIM !' au serveur
            </button>

            <button
              onClick={handleStartGuessTheNumberGame}
            >
              Commencer une partie de "Devinez le nombre !"
            </button>

          </form>
        </div>

      :
      <div>
        <h1>GUESS THE NUMBER GAME</h1>
        { endGameSentence !== '' ?
          endGameSentence
        :
        <div>
          <h2>{gameInfo}</h2>
            <input 
              type="number"
              id="game_info" 
              value={proposalNumber} 
              onChange={handleChangeProposalNumber}
            />
            <button onClick={handleSendProposalNumber}>Proposer le nombre</button>
        </div>

        }

        <button
            onClick={handleLeaveGuessTheNumberGame}
          >
            Quitter la partie
        </button>

      </div>

      }


    </div>
  )
}

export default App
