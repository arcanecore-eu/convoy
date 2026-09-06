import { ServerContext } from '@/state/server'
import { formatBytes } from '@/util/helpers'
import { ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

import ContentContainer from '@/components/elements/ContentContainer'
import NavLink from '@/components/elements/navigation/NavLink'
import { RouteDefinition } from '@/components/elements/navigation/NavigationBar'
import ServerPowerBlock from '@/components/servers/overview/ServerPowerBlock'

interface Props {
    routes: RouteDefinition[]
}

const ServerHeader = ({ routes }: Props) => {
    const server = ServerContext.useStoreState(state => state.server.data!)
    const runtimeState = ServerContext.useStoreState(state => state.status.data?.state)
    const getStatus = ServerContext.useStoreActions(actions => actions.status.getStatus)

    useEffect(() => {
        if (server.status === null) {
            getStatus(server.uuid).catch(() => undefined)
        }
    }, [server.uuid, server.status])

    const memory = useMemo(
        () => formatBytes(server.limits.memory, 0),
        [server.limits.memory]
    )
    const disk = useMemo(
        () => formatBytes(server.limits.disk, 0),
        [server.limits.disk]
    )

    const primaryAddress =
        server.limits.addresses.ipv4[0]?.address ??
        server.limits.addresses.ipv6[0]?.address ??
        'No address assigned'

    const statusLabel = server.status
        ? server.status.replaceAll('_', ' ')
        : runtimeState ?? 'unknown'

    const statusClass = server.status
        ? server.status === 'suspended' || server.status.includes('failed')
            ? 'bg-error'
            : 'bg-warning'
        : runtimeState === 'running'
          ? 'bg-success'
          : runtimeState === 'stopped'
            ? 'bg-accent-400'
            : 'bg-warning'

    return (
        <section className='md:ml-[252px] bg-background border-b border-border'>
            <ContentContainer className='pt-6 lg:pt-7'>
                <div className='flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5'>
                    <div className='min-w-0'>
                        <div className='flex items-start gap-3'>
                            <div className='mt-1 w-9 h-9 rounded-full bg-[rgba(89,47,188,0.10)] text-secondary grid place-items-center shrink-0'>
                                <ComputerDesktopIcon className='w-5 h-5' />
                            </div>
                            <div className='min-w-0'>
                                <div className='flex items-center gap-2 min-w-0'>
                                    <span
                                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusClass}`}
                                    />
                                    <h1 className='text-base font-semibold text-foreground truncate'>
                                        {server.name}
                                    </h1>
                                    <span className='text-xs capitalize text-muted hidden sm:inline'>
                                        {statusLabel}
                                    </span>
                                </div>

                                <div className='mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted'>
                                    <span>
                                        <span className='text-muted'>Primary IP:</span>{' '}
                                        <span className='text-foreground'>{primaryAddress}</span>
                                    </span>
                                    <span>
                                        <span className='text-muted'>Hostname:</span>{' '}
                                        <span className='text-foreground'>{server.hostname}</span>
                                    </span>
                                </div>

                                <div className='mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted'>
                                    <span>{server.limits.cpu} vCPU</span>
                                    <span>
                                        {memory.size} {memory.unit} RAM
                                    </span>
                                    <span>
                                        {disk.size} {disk.unit} Disk
                                    </span>
                                    {server.limits.bandwidth !== null && (
                                        <span>
                                            {formatBytes(server.limits.bandwidth, 0).size}{' '}
                                            {formatBytes(server.limits.bandwidth, 0).unit} Transfer
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-2 xl:justify-end'>
                        <Link
                            to={`/servers/${server.id}/terminal`}
                            className='h-9 px-3.5 rounded-md border border-border bg-background text-sm font-medium text-muted hover:text-foreground hover:bg-surface transition-colors inline-flex items-center'
                        >
                            Console
                        </Link>
                        <ServerPowerBlock />
                    </div>
                </div>

                <div className='mt-5 overflow-x-auto scrollbar-hide'>
                    <nav className='flex min-w-max'>
                        {routes.map(route => (
                            <NavLink end={route.end} key={route.path} to={route.path}>
                                {route.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </ContentContainer>
        </section>
    )
}

export default ServerHeader
