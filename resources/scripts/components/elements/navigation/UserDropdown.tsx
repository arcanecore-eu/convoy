import { useStoreActions, useStoreState } from '@/state'
import { Avatar } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Menu from '@/components/elements/Menu'

interface Props {
    logout: () => void
    compact?: boolean
    position?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
}

const AVATAR_URL =
    'https://www.gravatar.com/avatar/19f6831203ead6ba2263fa0d9ee898e4?d='

const UserDropdown = ({
    logout,
    compact = false,
    position = 'top-start',
}: Props) => {
    const user = useStoreState(state => state.user.data!)
    const theme =
        useStoreState(state => state.settings.data?.theme) ?? 'light'

    const setTheme = useStoreActions(
        actions => actions.settings.setTheme
    )

    const navigate = useNavigate()
    const { t: tAuth } = useTranslation('auth')

    return (
        <Menu width={236} position={position} offset={8}>
            <Menu.Target>
                <button
                    type='button'
                    className={`w-full rounded-md border border-border bg-surface text-left transition-colors hover:bg-accent-100 ${
                        compact ? 'px-2.5 py-2' : 'px-3 py-2.5'
                    }`}
                >
                    <div className='flex items-center'>
                        <Avatar
                            src={AVATAR_URL}
                            size={compact ? 'sm' : 'md'}
                            radius='xl'
                            className='shrink-0'
                        />

                        <div className='ml-3 min-w-0 flex-1'>
                            <p className='truncate text-[14px] font-semibold text-foreground'>
                                {user.name}
                            </p>

                            {!compact && (
                                <p className='mt-0.5 truncate text-[12px] text-muted'>
                                    {user.email}
                                </p>
                            )}
                        </div>

                        <i className='ri-arrow-up-s-line ml-2 shrink-0 text-[18px] text-muted' />
                    </div>
                </button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    icon={
                        <i className='ri-server-line text-[18px]' />
                    }
                    onClick={() => navigate('/')}
                >
                    Servers
                </Menu.Item>

                {user.rootAdmin && (
                    <Menu.Item
                        icon={
                            <i className='ri-admin-line text-[18px]' />
                        }
                        onClick={() => navigate('/admin')}
                    >
                        Admin
                    </Menu.Item>
                )}

                <Menu.Item
                    icon={
                        <i
                            className={`${
                                theme === 'dark'
                                    ? 'ri-sun-line'
                                    : 'ri-moon-line'
                            } text-[18px]`}
                        />
                    }
                    onClick={() =>
                        setTheme(
                            theme === 'light' ? 'dark' : 'light'
                        )
                    }
                >
                    {theme === 'dark'
                        ? 'Light mode'
                        : 'Dark mode'}
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                    color='red'
                    icon={
                        <i className='ri-logout-box-r-line text-[18px]' />
                    }
                    onClick={logout}
                >
                    {tAuth('sign_out')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}

export default UserDropdown
