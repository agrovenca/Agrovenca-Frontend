import { Card } from '@/components/ui/card'

interface TeamMemberProps {
  name: string
  position: string
  image: string
  quote?: string
}

export function TeamMemberCard({ name, position, image, quote }: TeamMemberProps) {
  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300">
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={image || '/placeholder.svg'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6 space-y-3">
        <div>
          <h3 className="text-xl font-semibold text-foreground text-balance">{name}</h3>
          <p className="text-primary font-medium text-sm uppercase tracking-wider">{position}</p>
        </div>
        {quote && (
          <p className="text-muted-foreground text-sm leading-relaxed text-pretty">"{quote}"</p>
        )}
      </div>
    </Card>
  )
}
