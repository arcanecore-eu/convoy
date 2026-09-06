import styled from '@emotion/styled'
import tw from 'twin.macro'

interface Props {
    padding?: boolean
}

const ContentContainer = styled.div<Props>`
    ${tw`w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-7`}

    ${({ padding }) => (padding ? tw`py-7 lg:py-8` : '')}
`

export default ContentContainer
