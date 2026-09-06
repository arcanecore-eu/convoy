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
                        : 'min-h-[calc(100vh-3.5rem)] flex flex-col'
                }
            >
                <div className={isAdminArea ? '' : 'flex-1'}>
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

                <ContentContainer className={isAdminArea ? '' : 'mt-auto'}>
                    <div className='flex justify-between items-center pb-6 pt-4'>
                       <p className='text-xs text-muted'>
    &copy; {new Date().getFullYear()} Arcane Core
</p>
                    </div>
                </ContentContainer>
            </div>
        </CSSTransition>
    )

    if (isAdminArea) return content

    return <main className='md:ml-[252px]'>{content}</main>
}

export default PageContentBlock
