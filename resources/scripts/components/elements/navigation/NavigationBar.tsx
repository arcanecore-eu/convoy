import { useStoreActions, useStoreState } from '@/state'
import { AdminBanner } from '@/routers/AdminDashboardRouter'
import { bindUrlParams } from '@/util/helpers'
import {
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { Burger, LoadingOverlay } from '@mantine/core'
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import {
    Link,
    NavLink as RouterNavLink,
    matchPath,
    useLocation,
    useMatch,
    useMatches,
    useNavigate,
} from 'react-router-dom'

import http from '@/api/http'

import ContentContainer from '@/components/elements/ContentContainer'
import NavLink from '@/components/elements/navigation/NavLink'
import NavigationDropdown from '@/components/elements/navigation/NavigationDropdown'
import UserDropdown from '@/components/elements/navigation/UserDropdown'

export interface RouteDefinition {
    name: string
    path: string
    end?: boolean
}

interface NavigationBarContextInterface {
    routes: RouteDefinition[]
    setRoutes: (routes: RouteDefinition[]) => void
    breadcrumb?: string | null
    setBreadcrumb: (breadcrumb: string | null | undefined) => void
}

export const NavigationBarContext =
    createContext<NavigationBarContextInterface>({
        routes: [],
        setRoutes: () => {},
        breadcrumb: null,
        setBreadcrumb: () => {},
    })

interface SidebarLinkProps {
    to: string
    children: ReactNode
    icon: ReactNode
    end?: boolean
}

const SidebarLink = ({
    to,
    children,
    icon,
    end,
}: SidebarLinkProps) => (
    <RouterNavLink
        to={to}
        end={end}
        className='group relative -mr-3 flex h-11 items-center overflow-hidden pl-3 pr-6 text-[15px]'
    >
        {({ isActive }) => (
            <>
                <span
                    className={`absolute inset-0 bg-gradient-to-l from-[rgba(89,47,188,0.30)] via-[rgba(89,47,188,0.11)] to-transparent transition-opacity ${
                        isActive
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                    }`}
                />

                <span
                    className={`absolute right-0 top-0 bottom-0 w-[3px] bg-secondary transition-opacity ${
                        isActive
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                    }`}
                />

                <span
                    className={`relative z-10 w-5 shrink-0 text-[20px] leading-none ${
                        isActive
                            ? 'text-secondary'
                            : 'text-muted group-hover:text-secondary'
                    }`}
                >
                    {icon}
                </span>

                <span
                    className={`relative z-10 ml-3 truncate ${
                        isActive
                            ? 'font-semibold text-foreground'
                            : 'font-medium text-muted group-hover:text-foreground'
                    }`}
                >
                    {children}
                </span>
            </>
        )}
    </RouterNavLink>
)

const LegacyAdminNavigation = ({ logout }: { logout: () => void }) => {
    const { routes, breadcrumb } = useContext(NavigationBarContext)
    const matches = useMatches()

    return (
        <div className='bg-surface w-full'>
            <AdminBanner />

            <ContentContainer className='py-2.5 relative'>
                <div className='flex justify-between items-center gap-4'>
                    <div className='flex shrink overflow-hidden space-x-4 items-center'>
                        <Link
                            to='/admin'
                            className='flex items-center space-x-2.5'
                        >
                            <img
                                src='https://arcanecore.eu/storage/favicon.ico'
                                alt='Arcane Core'
                                className='w-6 h-6 object-contain'
                            />
                            <h1 className='font-semibold text-sm text-foreground'>
                                Arcane Core
                            </h1>
                        </Link>

                        {breadcrumb && (
                            <>
                                <span className='text-border'>/</span>
                                <p className='font-medium text-sm text-foreground truncate'>
                                    {breadcrumb}
                                </p>
                            </>
                        )}
                    </div>

                    <div className='hidden sm:block w-[240px]'>
                        <UserDropdown
                            logout={logout}
                            compact
                            position='bottom-end'
                        />
                    </div>
                </div>
            </ContentContainer>

            <div className='bg-surface border-b border-border'>
                <ContentContainer className='flex overflow-x-auto scrollbar-hide'>
                    {routes.map(route => (
                        <NavLink
                            end={route.end}
                            key={route.path}
                            to={bindUrlParams(
                                route.path,
                                matches[matches.length - 1].params
                            )}
                        >
                            {route.name}
                        </NavLink>
                    ))}
                </ContentContainer>
            </div>
        </div>
    )
}

const NavigationBar = () => {
    const { routes, breadcrumb } = useContext(NavigationBarContext)

    const user = useStoreState(state => state.user.data!)
    const theme = useStoreState(state => state.settings.data!.theme)
    const setTheme = useStoreActions(actions => actions.settings.setTheme)

    const [menuVisible, setMenuVisible] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const isAdminArea = useMatch('/admin/*')
    const matches = useMatches()
    const location = useLocation()
    const navigate = useNavigate()

    const serverMatch = location.pathname.match(/^\/servers\/([^/]+)/)
    const serverId = serverMatch?.[1]

    const logout = () => {
        setIsLoggingOut(true)

        http.post('/logout').finally(() => {
            // @ts-expect-error
            window.location = '/'
        })
    }

    useEffect(() => {
        if (location.pathname === '/') {
            setSearchValue(
                new URLSearchParams(location.search).get('q') ?? ''
            )
        }
    }, [location.pathname, location.search])

    const activeRoute = useMemo(() => {
        if (!routes.length || !matches.length) return undefined

        const params = matches[matches.length - 1].params

        return routes.find(route => {
            const path = bindUrlParams(route.path, params)

            return Boolean(
                matchPath(
                    {
                        path,
                        end: route.end ?? false,
                    },
                    location.pathname
                )
            )
        })
    }, [routes, matches, location.pathname])

    const settingsChild = useMemo(() => {
        if (!serverId) return undefined

        if (location.pathname.endsWith('/settings/general')) return 'General'
        if (location.pathname.endsWith('/settings/hardware')) return 'Hardware'
        if (location.pathname.endsWith('/settings/network')) return 'Network'
        if (location.pathname.endsWith('/settings/security')) return 'Security'

        return undefined
    }, [serverId, location.pathname])

    const submitSearch = (event: React.FormEvent) => {
        event.preventDefault()

        const query = searchValue.trim()

        navigate(query ? `/?q=${encodeURIComponent(query)}` : '/')
    }

    if (isAdminArea) {
        return (
            <>
                <LoadingOverlay visible={isLoggingOut} zIndex={4000} />
                <LegacyAdminNavigation logout={logout} />
            </>
        )
    }

    return (
        <>
            <LoadingOverlay visible={isLoggingOut} zIndex={4000} />

            <aside className='hidden md:flex fixed inset-y-0 left-0 z-[2500] w-[252px] bg-surface border-r border-border flex-col'>
               <div className='h-14 px-4 flex items-center border-b border-border shrink-0'>
    <Link
        to='/'
        className='flex items-center gap-2.5 min-w-0'
    >
        <img
            src='https://arcanecore.eu/storage/favicon.ico'
            alt='Arcane Core'
            className='w-6 h-6 object-contain shrink-0'
        />

        <span className='text-sm font-semibold text-foreground truncate'>
            Arcane Core
        </span>
    </Link>
</div>

                <nav className='flex-1 overflow-y-auto px-3 py-5'>
                    <p className='px-3 mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted'>
                        Resources
                    </p>

                    <SidebarLink
                        to='/'
                        end
                        icon={<i className='ri-server-line' />}
                    >
                        Servers
                    </SidebarLink>

                    {serverId && (
                        <>
                            <p className='px-3 mt-7 mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted'>
                                Server Management
                            </p>

                            <SidebarLink
                                to={`/servers/${serverId}`}
                                end
                                icon={<i className='ri-dashboard-line' />}
                            >
                                Overview
                            </SidebarLink>

                            <SidebarLink
                                to={`/servers/${serverId}/terminal`}
                                icon={<i className='ri-terminal-box-line' />}
                            >
                                Console
                            </SidebarLink>

                            <SidebarLink
                                to={`/servers/${serverId}/backups`}
                                icon={<i className='ri-archive-line' />}
                            >
                                Backups
                            </SidebarLink>

                            <p className='px-3 mt-7 mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted'>
                                Settings
                            </p>

                            <SidebarLink
                                to={`/servers/${serverId}/settings/general`}
                                icon={<i className='ri-settings-3-line' />}
                            >
                                General
                            </SidebarLink>

                            <SidebarLink
                                to={`/servers/${serverId}/settings/hardware`}
                                icon={<i className='ri-cpu-line' />}
                            >
                                Hardware
                            </SidebarLink>

                            <SidebarLink
                                to={`/servers/${serverId}/settings/network`}
                                icon={<i className='ri-global-line' />}
                            >
                                Network
                            </SidebarLink>

                            <SidebarLink
                                to={`/servers/${serverId}/settings/security`}
                                icon={<i className='ri-shield-keyhole-line' />}
                            >
                                Security
                            </SidebarLink>
                        </>
                    )}

                    {user.rootAdmin && (
                        <>
                            <p className='px-3 mt-7 mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted'>
                                Management
                            </p>

                            <SidebarLink
                                to='/admin'
                                icon={<i className='ri-admin-line' />}
                            >
                                Admin
                            </SidebarLink>
                        </>
                    )}
                </nav>

                <div className='border-t border-border p-3 shrink-0 bg-surface'>
                    <UserDropdown logout={logout} />
                </div>
            </aside>

            <header className='fixed top-0 left-0 md:left-[252px] right-0 z-[2400] h-14 bg-surface border-b border-border'>
                <div className='h-full px-4 sm:px-6 lg:px-7 flex items-center gap-4'>
                    <div className='md:hidden flex items-center gap-2.5 min-w-0 mr-auto'>
    <img
        src='https://arcanecore.eu/storage/favicon.ico'
        alt='Arcane Core'
        className='w-6 h-6 object-contain shrink-0'
    />

    <span className='text-sm font-semibold text-foreground truncate'>
        Arcane Core
    </span>
</div>

                    <div className='hidden md:flex items-center min-w-0 text-sm mr-auto'>
                        
                    </div>

                    <form
                        onSubmit={submitSearch}
                        className='hidden sm:block w-full max-w-[320px]'
                    >
                        <div className='relative'>
                            <MagnifyingGlassIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-muted pointer-events-none' />

                            <input
                                type='search'
                                value={searchValue}
                                onChange={event =>
                                    setSearchValue(event.currentTarget.value)
                                }
                                placeholder='Search for servers'
                                className='w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-surface text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors'
                            />
                        </div>
                    </form>

                    <div className='flex items-center gap-4'>
                        {/* Support Center */}
                        <a
                            href='https://arcanecore.eu/tickets'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-1.5 text-muted text-sm font-medium hover:text-foreground transition-colors'
                            title='Support Center'
                        >
                            <i className='ri-headphone-line text-[22px]' />
                            <span className='hidden lg:inline'>Support</span>
                        </a>

                        {/* Discord */}
                        <a
                            href='https://discord.gg/pN8B72Hfjx'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center gap-1.5 text-muted text-sm font-medium hover:text-foreground transition-colors'
                            title='Join our Discord'
                        >
                            <i className='ri-discord-fill text-[22px]' />
                            <span className='hidden lg:inline'>Discord</span>
                        </a>

                        {/* Theme Toggle - PURE ICON, NO BOX */}
                        <button
                            aria-label='Toggle appearance'
                            title={
                                theme === 'dark'
                                    ? 'Switch to light mode'
                                    : 'Switch to dark mode'
                            }
                            onClick={() =>
                                setTheme(theme === 'light' ? 'dark' : 'light')
                            }
                            className='text-muted hover:text-secondary transition-colors p-0 m-0 bg-transparent border-none outline-none inline-flex'
                        >
                            {theme === 'dark' ? (
                                <i className='ri-sun-line text-[22px]' />
                            ) : (
                                <i className='ri-moon-line text-[22px]' />
                            )}
                        </button>
                    </div>

                    <Burger
                        className='md:hidden'
                        size='sm'
                        color='var(--color-foreground)'
                        opened={menuVisible}
                        onClick={() => setMenuVisible(value => !value)}
                    />
                </div>
            </header>

            <NavigationDropdown
                onClose={() => setMenuVisible(false)}
                logout={logout}
                visible={menuVisible}
            />

            <div className='h-14' />
        </>
    )
}

export default NavigationBar
