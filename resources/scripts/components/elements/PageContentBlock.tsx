import { ReactNode, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useMatch } from 'react-router-dom'

import ContentContainer from '@/components/elements/ContentContainer'
import FlashMessageRender from '@/components/elements/FlashMessageRenderer'

export interface PageContentBlockProps {
    title?: string
    className?: string
    showFlashKey?: string
    children?: ReactNode
}

const PageContentBlock = ({
    title,
    showFlashKey,
    className,
    children,
}: PageContentBlockProps) => {
    const ref = useRef(null)
    const isAdminArea = useMatch('/admin/*')

    useEffect(() => {
        if (title) {
            document.title = title
        }
    }, [title])

    const content = (
        <CSSTransition
            nodeRef={ref}
            timeout={150}
            classNames='fade'
            appear
            in
        >
            <div
                ref={ref}
                className={
                    isAdminArea
                        ? ''
                        : 'flex min-h-[calc(100vh-3.5rem)] min-w-0 max-w-full flex-col overflow-x-hidden'
                }
            >
                <div
                    className={
                        isAdminArea
                            ? ''
                            : 'min-w-0 max-w-full flex-1'
                    }
                >
                    <ContentContainer
                        className={className ?? ''}
                        padding
                    >
                        {showFlashKey && (
                            <FlashMessageRender
                                byKey={showFlashKey}
                                className='mb-5'
                            />
                        )}

                        {children}
                    </ContentContainer>
                </div>

                <footer
                    className={
                        isAdminArea
                            ? ''
                            : 'mt-auto min-w-0 w-full shrink-0'
                    }
                >
                    <ContentContainer>
                        <div className='flex items-center justify-between pb-6 pt-4'>
                            <p className='text-xs text-muted'>
                                &copy; {new Date().getFullYear()} Arcane Core
                            </p>
                        </div>
                    </ContentContainer>
                </footer>
            </div>
        </CSSTransition>
    )

    if (isAdminArea) return content

    return (
        <main className='min-w-0 max-w-full overflow-x-hidden md:ml-[252px]'>
            {content}
        </main>
    )
}

export default PageContentBlock
