function Documentation() {
  return (
    <section className="flex flex-col gap-2">
      <div className="p-4 bg-slate-100 dark:bg-gray-800 border rounded-lg">
        <h3 className="text-lg font-bold mb-4 font-sans text-primary">Id de video</h3>
        <p className="mb-2 font-serif">
          Al crear un producto, puedes agregar un video de youtube. El id del video se encuentra al
          final de la URL.
        </p>
        <div className="font-serif">
          <p className="text-blue-400">
            https://www.youtube.com/watch?v=
            <span className="text-secondary p-1 rounded-md bg-primary">12345abc</span>
          </p>
        </div>
      </div>
      <div className="p-4 bg-slate-100 dark:bg-gray-800 border rounded-lg">
        <h3 className="text-lg font-bold mb-4 font-sans text-primary">Segundo precio</h3>
        <p className="mb-2 font-serif">
          El segundo precio es precio opcional y lo puedes usar para mostrar un precio diferente al
          precio normal.
        </p>
        <div className="font-serif">
          <p className="text-sm text-muted-foreground">
            Por ejemplo, si el precio es <span className="font-bold">10.00</span> y el segundo
            precio es <span className="font-bold">5.00</span>, el usuario verá:
          </p>
          <p className="my-2 text-center">
            <span className="font-bold text-primary">5.00</span>{' '}
            <span className="line-through text-muted-foreground">10.00</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Documentation
