import { useStoreState } from '@/state'
import { Skeleton } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import useSWR from 'swr'

import getServers from '@/api/getServers'

import Pagination from '@/components/elements/Pagination'

import ServerCard from '@/components/dashboard/ServerCard'

const ServerContainer = () => {
    const { t } = useTranslation('dashboard.index')
    const { search } = useLocation()

    const searchParams = new URLSearchParams(search)

    const defaultPage = Number(
        searchParams.get('page') || '1'
    )

    const query = searchParams.get('q') ?? ''

    const [page, setPage] = useState(
        !isNaN(defaultPage) && defaultPage > 0
            ? defaultPage
            : 1
    )

    const [showAllServers, setShowAllServers] =
        useState(false)

    const [debouncedQuery] =
        useDebouncedValue(query, 200)

    const rootAdmin = useStoreState(
        state => state.user.data!.rootAdmin
    )

    const serverScope =
        rootAdmin && showAllServers
            ? 'all'
            : 'mine'

    const { data } = useSWR(
        [
            '/api/client/servers',
            serverScope,
            page,
            debouncedQuery,
        ],
        () =>
            getServers({
                query: debouncedQuery,
                page,
                type:
                    serverScope === 'all'
                        ? 'all'
                        : undefined,
                perPage: 51,
            })
    )

    useEffect(() => {
        setPage(1)
    }, [debouncedQuery, showAllServers])

    return (
        <>
            {!data ? (
                <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-2'>
                    {[1, 2, 3, 4].map(value => (
                        <Skeleton
                            key={value}
                            height='235px'
                            radius='md'
                        />
                    ))}
                </div>
            ) : data.pagination.total === 0 ? (
                <div className='rounded-lg border border-border bg-surface px-6 py-12 text-center'>
                    <p className='text-[14px] text-muted'>
                        {showAllServers
                            ? t(
                                  'no_servers_admin_empty_state'
                              )
                            : t(
                                  'no_servers_empty_state'
                              )}
                    </p>
                </div>
            ) : (
                <Pagination
                    data={data}
                    onPageSelect={setPage}
                >
                    {({ items }) => (
                        <div className='grid gap-5 sm:grid-cols-2 xl:grid-cols-2'>
                            {items.map(server => (
                                <ServerCard
                                    key={server.uuid}
                                    server={server}
                                />
                            ))}
                        </div>
                    )}
                </Pagination>
            )}
        </>
    )
}

export default ServerContainer
