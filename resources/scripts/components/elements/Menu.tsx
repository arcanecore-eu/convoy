import styled from '@emotion/styled'
import {
    Menu as MantineMenu,
    MenuItemProps,
    MenuProps,
} from '@mantine/core'
import { FC, MouseEventHandler } from 'react'
import tw from 'twin.macro'

interface Menu extends FC<MenuProps> {
    Dropdown: typeof StyledMenuDropdown
    Target: typeof MantineMenu.Target
    Divider: typeof StyledDivider
    Item: typeof StyledMenuItem
}

const StyledMenuDropdown = styled(MantineMenu.Dropdown)`
    &.mantine-Menu-dropdown {
        ${tw`p-2 bg-surface border border-border shadow-lg dark:shadow-none text-sm rounded-md`}
    }
`

const StyledMenuItem = styled(MantineMenu.Item)<
    MenuItemProps & {
        onClick?: MouseEventHandler<HTMLButtonElement>
        disabled?: boolean
    }
>`
    &.mantine-Menu-item {
        ${tw`w-full h-10 px-3 rounded-md bg-transparent text-foreground disabled:text-accent-300 disabled:cursor-not-allowed transition-colors`}
    }

    &.mantine-Menu-item:hover {
        ${tw`bg-accent-100`}
    }

    ${({ color }) =>
        color === 'red'
            ? tw`text-error hover:bg-error-lighter`
            : tw`text-foreground`}
`

const StyledDivider = styled(MantineMenu.Divider)`
    ${tw`my-2 mx-1 bg-border`}
`

const Menu: Menu = props => <MantineMenu {...props} />

Menu.Dropdown = StyledMenuDropdown
Menu.Target = MantineMenu.Target
Menu.Divider = StyledDivider
Menu.Item = StyledMenuItem

export default Menu
