import { ServerContext } from '@/state/server'
import useNotify from '@/util/useNotify'
import { useTranslation } from 'react-i18next'

import updateStatus, { PowerAction } from '@/api/server/updateState'

import Button from '@/components/elements/Button'

const ServerPowerBlock = () => {
    const { t } = useTranslation('server.overview')
    const uuid = ServerContext.useStoreState(state => state.server.data?.uuid)
    const state = ServerContext.useStoreState(state => state.status.data?.state)
    const getStatus = ServerContext.useStoreActions(actions => actions.status.getStatus)
    const notify = useNotify()

    const update = (action: PowerAction) => {
        updateStatus(uuid!, action)
            .then(() => {
                notify({
                    message: t('notices.power_action_sent_success'),
                    color: 'green',
                })
                window.setTimeout(() => {
                    if (uuid) getStatus(uuid).catch(() => undefined)
                }, 1200)
            })
            .catch(() =>
                notify({
                    message: t('notices.power_action_sent_fail'),
                    color: 'red',
                })
            )
    }

    return (
        <div className='flex flex-wrap items-center gap-2'>
            {state === 'stopped' ? (
                <Button
                    size='sm'
                    className='transition-colors'
                    disabled={!state}
                    onClick={() => update('start')}
                >
                    {t('power_actions.start')}
                </Button>
            ) : (
                <>
                    <Button
                        size='sm'
                        className='transition-colors'
                        disabled={state !== 'running'}
                        onClick={() => update('restart')}
                    >
                        {t('power_actions.restart')}
                    </Button>
                    <Button
                        size='sm'
                        className='transition-colors'
                        color='danger'
                        variant='filled'
                        disabled={state !== 'running'}
                        onClick={() => update('shutdown')}
                    >
                        {t('power_actions.shutdown')}
                    </Button>
                </>
            )}
        </div>
    )
}

export default ServerPowerBlock
