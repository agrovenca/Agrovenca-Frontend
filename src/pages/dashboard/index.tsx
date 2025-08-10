import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function RenderCard() {
  return (
    <Card className="w-full max-w-sm transition border-l-6 border-primary shadow-lg">
      <CardHeader>
        <CardTitle>Total usuarios</CardTitle>
        <CardDescription></CardDescription>
        <CardAction>Card Action</CardAction>
      </CardHeader>
      <CardContent>
        <p className="font-extrabold font-serif text-4xl">20.475</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}

function DahsboardIndex() {
  return (
    <section className="flex gap-2 items-center">
      {Array.from({ length: 4 }).map((_item, idx) => (
        <RenderCard key={idx} />
      ))}
    </section>
  )
}

export default DahsboardIndex
