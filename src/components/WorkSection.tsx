import { Container } from '@/components/Container'
import { CaseStudyCard } from '@/components/CaseStudyCard'
import { caseStudies } from '@/content/caseStudies'

export function WorkSection() {
  return (
    <section id="work" className="mt-24 md:mt-32">
      <Container>
        <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl dark:text-zinc-100">
          Selected work
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {caseStudies.map((caseStudy) => (
            <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
          ))}
        </div>
      </Container>
    </section>
  )
}
