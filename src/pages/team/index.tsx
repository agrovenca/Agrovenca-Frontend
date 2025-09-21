import Navbar from '@/components/pages/HomeNavbar'
import { TeamMemberCard } from './MemberCard'

import teamMembers from '@/assets/files/team.json'
import Footer from '@/components/pages/Footer'

export function TeamPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="my-12 min-h-screen mx-2">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              Nuestro Equipo
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Conoce a las personas extraordinarias que hacen posible nuestra visión. Cada miembro
              aporta su experiencia única para crear soluciones innovadoras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard
                key={index}
                name={member.name}
                position={member.position}
                image={member.image}
                quote={member.quote}
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
