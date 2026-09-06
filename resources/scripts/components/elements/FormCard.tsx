import styled from '@emotion/styled'
import { ReactNode } from 'react'
import tw from 'twin.macro'

interface FormCard
    extends React.FC<{
        children: ReactNode
        className?: string
    }> {
    Title: React.FC<{ children: ReactNode }>
    Body: React.FC<{ children: ReactNode }>
    Footer: React.FC<{
        children: ReactNode
        className?: string
    }>
}

const FormCard: FormCard = ({
    children,
    className,
}) => (
    <div
        className={`rounded-lg border border-border bg-surface dark:shadow-none ${
            className ?? ''
        }`}
    >
        {children}
    </div>
)

FormCard.Title = styled.h4`
    ${tw`text-foreground text-[18px] font-semibold`}
`

FormCard.Body = styled.div`
    ${tw`p-6 rounded-t-lg bg-surface`}
`

FormCard.Footer = styled.div`
    ${tw`px-6 py-3 rounded-b-lg border-t border-border bg-surface flex justify-center md:justify-end`}
`

export default FormCard
