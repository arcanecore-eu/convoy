import { formatBytes } from '@/util/helpers'
import styled from '@emotion/styled'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import tw from 'twin.macro'

import { ServerBuild } from '@/api/server/getServer'

interface Props {
    server: ServerBuild
}

export const Dt = styled.dt`
    ${tw`text-muted font-medium text-xs`}
`

export const Dd = styled.dd`
    ${tw`text-[14px] text-foreground font-semibold`}
`

const ServerCard = ({ server }: Props) => {
    const { t: tStrings } = useTranslation('strings')

    const memory = useMemo(
        () => formatBytes(server.limits.memory, 0),
        [server.limits.memory]
    )

    const disk = useMemo(
        () => formatBytes(server.limits.disk, 0),
        [server.limits.disk]
    )

    const primaryIp =
        server.limits.addresses.ipv4[0]?.address ??
        server.limits.addresses.ipv6[0]?.address ??
        'Not assigned'

    const statusClass =
        server.status === 'suspended' ||
        server.status?.includes('failed')
            ? 'bg-error-lighter text-error'
            : 'bg-warning-lighter text-warning'

    return (
        <article className='relative flex min-h-[235px] flex-col rounded-lg border border-border bg-surface p-5 overflow-hidden'>
            {/* Decorative circles - exactly like login page */}
            <div className='pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5' />
            <div className='pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-secondary/20' />

            <div className='relative z-10 flex items-start justify-between gap-3'>
                <div className='flex min-w-0 items-start gap-3'>
                    <div className='min-w-0'>
                        <h3 className='truncate text-[16px] font-semibold text-foreground'>
                            {server.name}
                        </h3>

                        <p className='mt-0.5 truncate text-[13px] text-muted'>
                            {server.hostname}
                        </p>
                    </div>
                </div>

                {server.status && (
                    <span
                        className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusClass}`}
                    >
                        {server.status.replaceAll('_', ' ')}
                    </span>
                )}
            </div>

            <div className='relative z-10 mt-6 grid grid-cols-2 gap-x-8 gap-y-3'>
                <div className='flex items-center gap-2'>
                    <i className='ri-global-line text-[17px] text-muted' />
                    <span className='text-[13px] text-muted'>Primary IP:</span>
                    <span className='text-[14px] font-semibold text-foreground truncate'>
                        {primaryIp}
                    </span>
                </div>

                <div className='flex items-center gap-2'>
                    <i className='ri-cpu-line text-[17px] text-muted' />
                    <span className='text-[13px] text-muted'>{tStrings('cpu')}:</span>
                    <span className='text-[14px] font-semibold text-foreground'>
                        {server.limits.cpu} vCPU
                    </span>
                </div>

                <div className='flex items-center gap-2'>
                    <i className='ri-ram-line text-[17px] text-muted' />
                    <span className='text-[13px] text-muted'>{tStrings('memory')}:</span>
                    <span className='text-[14px] font-semibold text-foreground'>
                        {memory.size} {memory.unit}
                    </span>
                </div>

                <div className='flex items-center gap-2'>
                    <i className='ri-hard-drive-2-line text-[17px] text-muted' />
                    <span className='text-[13px] text-muted'>{tStrings('disk')}:</span>
                    <span className='text-[14px] font-semibold text-foreground'>
                        {disk.size} {disk.unit}
                    </span>
                </div>
            </div>

            <div className='relative z-10 mt-auto pt-5'>
                <Link
                    to={`/servers/${server.id}`}
                    className='flex h-10 w-full items-center justify-center rounded-md bg-primary text-[14px] font-semibold text-white'
                >
                    Manage Server
                </Link>
            </div>
        </article>
    )
}

export default ServerCard
