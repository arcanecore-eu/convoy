import { useStoreState } from '@/state'
import { MantineProvider, createEmotionCache } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { ReactNode, useEffect } from 'react'

const emotionCache = createEmotionCache({
    key: 'mantine',
    prepend: false,
})

interface Props {
    children: ReactNode
}

const ThemeProvider = ({ children }: Props) => {
    const theme = useStoreState(state => state.settings.data?.theme)

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme])

    return (
        <MantineProvider
            emotionCache={emotionCache}
            theme={{
                colorScheme: theme === 'dark' ? 'dark' : 'light',
                primaryColor: 'brand',
                colors: {
                    brand: [
                        '#f2edff',
                        '#dfd4ff',
                        '#c3adff',
                        '#a57fff',
                        '#9443e5',
                        '#7b38d2',
                        '#592fbc',
                        '#48249d',
                        '#381b7c',
                        '#29135d',
                    ],
                },

fontFamily: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
defaultRadius: 'md',

            }}
        >
            <NotificationsProvider>{children}</NotificationsProvider>
        </MantineProvider>
    )
}

export default ThemeProvider
