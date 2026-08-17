import { Container } from '@/components/Container'
import { CaseStudyCard } from '@/components/CaseStudyCard'
import { caseStudies } from '@/content/caseStudies'

export function WorkSection() {
  return (
    <section id="work" className="mt-24 md:mt-32">
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-signal-paper sm:text-4xl">
          Selected work
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {caseStudies.map((caseStudy, index) => (
            <CaseStudyCard
              key={caseStudy.slug}
              caseStudy={caseStudy}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
