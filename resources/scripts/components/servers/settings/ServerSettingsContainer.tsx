import {
    Navigate,
    Outlet,
    useMatch,
    useParams,
} from 'react-router-dom'

import ServerContentBlock from '@/components/servers/ServerContentBlock'

const ServerSettingsContainer = () => {
    const { id } = useParams()

    const isIndex = useMatch(
        '/servers/:id/settings'
    )

    return (
        <ServerContentBlock
            title='Server Settings'
            showFlashKey='server:settings'
        >
            {isIndex ? (
                <Navigate
                    to={`/servers/${id}/settings/general`}
                    replace
                />
            ) : (
                <Outlet />
            )}
        </ServerContentBlock>
    )
}

export default ServerSettingsContainer
