import { useFlashKey } from '@/util/useFlash'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { z } from 'zod'

import login from '@/api/auth/login'

import TextInputForm from '@/components/elements/forms/TextInputForm'

import LoginFormContainer from '@/components/auth/LoginFormContainer'

const LoginContainer = () => {
    const { t: tAuth } = useTranslation('auth')
    const { t: tStrings } = useTranslation('strings')

    const {
        clearFlashes,
        clearAndAddHttpError,
    } = useFlashKey('auth:sign_in')

    const location = useLocation()

    const [showPassword, setShowPassword] =
        useState(false)

    useEffect(() => {
        document.title = 'Login | Arcane Core'
    }, [])

    const schema = z.object({
        email: z.string().email().nonempty(),
        password: z.string().nonempty(),
    })

    const methods = useForm({
        resolver: zodResolver(schema),
        mode: 'onTouched',
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const submit = async (
        data: z.infer<typeof schema>
    ) => {
        clearFlashes()

        try {
            await login(data)

            window.location =
                location.state?.from.pathname || '/'
        } catch (e) {
            console.error(e)

            clearAndAddHttpError(e as Error)
        }
    }

    const inputClasses = {
        label:
            '!mb-2 !text-[13px] !font-semibold !text-foreground',

        input:
            '!h-11 !rounded-md !border !border-border !bg-background !text-[14px] !text-foreground placeholder:!text-muted focus:!border-primary',
    }

    return (
        <LoginFormContainer
            title='Welcome back'
            description='Sign in to manage your virtual servers.'
            submitting={methods.formState.isSubmitting}
        >
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(
                        submit
                    )}
                    className='space-y-5'
                >
                    <TextInputForm
                        name='email'
                        label={tStrings('email')}
                        placeholder='you@example.com'
                        autoComplete='email'
                        autoFocus
                        icon={
                            <i className='ri-mail-line text-[18px] text-muted' />
                        }
                        classNames={inputClasses}
                    />

                    <TextInputForm
                        name='password'
                        label={tStrings('password')}
                        placeholder='Enter your password'
                        autoComplete='current-password'
                        type={
                            showPassword
                                ? 'text'
                                : 'password'
                        }
                        icon={
                            <i className='ri-lock-2-line text-[18px] text-muted' />
                        }
                        rightSectionWidth={44}
                        rightSection={
                            <button
                                type='button'
                                aria-label={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                                onClick={() =>
                                    setShowPassword(
                                        value => !value
                                    )
                                }
                                className='text-muted hover:text-foreground transition-colors p-0 m-0 bg-transparent border-none outline-none inline-flex'
                            >
                                <i
                                    className={`${
                                        showPassword
                                            ? 'ri-eye-off-line'
                                            : 'ri-eye-line'
                                    } text-[18px]`}
                                />
                            </button>
                        }
                        classNames={inputClasses}
                    />

                    <button
                        type='submit'
                        disabled={
                            methods.formState
                                .isSubmitting
                        }
                        className='mt-2 flex h-11 w-full items-center justify-center rounded-md bg-primary px-5 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        {methods.formState
                            .isSubmitting ? (
                            <>
                                <i className='ri-loader-4-line mr-2 animate-spin text-[18px]' />

                                Signing in...
                            </>
                        ) : (
                            <>
                                {tAuth('sign_in')}

                                <i className='ri-arrow-right-line ml-2 text-[18px]' />
                            </>
                        )}
                    </button>
                </form>
            </FormProvider>
        </LoginFormContainer>
    )
}

export default LoginContainer
