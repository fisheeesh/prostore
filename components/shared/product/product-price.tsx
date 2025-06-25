import { cn } from "@/lib/utils";

export default function ProductPrice({ value, discount, className }: { value: number; discount?: number; className?: string; }) {
    //* Ensure 2 decimal places
    const stringValue = discount ? (value - discount).toFixed(2) : value.toFixed(2)
    //* Get int and float
    const [intValue, floatValue] = stringValue.split('.')

    return (
        <>
            {
                discount ?
                    <p className={cn('text-2xl line-clamp-1', className)}>
                        <span className="text-xs align-super">$</span>
                        <span className="font-bold">{intValue}</span>
                        <span className="text-xs align-super">.{floatValue}</span>
                        <span className="line-through text-muted-foreground text-xs ml-1">${value}</span>
                    </p> :
                    <p className={cn('text-2xl', className)}>
                        <span className="text-xs align-super">$</span>
                        <span className="font-bold">{intValue}</span>
                        <span className="text-xs align-super">.{floatValue}</span>
                    </p>
            }
        </>

    )
}
