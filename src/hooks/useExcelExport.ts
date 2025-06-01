import { AxiosResponse } from 'axios'

export function useExcelExport() {
  const exportExcel = async (
    requestFn: () => Promise<AxiosResponse<Blob>>,
    fallbackFilename: string
  ) => {
    try {
      const response = await requestFn()

      // Obtener el nombre del archivo del header 'content-disposition'
      const disposition = response.headers['content-disposition']
      console.log(disposition)
      let filename = fallbackFilename

      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename="?([^"]+)"?/)
        if (match?.[1]) {
          filename = match[1]
        }
      }

      const blob = response instanceof Blob ? response : response.data

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error al exportar Excel:', error)
      alert('Ocurrió un error al descargar el archivo.')
    }
  }

  return { exportExcel }
}
