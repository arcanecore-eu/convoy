import { useStoreActions, useStoreState } from '@/state'
import { LoadingOverlay } from '@mantine/core'
import { ReactNode } from 'react'

import FlashMessageRender from '@/components/elements/FlashMessageRenderer'

interface Props {
    title: string
    description: string
    children?: ReactNode
    submitting?: boolean
}

const LoginFormContainer = ({
    title,
    description,
    children,
    submitting,
}: Props) => {
    const theme =
        useStoreState(state => state.settings.data?.theme) ?? 'light'

    const setTheme = useStoreActions(
        actions => actions.settings.setTheme
    )

    return (
        <div className='min-h-screen bg-background text-foreground'>
            <div className='min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8'>
                <div className='relative w-full max-w-[1040px] overflow-hidden rounded-xl border border-border bg-surface shadow-light dark:shadow-none'>
                    <LoadingOverlay
                        visible={submitting || false}
                        zIndex={5000}
                    />

                    <div className='grid min-h-[620px] lg:grid-cols-[0.92fr_1.08fr]'>
                        {/* Brand panel */}
                        <section className='relative hidden lg:flex flex-col justify-between overflow-hidden bg-primary px-10 py-10 text-white'>
                            {/* Decorative background */}
                            <div className='pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5' />

                            <div className='pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-secondary/20' />

                            <div className='relative z-10 flex-1 flex flex-col justify-center'>
                                <div className='max-w-[340px] mx-auto'>
                                    <h2 className='text-[31px] font-semibold leading-[1.25] tracking-tight'>
                                        Your infrastructure,
                                        <br />
                                        under control.
                                    </h2>

                                    <p className='mt-4 text-[14px] leading-6 text-white/75'>
                                        Manage your virtual servers from one
                                        secure and simple control panel.
                                    </p>

                                    <div className='mt-9 space-y-5'>
                                        <div className='flex items-center gap-3'>
                                            <i className='ri-server-line text-[21px] text-white' />

                                            <span className='text-[14px] font-medium text-white/90'>
                                                Manage your servers
                                            </span>
                                        </div>

                                        <div className='flex items-center gap-3'>
                                            <i className='ri-terminal-box-line text-[21px] text-white' />

                                            <span className='text-[14px] font-medium text-white/90'>
                                                Console and backups
                                            </span>
                                        </div>

                                        <div className='flex items-center gap-3'>
                                            <i className='ri-shield-check-line text-[21px] text-white' />

                                            <span className='text-[14px] font-medium text-white/90'>
                                                Secure account access
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className='relative z-10 text-[11px] text-white/60 text-center'>
                                &copy; {new Date().getFullYear()} Arcane Core
                            </p>
                        </section>

                        {/* Login section */}
                        <section className='relative flex flex-col bg-surface p-6 sm:p-9 lg:p-12'>
                            {/* Appearance toggle */}
                            <button
                                type='button'
                                aria-label='Toggle appearance'
                                title={
                                    theme === 'dark'
                                        ? 'Switch to light mode'
                                        : 'Switch to dark mode'
                                }
                                onClick={() =>
                                    setTheme(
                                        theme === 'light'
                                            ? 'dark'
                                            : 'light'
                                    )
                                }
                                className='absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-md bg-accent-100 text-muted transition-colors hover:text-foreground'
                            >
                                <i
                                    className={`${
                                        theme === 'dark'
                                            ? 'ri-sun-line'
                                            : 'ri-moon-line'
                                    } text-[20px]`}
                                />
                            </button>

                            <div className='my-auto mx-auto w-full max-w-[430px]'>
                                <FlashMessageRender
                                    byKey='auth:sign_in'
                                    className='mb-5'
                                />

                                <div className='mb-8'>
                                    <p className='mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-secondary'>
                                        Account access
                                    </p>

                                    <h1 className='text-[29px] font-semibold tracking-tight text-foreground'>
                                        {title}
                                    </h1>

                                    <p className='mt-2 text-[14px] leading-6 text-muted'>
                                        {description}
                                    </p>
                                </div>

                                {children}
                            </div>

                            <p className='mt-10 text-center text-[11px] text-muted lg:hidden'>
                                &copy; {new Date().getFullYear()} Arcane Core
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginFormContainer
