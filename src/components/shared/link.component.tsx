import { cn } from '@/lib/utils'
import BaseLink, { LinkProps as BaseLinkProps } from 'next/link'

export interface LinkProps extends BaseLinkProps {
    noStyle?: boolean
    className?: string
    children: React.ReactNode
}

export default function Link(props: LinkProps) {
    const { children, className, noStyle, ...rest } = props
    return (
        <BaseLink
            className={cn({
                'px-4 py-2 font-bold text-black/70 text-sm bg-white rounded-md shadow-md': !noStyle,
                className,
            })}
            {...rest}
        >
            {children}
        </BaseLink>
    )
}
