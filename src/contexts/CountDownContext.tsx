import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountDownContextData {
    minutes: number;
    seconds: number;
    isActive: boolean;
    hasFinished: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
}

export const CountDownContext = createContext({} as CountDownContextData);

interface CountDownProviderProps {
    children: ReactNode;
}

let countdownTimeout: NodeJS.Timeout;

export function CountDownProvider({ children }: CountDownProviderProps) {
    const [time, setTime] = useState(0.1 * 60);
    const [isActive, setisActive] = useState(false);
    const [hasFinished, sethasFinished] = useState(false);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    
    const { startNewChallenge } = useContext(ChallengesContext);

    function startCountdown() {
        setisActive(true);
      }
    
      function resetCountdown() {
        setisActive(false);
        sethasFinished(false);
        clearTimeout(countdownTimeout);
        setTime(25 * 60);
      }

    useEffect(() => {
        if (isActive && time > 0) {
            countdownTimeout = setTimeout(() => {
                setTime(time - 1);
            }, 1000)
        } else if (isActive && time === 0) {
            sethasFinished(true);
            setisActive(false);
            startNewChallenge();
        }
    }, [isActive, time])


    return (
        <CountDownContext.Provider value={{
            minutes,
            seconds,
            isActive,
            hasFinished,
            startCountdown,
            resetCountdown,
        }}>
            {children}
        </CountDownContext.Provider>)
}