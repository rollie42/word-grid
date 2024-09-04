import styled from "styled-components"
import { HFlex, VFlex } from "../Utils"
import { createContext, FC, useContext, useRef, useState } from "react"
import { deserializeSettings, GameDef, serializeSettings } from "./gameSettings"
import { useParams, useSearch } from "@tanstack/react-router"

const Cell = styled(VFlex)({
    minHeight: '210px',
    minWidth: '260px',
    maxHeight: '210px',
    maxWidth: '260px',
    justifyContent: 'end',
    alignItems: 'center',
    fontSize: 18
})

const CellH = styled(Cell)({
    minHeight: '0px'
})
const Cell1 = styled(Cell)({
    minWidth: '120px',
    paddingRight: '20px',
})
const CellH1 = styled(Cell1)({
    minHeight: '0px'
})
const CellX = styled(Cell)({
    border: '1px solid black'
})
const CellXContent = styled(HFlex)({
    gap: "5px"
})
const CellXHint = styled.div({ minHeight: '70px', maxHeight: '70px', fontSize: 36,  color: 'black', fontWeight: 'bold'})
const GuessInput = styled.input({
    
    
})
const CText: FC<{guessIdx: number}> = ({guessIdx}) => {    
    const userGuess = useUserGuess()
    const change = (e) => {
        userGuess['g' + guessIdx][1](e.target.value)
    }
    return <HFlex style={{borderBottom: `2px solid black`, minHeight: 50, maxHeight: 50}}>
        <GuessInput style={{backgroundColor: colors['c' + guessIdx], marginBottom: '11px', padding: '2px 8px', minWidth: '80px', maxWidth: '80px', justifyContent: 'center'}} type="text" value={userGuess['g' + guessIdx][0]} onChange={change} />
    </HFlex>
}
const colors = {
    c1: 'blue',
    c2: 'green',
    c3: 'red',
    c4: 'purple',
} as const

const testGameDef: GameDef = {
    w1: "COME",
    w2: "GO",
    w3: "ON",
    w4: "OFF",
    h1: "Hurry",
    h2: "Continue",
    h3: "Appear",
    h4: "Explode"
} as const 

const useGameDef = () => {
    const params = useSearch({
        strict: false
    })
    const def = params['def']
    return def ? deserializeSettings(def) : testGameDef
}

const CreateGameDialog = styled.dialog({

})

const InputCont = styled(HFlex)({
    gap: 10

})
const Label = styled.div({

})
const Input = styled.input({

})

const CreateGame = () => {
    const [newGameUrl, setNewGameUrl] = useState<string | undefined>()
    const i1 = useRef<HTMLInputElement>(null)
    const i2 = useRef<HTMLInputElement>(null)
    const i3 = useRef<HTMLInputElement>(null)
    const i4 = useRef<HTMLInputElement>(null)
    const h1 = useRef<HTMLInputElement>(null)
    const h2 = useRef<HTMLInputElement>(null)
    const h3 = useRef<HTMLInputElement>(null)
    const h4 = useRef<HTMLInputElement>(null)
    const dRef = useRef<HTMLDialogElement>(null)
    const create = () => {
        const settings: GameDef = {
            w1: i1.current?.value ?? '',
            w2: i2.current?.value ?? '',
            w3: i3.current?.value ?? '',
            w4: i4.current?.value ?? '',
            h1: h1.current?.value ?? '',
            h2: h2.current?.value ?? '',
            h3: h3.current?.value ?? '',
            h4: h4.current?.value ?? ''
        }
        const newUrl = window.location.origin + "?def=" + serializeSettings(settings)
        setNewGameUrl(newUrl)
    }
    return <>
        <button onClick={() => dRef.current?.showModal()}>Create new game!</button>
        <CreateGameDialog ref={dRef}>
            <VFlex style={{gap: 10}}>
                <div>Create your own game!</div>
                <InputCont>
                    <Label>Secret word 1</Label>
                    <Input ref={i1} type="text" />
                </InputCont>
                <InputCont>
                    <Label>Secret word 2</Label>
                    <Input ref={i2} type="text" />
                </InputCont>
                <InputCont>
                    <Label>Secret word 3</Label>
                    <Input ref={i3} type="text" />
                </InputCont>
                <InputCont>
                    <Label>Secret word 4</Label>
                    <Input ref={i4} type="text" />
                </InputCont>
                <InputCont>
                    <Label>Hint (word 1 + word3)</Label>
                    <Input ref={h1} type="text" />
                </InputCont>
                <InputCont>
                    <Label>Hint (word 2 + word 3)</Label>
                    <Input ref={h2} type="text" />
                </InputCont>
                <InputCont>
                    <Label>Hint (word 1 + word 4)</Label>
                    <Input ref={h3} type="text" />
                </InputCont>
                <InputCont>
                    <Label>Hint (word 2 + word 4)</Label>
                    <Input ref={h4} type="text" />
                </InputCont>
                <button onClick={create}>Create game!</button>
                <VFlex>
                    <Label>New URL:</Label>
                    <Label>{newGameUrl}</Label>
                    <HFlex></HFlex>
                </VFlex>
            </VFlex>
        </CreateGameDialog>
    </>
}

