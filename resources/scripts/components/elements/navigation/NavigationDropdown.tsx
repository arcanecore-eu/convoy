import { useStoreState } from '@/state'
import {
    AdjustmentsHorizontalIcon,
    ArchiveBoxIcon,
    CommandLineIcon,
    Cog6ToothIcon,
    CpuChipIcon,
    GlobeAltIcon,
    ServerStackIcon,
    ShieldCheckIcon,
    Squares2X2Icon,
    WrenchScrewdriverIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { Avatar } from '@mantine/core'
import { ReactNode, useEffect } from 'react'
import {
    Link,
    NavLink as RouterNavLink,
    useLocation,
} from 'react-router-dom'

import Logo from '@/components/elements/Logo'

interface Props {
    logout: () => void
    onClose: () => void
    visible?: boolean
}

const AVATAR_URL =
    'https://www.gravatar.com/avatar/19f6831203ead6ba2263fa0d9ee898e4?d='

interface MobileLinkProps {
    to: string
    icon: ReactNode
    children: ReactNode
    end?: boolean
    nested?: boolean
    onClose: () => void
}

const MobileLink = ({
    to,
    icon,
    children,
    end,
    nested,
    onClose,
}: MobileLinkProps) => (
    <RouterNavLink
        to={to}
        end={end}
        onClick={onClose}
        className={`group relative overflow-hidden h-10 rounded-md flex items-center ${
            nested ? 'pl-7 pr-3' : 'px-3'
        }`}
    >
        {({ isActive }) => (
            <>
                <span
                    className={`absolute inset-0 bg-gradient-to-l from-[rgba(89,47,188,0.28)] via-[rgba(89,47,188,0.10)] to-transparent ${
                        isActive
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                    }`}
                />

                <span
                    className={`absolute right-0 top-1 bottom-1 w-[3px] bg-secondary rounded-l-full ${
                        isActive
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                    }`}
                />

                <span
                    className={`relative z-10 ${
                        isActive ? 'text-secondary' : 'text-muted'
                    }`}
                >
                    {icon}
                </span>

                <span
                    className={`relative z-10 ml-3 text-sm ${
                        isActive
                            ? 'text-foreground font-semibold'
                            : 'text-muted font-medium'
                    }`}
                >
                    {children}
                </span>
            </>
        )}
    </RouterNavLink>
)

const NavigationDropdown = ({ logout, onClose, visible }: Props) => {
    const user = useStoreState(state => state.user.data)
    const location = useLocation()

    const serverMatch = location.pathname.match(/^\/servers\/([^/]+)/)
    const serverId = serverMatch?.[1]

    useEffect(() => {
        if (visible) {
            document.body.classList.add('overflow-hidden')
        } else {
            document.body.classList.remove('overflow-hidden')
        }

        return () => document.body.classList.remove('overflow-hidden')
    }, [visible])

    if (!visible) return null

    return (
        <div className='md:hidden fixed inset-0 z-[3500]'>
            <button
                aria-label='Close navigation'
                className='absolute inset-0 bg-black/60'
                onClick={onClose}
            />

            <aside className='absolute inset-y-0 left-0 w-[300px] max-w-[88vw] bg-background border-r-2 border-border flex flex-col shadow-2xl'>
                <div className='h-14 px-4 flex items-center justify-between border-b-2 border-border'>
                    <Link
                        to='/'
                        onClick={onClose}
                        className='flex items-center gap-2.5'
                    >
                        <Logo className='w-5 h-5 text-primary' />

                        <span className='text-sm font-semibold text-foreground'>
                            Convoy
                        </span>
                    </Link>

                    <button
                        className='w-8 h-8 rounded-md grid place-items-center text-muted hover:text-foreground hover:bg-surface transition-colors'
                        onClick={onClose}
                    >
                        <XMarkIcon className='w-5 h-5' />
                    </button>
                </div>

                <nav className='px-3 py-5 flex-1 overflow-y-auto'>
                    <p className='px-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-muted mb-2'>
                        Resources
                    </p>

                    <MobileLink
                        to='/'
                        end
                        onClose={onClose}
                        icon={
                            <ServerStackIcon className='w-[18px] h-[18px]' />
                        }
                    >
                        Servers
                    </MobileLink>

                    {serverId && (
                        <>
                            <p className='px-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-muted mt-7 mb-2'>
                                Server
                            </p>

                            <MobileLink
                                to={`/servers/${serverId}`}
                                end
                                onClose={onClose}
                                icon={
                                    <Squares2X2Icon className='w-[18px] h-[18px]' />
                                }
                            >
                                Overview
                            </MobileLink>

                            <MobileLink
                                to={`/servers/${serverId}/terminal`}
                                onClose={onClose}
                                icon={
                                    <CommandLineIcon className='w-[18px] h-[18px]' />
                                }
                            >
                                Console
                            </MobileLink>

                            <MobileLink
                                to={`/servers/${serverId}/backups`}
                                onClose={onClose}
                                icon={
                                    <ArchiveBoxIcon className='w-[18px] h-[18px]' />
                                }
                            >
                                Backups
                            </MobileLink>

                            <MobileLink
                                to={`/servers/${serverId}/settings`}
                                onClose={onClose}
                                icon={
                                    <Cog6ToothIcon className='w-[18px] h-[18px]' />
                                }
                            >
                                Settings
                            </MobileLink>

                            <MobileLink
                                nested
                                to={`/servers/${serverId}/settings/general`}
                                onClose={onClose}
                                icon={
                                    <AdjustmentsHorizontalIcon className='w-4 h-4' />
                                }
                            >
                                General
                            </MobileLink>

                            <MobileLink
                                nested
                                to={`/servers/${serverId}/settings/hardware`}
                                onClose={onClose}
                                icon={<CpuChipIcon className='w-4 h-4' />}
                            >
                                Hardware
                            </MobileLink>

                            <MobileLink
                                nested
                                to={`/servers/${serverId}/settings/network`}
                                onClose={onClose}
                                icon={<GlobeAltIcon className='w-4 h-4' />}
                            >
                                Network
                            </MobileLink>

                            <MobileLink
                                nested
                                to={`/servers/${serverId}/settings/security`}
                                onClose={onClose}
                                icon={<ShieldCheckIcon className='w-4 h-4' />}
                            >
                                Security
                            </MobileLink>
                        </>
                    )}

                    {user?.rootAdmin && (
                        <>
                            <p className='px-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-muted mt-7 mb-2'>
                                Management
                            </p>

                            <MobileLink
                                to='/admin'
                                onClose={onClose}
                                icon={
                                    <WrenchScrewdriverIcon className='w-[18px] h-[18px]' />
                                }
                            >
                                Admin Panel
                            </MobileLink>
                        </>
                    )}
                </nav>

                {user && (
                    <div className='border-t-2 border-border p-3'>
                        <div className='bg-surface border border-border rounded-lg p-3'>
                            <div className='flex items-center'>
                                <Avatar
                                    src={AVATAR_URL}
                                    radius='xl'
                                    size='md'
                                />

                                <div className='min-w-0 ml-3'>
                                    <p className='text-sm font-semibold text-foreground truncate'>
                                        {user.name}
                                    </p>

                                    <p className='text-xs text-muted truncate mt-0.5'>
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={logout}
                                className='mt-3 w-full h-9 px-3 rounded-md text-left text-sm font-medium text-error bg-error-lighter hover:bg-error hover:text-white transition-colors'
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
            </aside>
        </div>
    )
}

export default NavigationDropdown
