import ExtendedTooltip from './ExtendedTooltip'
import { Link } from 'react-router-dom'
import WhatsAppIcon from '../icons/WhatsApp'

function WhatsAppBtn() {
  return (
    <ExtendedTooltip content="Chatea con nosotros">
      <Link
        to={'https://wa.me/584145363248/'}
        className="fixed bottom-4 right-4 z-10 cursor-pointer animate-bounce"
        target="_blank"
      >
        <WhatsAppIcon className="w-10 h-10" fill="#25D366" />
      </Link>
    </ExtendedTooltip>
  )
}

export default WhatsAppBtn
