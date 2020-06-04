import {
    createStore,
    combineReducers
} from 'redux'

export interface DiceRoll {
    count: number
    faces: number
}

export interface DiceState {
    dice: number[]
}

export const ROLL_DICE = 'ROLL_DICE'
export const RESET_DICE = 'RESET_DICE'

interface RollDiceAction {
    type: typeof ROLL_DICE;
    payload: DiceRoll;
}

interface ResetDiceAction {
    type: typeof RESET_DICE;
    payload: number[]
}

export type DiceRollActionTypes = RollDiceAction | ResetDiceAction

export function rollDice(diceroll: DiceRoll) {
    console.log('hey')
    return {
        type: ROLL_DICE,
        payload: diceroll
    }
}

export function resetDice(emptySet: number[] = []) {
    return {
        type: RESET_DICE,
        payload: emptySet
    }
}

const initialState: DiceState = {
    dice: []
}

export function diceReducer(
    state = initialState,
    action: DiceRollActionTypes
): DiceState {
    switch( action.type ) {
        case ROLL_DICE:

            const { count, faces } = action.payload
            const query = `query RollDice($count: Int!, $faces: Int) {
              rollDice(numDice: $count, numSides: $faces)
            }`

            fetch('http://localhost:4000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    query,
                    variables: { count, faces }
                })
                })
                .then( res => res.json())
                .then( json => {
                    return {
                        dice: json.data.rollDice
                    }
                })
                .catch( err => {
                    return {
                        dice: []
                    }
                })
            case RESET_DICE:
                return {
                    dice: []
                }
        default:
            return state;
    }
}



/** Root Reducer */
const rootReducer = combineReducers({
    dice: diceReducer,
})

export type AppState = ReturnType<typeof rootReducer>

export default function configureStore() {
    return createStore(rootReducer)
}