import { Card, CardContent, CardFooter } from '@/components/ui/card'

function ProductSkeleton() {
  return (
    <Card className="h-[530px] bg-black p-4">
      <div className="h-[300px] animate-pulse bg-muted rounded-md"></div>
      <CardContent className="flex flex-col gap-3 justify-between h-[207px]">
        <p className="h-6 animate-pulse bg-muted rounded-md"></p>
        <div className="space-y-1">
          {[...Array(4)].map((_, idx) => (
            <p key={idx} className="h-2 animate-pulse bg-muted rounded-md"></p>
          ))}
        </div>
        <CardFooter className="h-[48px] animate-pulse bg-muted mt-auto rounded-md" />
      </CardContent>
    </Card>
  )
}

export default ProductSkeleton
