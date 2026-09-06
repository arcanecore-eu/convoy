import { useStoreState } from '@/state'
import { Switch } from '@mantine/core'
import { useState } from 'react'

import PageContentBlock from '@/components/elements/PageContentBlock'

import ServersContainer from '@/components/dashboard/ServersContainer'

const DashboardContainer = () => {
    const user = useStoreState(state => state.user.data!)
    const firstName = user.name.split(' ')[0]

    const [showAllServers, setShowAllServers] =
        useState(false)

    const AVATAR_URL =
        'https://www.gravatar.com/avatar/19f6831203ead6ba2263fa0d9ee898e4?d='

    const quickCards = [
        {
            title: 'Support',
            description: 'Contact us for support',
            icon: 'ri-headphone-line',
            link: 'https://discord.gg/pN8B72Hfjx',
        },
        {
            title: 'New Service',
            description: 'Order a new service',
            icon: 'ri-shopping-bag-3-line',
            link: 'https://arcanecore.eu',
        },
        {
            title: 'Billing',
            description: 'Access the billing area',
            icon: 'ri-bank-card-line',
            link: 'https://arcanecore.eu/login',
        },
    ]

    return (
        <PageContentBlock
            title='Dashboard'
            showFlashKey='dashboard'
        >
            <div className='pt-6'>
                {/* Admin-only server scope toggle */}
                {user.rootAdmin && (
                    <div className='mb-4 flex items-center justify-end gap-3'>
                        <span className='text-[12px] font-medium uppercase tracking-wide text-muted'>
                            {showAllServers
                                ? 'Showing all servers'
                                : 'Showing your servers'}
                        </span>

                        <Switch
                            color='brand'
                            checked={showAllServers}
                            onChange={event =>
                                setShowAllServers(
                                    event.currentTarget.checked
                                )
                            }
                        />
                    </div>
                )}

                {/* Welcome Card */}
                <section className='mb-4 rounded-lg border border-border bg-surface px-5 py-5 sm:px-6'>
                    <div className='flex items-center gap-4'>
                        <img
                            src={AVATAR_URL}
                            alt='Avatar'
                            className='h-12 w-12 shrink-0 rounded-xl object-cover'
                        />

                        <div>
                            <h1 className='text-[19px] font-semibold text-foreground'>
                                Welcome back, {firstName}
                            </h1>

                            <p className='mt-1 text-[14px] leading-6 text-muted'>
                                Here you can see all the VPS servers you
                                have access to.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Quick Action Cards */}
                <div className='mb-7 grid gap-4 md:grid-cols-3'>
                    {quickCards.map(card => (
                        <a
                            key={card.title}
                            href={card.link}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex min-h-[92px] cursor-pointer items-center gap-4 rounded-lg border border-border bg-surface px-5 py-4 transition-colors hover:bg-accent-100'
                        >
                            <i
                                className={`${card.icon} shrink-0 text-[26px] leading-none text-secondary`}
                            />

                            <div>
                                <h2 className='text-[16px] font-semibold text-foreground'>
                                    {card.title}
                                </h2>

                                <p className='mt-1 text-[13px] text-muted'>
                                    {card.description}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>

                <ServersContainer
                    showAllServers={showAllServers}
                />
            </div>
        </PageContentBlock>
    )
}

export default DashboardContainer
