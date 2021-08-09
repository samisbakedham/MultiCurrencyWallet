import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import CSSModules from 'react-css-modules'
import styles from './index.scss'
import { externalConfig, localStorage, constants, links } from 'helpers'
import QuickSwap from './QuickSwap'
import AtomicSwap from './AtomicSwap'

function Exchange(props) {
  const { location, history } = props

  const exchangeSettings = localStorage.getItem(constants.localStorage.exchangeSettings) || {}
  let initialState = location.pathname === '/exchange/quick' ? 'quick' : 'atomic'

  if (exchangeSettings.swapMode) {
    initialState = exchangeSettings.swapMode
  } else {
    exchangeSettings.swapMode = initialState
    localStorage.setItem(constants.localStorage.exchangeSettings, exchangeSettings)
  }

  const [swapMode, setSwapMode] = useState(initialState)

  const openAtomicMode = () => {
    if (exchangeSettings.atomicCurrency) {
      const { sell, buy } = exchangeSettings.atomicCurrency

      history.push(`${links.exchange}/${sell}-to-${buy}`)
    }

    updateSwapMode('atomic')
  }

  const openQuickMode = () => {
    if (exchangeSettings.quickCurrency) {
      const { sell, buy } = exchangeSettings.quickCurrency

      history.push(`${links.exchange}/quick/${sell}-to-${buy}`)
    } else {
      history.push(`${links.exchange}/quick`)
    }

    updateSwapMode('quick')
  }

  const updateSwapMode = (mode) => {
    setSwapMode(mode)
    const exchangeSettings = localStorage.getItem(constants.localStorage.exchangeSettings)

    exchangeSettings.swapMode = mode
    localStorage.setItem(constants.localStorage.exchangeSettings, exchangeSettings)
  }

  return (
    <div>
      <div styleName="tabsWrapper">
        <button styleName={`tab ${swapMode === 'atomic' ? 'active' : ''}`} onClick={openAtomicMode}>
          <FormattedMessage id="atomicSwap" defaultMessage="Atomic swap" />
        </button>
        <button
          styleName={`tab  ${swapMode === 'quick' ? 'active' : ''} ${
            externalConfig.entry === 'testnet' ? 'disabled' : ''
          }`}
          onClick={externalConfig.entry === 'mainnet' ? openQuickMode : undefined}
        >
          <FormattedMessage id="quickSwap" defaultMessage="Quick swap" />
        </button>
      </div>

      {/*
      pass props from this component into the components
      because there has to be "url" props like match, location, etc.
      but this props are only in the Router children */}
      {swapMode === 'atomic' && <AtomicSwap {...props} />}

      {/* this swap type is available only on mainnet networks */}
      {swapMode === 'quick' && externalConfig.entry === 'mainnet' && (
        <div styleName="container">
          <QuickSwap {...props} />
        </div>
      )}
    </div>
  )
}

export default CSSModules(Exchange, styles, { allowMultiple: true })
