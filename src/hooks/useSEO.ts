import { useEffect } from 'react'

type MetaTag = {
  name?: string
  property?: string
  content: string
}

interface UseMetaTagsProps {
  title: string
  description: string
  metaTags?: MetaTag[]
}

export function useMetaTags({ title, description, metaTags = [] }: UseMetaTagsProps) {
  useEffect(() => {
    // Set title
    document.title = title

    // Set description
    let descTag = document.querySelector("meta[name='description']")
    if (!descTag) {
      descTag = document.createElement('meta')
      descTag.setAttribute('name', 'description')
      document.head.appendChild(descTag)
    }
    descTag.setAttribute('content', description)

    // Cleanup old custom meta tags (solo los que nosotros creamos)
    const oldCustomTags = document.querySelectorAll('meta[data-custom-meta]')
    oldCustomTags.forEach((tag) => tag.remove())

    // Add new meta tags
    metaTags.forEach((tag) => {
      const meta = document.createElement('meta')
      if (tag.name) meta.setAttribute('name', tag.name)
      if (tag.property) meta.setAttribute('property', tag.property)
      meta.setAttribute('content', tag.content)
      meta.setAttribute('data-custom-meta', 'true') // 🔑 marcar los nuestros
      document.head.appendChild(meta)
    })

    // Cleanup al desmontar
    return () => {
      const cleanTags = document.querySelectorAll('meta[data-custom-meta]')
      cleanTags.forEach((tag) => tag.remove())
    }
  }, [title, description, metaTags])
}
