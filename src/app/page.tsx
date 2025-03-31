'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import Image from 'next/image'

export default function Page() {
  const [mounted, setMounted] = useState(false)
  const [ethJpy, setEthJpy] = useState<number | null>(null)

  useEffect(() => setMounted(true), [])

  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })

  const metamask = connectors.find(c => c.type === 'metaMask')

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=jpy')
      .then(res => res.json())
      .then(data => setEthJpy(data.ethereum.jpy))
  }, [])

  if (!mounted) return null
  if (!metamask) return <p>MetaMask is not available</p>

  const eth = parseFloat(balance?.formatted ?? '0')
  const jpy = ethJpy ? eth * ethJpy : 0

  return (
    <div>
      <h1>Wallet Connect</h1>
      {isConnected ? (
        <>
        <p>✅ Connected: {address}</p>
        <p>💰 {eth.toFixed(5)} ETH</p>
        <p>💴 ¥{Math.round(jpy).toLocaleString()} JPY</p>
        <button
          onClick={() => disconnect()}
          className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-orange-600 transition"
        >
          🔌 Disconnect
        </button>
      </>
      ) : (
        <button
          onClick={() => connect({ connector: metamask })}
          className="flex items-center gap-2 bg-orange-400 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-orange-500 transition min-w-[200px]"
        >
          <Image src="/metamask.svg" alt="MetaMask" width={24} height={24} priority />
          Connect MetaMask
        </button>
      )}
    </div>
  )
}
