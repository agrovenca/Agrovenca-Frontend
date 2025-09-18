import FacebookIcon from '@/components/icons/Facebook'
import InstagramIcon from '@/components/icons/Instagram'
import TikTokIcon from '@/components/icons/TikTok'
import WhatsAppIcon from '@/components/icons/WhatsApp'

function ContactSocials({ size = 4 }: { size?: number }) {
  return (
    <div className="flex gap-3">
      <a
        href="https://wa.me/584122647923/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#25D366] bg-white dark:bg-black p-2 rounded-md transition hover:outline outline-[#25D366]"
        title="WhatsApp"
      >
        <WhatsAppIcon className={`w-${size} h-${size}`} fill="currentColor" />
      </a>
      <a
        href="https://instagram.com/carnetoday/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#E4405F] bg-white dark:bg-black p-2 rounded-md transition hover:outline outline-[#E4405F]"
        title="Instagram"
      >
        <InstagramIcon className={`w-${size} h-${size}`} fill="currentColor" />
      </a>
      <a
        href="https://facebook.com/agroaliven/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#1877F2] bg-white dark:bg-black p-2 rounded-md transition hover:outline outline-[#1877F2]"
        title="Facebook"
      >
        <FacebookIcon className={`w-${size} h-${size}`} fill="currentColor" />
      </a>
      <a
        href="https://tiktok.com/@carnetoday"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#000] dark:text-white bg-white dark:bg-black p-2 rounded-md transition hover:outline outline-[#000] dark:outline-white"
        title="TikTok"
      >
        <TikTokIcon className={`w-${size} h-${size}`} fill="currentColor" />
      </a>
    </div>
  )
}

export default ContactSocials