interface UserGuesses {
    g1: [string, (s: string) => void]
    g2: [string, (s: string) => void]
    g3: [string, (s: string) => void]
    g4: [string, (s: string) => void]
}

const UserGuessContext = createContext<UserGuesses>({} as any)
const useUserGuess = () => useContext(UserGuessContext)

const GameChecker = () => {
    const gameDef = useGameDef()
    const userGuess = useUserGuess()    
    const incorrect = [1,2,3,4].some((i) => gameDef['w' + i].toUpperCase() !== userGuess['g' + i][0].toUpperCase())
    return <HFlex style={{justifyContent: 'center', alignItems:'center', gap: 20, marginTop: 14}}>
        <div style={{fontSize: 22}}>Correct?:</div>
        {incorrect ? <div style={{fontSize: 22, color: 'red'}}>No</div> : <div style={{fontSize: 28, color: 'green'}}>Yes!</div>}
    </HFlex>
}
export const Game = () => {
    const g1=  useState<string>('')
    const g2=  useState<string>('')
    const g3=  useState<string>('')
    const g4=  useState<string>('')

    const gameDef = useGameDef()
    return <UserGuessContext.Provider value={{g1, g2, g3, g4}}>
        <div>
            <VFlex style={{backgroundColor: 'white', padding: "40px"}}>
                <HFlex>
                    <CellH1></CellH1>
                    <CellH><CText guessIdx={1} /></CellH>
                    <CellH><CText guessIdx={2} /></CellH>
                </HFlex>
                <HFlex>
                    <Cell1>
                        <CText guessIdx={3} />
                        <CellXHint></CellXHint>    
                    </Cell1>
                    <CellX>
                        <CellXContent>
                            <CText guessIdx={1} />
                            <CText guessIdx={3} />
                        </CellXContent>
                        <CellXHint>{gameDef.h1}</CellXHint>
                    </CellX>
                    <CellX>
                        <CellXContent>
                            <CText guessIdx={2} />
                            <CText guessIdx={3} />
                        </CellXContent>
                        <CellXHint>{gameDef.h2}</CellXHint>
                    </CellX>
                </HFlex>
                <HFlex>
                    <Cell1>
                        <CText guessIdx={4} />
                        <CellXHint></CellXHint>
                    </Cell1>
                    <CellX>
                        <CellXContent>
                            <CText guessIdx={1} />
                            <CText guessIdx={4} />
                        </CellXContent>
                        <CellXHint>{gameDef.h3}</CellXHint>
                    </CellX>
                    <CellX>
                        <CellXContent>
                            <CText guessIdx={2} />
                            <CText guessIdx={4} />
                        </CellXContent>
                        <CellXHint>{gameDef.h4}</CellXHint>
                    </CellX>
                </HFlex>
                <GameChecker />
            </VFlex>
            <CreateGame />
        </div>
    </UserGuessContext.Provider>
}