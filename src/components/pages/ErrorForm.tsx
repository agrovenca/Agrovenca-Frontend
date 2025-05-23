import { APIErrorDetail } from '@/types/api/responseStatus'
import { XIcon } from 'lucide-react'

type Props = {
  message: string | APIErrorDetail[]
}

function ErrorForm({ message }: Props) {
  const renderMessage = () => {
    if (typeof message === 'string') {
      return <p>{message}</p>
    }

    return (
      <ul className="list-disc ps-5 space-y-1">
        {message.map((err, index) => (
          <li key={index}>
            <strong>{err.path[0]}:</strong> {err.message}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div
      className="flex items-start gap-2 px-4 py-2 mb-4 mt-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
      role="alert"
    >
      <XIcon className="w-4 h-4 mt-1 shrink-0" />
      {renderMessage()}
    </div>
  )
}

export default ErrorForm
