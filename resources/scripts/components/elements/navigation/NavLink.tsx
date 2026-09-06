import { NavLinkProps, NavLink as RouterLink } from 'react-router-dom'

interface Props extends Omit<NavLinkProps, 'className'> {}

const NavLink = ({ children, ...props }: Props) => {
    const defaultClasses =
        'text-sm transition-colors leading-5 py-3.5 px-2.5 relative grid place-items-center nav-link whitespace-nowrap font-medium'

    return (
        <RouterLink
            {...props}
            className={({ isActive }) =>
                isActive
                    ? `${defaultClasses} nav-link-active text-foreground`
                    : `${defaultClasses} text-muted hover:text-foreground`
            }
        >
            {children}
        </RouterLink>
    )
}

export default NavLink
