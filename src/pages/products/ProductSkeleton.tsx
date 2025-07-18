import { Card, CardContent, CardFooter } from '@/components/ui/card'

function ProductSkeleton({ renderMode }: { renderMode: 'listItem' | 'card' }) {
  if (renderMode === 'listItem') {
    return (
      <Card className="w-full h-[245px] flex-row gap-2 py-0 bg-black">
        <div className="h-full w-[192px] animate-pulse bg-muted rounded-md rounded-tr-none rounded-br-none"></div>
        <div className="flex flex-col flex-1 p-6">
          <p className="h-8 animate-pulse bg-muted rounded-md"></p>
          <div className="flex h-4 gap-2 my-2">
            <p className="h-4 w-20 animate-pulse bg-muted rounded-sm"></p>
            <p className="h-4 w-20 animate-pulse bg-muted rounded-sm"></p>
          </div>
          <div className="space-y-1 mt-4">
            {[...Array(4)].map((_, idx) => (
              <p key={idx} className="h-2 animate-pulse bg-muted rounded-md"></p>
            ))}
          </div>
          <CardFooter className="mt-auto mx-0 px-0 flex justify-between gap-2">
            <p className="h-6 w-20 animate-pulse bg-muted rounded-sm"></p>
            <div className="flex gap-2 items-center">
              <p className="h-8 w-8 animate-pulse bg-muted rounded-sm"></p>
              <p className="h-8 w-40 animate-pulse bg-muted rounded-sm"></p>
            </div>
          </CardFooter>
        </div>
      </Card>
    )
  }
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
