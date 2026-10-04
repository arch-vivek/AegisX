import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react"
import { PATHS, pageFromPath, type PageId, type RoutedPage } from "./routes"

interface RouterValue {
  page: PageId
  navigate: (to: RoutedPage) => void
}

const RouterContext = createContext<RouterValue | null>(null)

export function RouterProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>(() => pageFromPath(window.location.pathname))

  useEffect(() => {
    const onPop = () => setPage(pageFromPath(window.location.pathname))
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  const navigate = useCallback((to: RoutedPage) => {
    if (window.location.pathname !== PATHS[to]) window.history.pushState(null, "", PATHS[to])
    setPage(to)
  }, [])

  const value = useMemo(() => ({ page, navigate }), [page, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter(): RouterValue {
  const value = useContext(RouterContext)
  if (!value) throw new Error("useRouter must be used inside RouterProvider")
  return value
}

export function Link({ to, onClick, children, ...props }: { to: RoutedPage } & Omit<ComponentProps<"a">, "href">) {
  const { navigate } = useRouter()
  function handle(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return (
    <a href={PATHS[to]} onClick={handle} {...props}>
      {children}
    </a>
  )
}
