'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'

export default function Page() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  if (!mounted) return null

  const metamask = connectors.find(c => c.type === 'metaMask')
  if (!metamask) {
    return <p>MetaMask is not available</p>
  }

  return (
    <div>
      <h1>Wallet Connect</h1>
      {isConnected ? (
        <p>Connected: {address}</p>
      ) : (
        <button onClick={() => connect({ connector: metamask })}>
          Connect MetaMask
        </button>
      )}
    </div>
  )
}
