import { useState, useEffect, useRef } from 'react'

const APPEAR_ANIMATION_DURATION = 1000
const APPEAR_ANIMATION_DELAY = 200

const ERROR_ANIMATION_DURATION = 20
const ERROR_ANIMATION_COUNT = 15
const ERROR_COLOR = '#e81b00'

const ELEM_NUM = 3

export default function usePrompt() {
    const [styles, setStyles] = useState(initStyles())
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setTimeout(() => {
            resetStyles(setStyles)
            inputRef.current?.focus()
        }, APPEAR_ANIMATION_DURATION + APPEAR_ANIMATION_DELAY * ELEM_NUM)
    }, [])

    return (
        <div className='prompt'>
            <span style={styles[0]}>Type a Word</span>
            <input
                type='text'
                style={styles[1]}
                ref={inputRef}
            />
            <button
                className='elementify'
                style={styles[2]}
                onClick={e => handleClick(e, inputRef, setStyles)}
            >Elementify
            </button>
        </div>
    )
}

function initStyles() {
    const styles: React.CSSProperties[] = []
    let delay = APPEAR_ANIMATION_DELAY
    for (let i = 0; i < ELEM_NUM; i++) {
        styles.push({
            opacity: 0,
            pointerEvents: 'none',
            animationName: 'appear',
            animationDuration: `${APPEAR_ANIMATION_DURATION}ms`,
            animationDelay: `${delay}ms`,
            animationTimingFunction: 'ease',
            animationFillMode: 'forwards'
        })
        delay += APPEAR_ANIMATION_DELAY
    }
    return styles
}

function resetStyles(setStyles: React.Dispatch<React.SetStateAction<React.CSSProperties[]>>) {
    setStyles(new Array(ELEM_NUM).fill(undefined))
}

async function handleClick(e: React.MouseEvent, inputRef: React.RefObject<HTMLInputElement>, setStyles: React.Dispatch<React.SetStateAction<React.CSSProperties[]>>) {
    const styles: React.CSSProperties[] = []
    if (inputRef.current?.value.trim() == '') {
        // Add shake animation
        const style: React.CSSProperties = {
            animationName: 'shake',
            animationDuration: `${ERROR_ANIMATION_DURATION}ms`,
            animationIterationCount: ERROR_ANIMATION_COUNT,
            pointerEvents: 'none'
        }
        styles[0] = { ...style, color: ERROR_COLOR }
        styles[1] = { ...style, borderBottomColor: ERROR_COLOR }
        styles[2] = { ...style, backgroundColor: ERROR_COLOR }
        setStyles(styles)

        // Reset inline CSS
        await new Promise(res => setTimeout(res, ERROR_ANIMATION_DURATION * ERROR_ANIMATION_COUNT))
        resetStyles(setStyles)
    } else {
        let delay = 0
        for (let i = ELEM_NUM - 1; i >= 0; i--) {
            styles[i] = {
                pointerEvents: 'none', 
                animationName: 'disappear',
                animationDuration: `${APPEAR_ANIMATION_DURATION}ms`,
                animationDelay: `${delay}ms`,
                animationTimingFunction: 'ease-in',
                animationFillMode: 'forwards'
            }
            delay += APPEAR_ANIMATION_DELAY
        }
        setStyles(styles)
    }
}