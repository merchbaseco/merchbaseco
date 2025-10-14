import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'

type LogoSphereClientModule = {
  LogoSphereClient: ComponentType
}

const Fallback = () => <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/40 to-purple-500/40" />

export function LogoSphere() {
  const [ClientComponent, setClientComponent] = useState<ComponentType | null>(null)

  useEffect(() => {
    let mounted = true

    import('./LogoSphere.client')
      .then((module: LogoSphereClientModule) => {
        if (mounted) {
          setClientComponent(() => module.LogoSphereClient)
        }
      })
      .catch(() => {
        // keep rendering the fallback if the dynamic import fails during hydration
      })

    return () => {
      mounted = false
    }
  }, [])

  if (!ClientComponent) {
    return <Fallback />
  }

  return <ClientComponent />
}
