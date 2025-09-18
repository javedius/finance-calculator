import PageHeader from '@/components/PageHeader'
import InsuranceContributionsCalculator from '@/components/InsuranceContributionsCalculator'

export default function InsuranceContributionsPage() {
  return (
    <div>
      <PageHeader
        title="Страховые взносы"
        description="Расчет страховых взносов для ИП и самозанятых с учетом сотрудников"
        icon="🛡️"
      />
      <InsuranceContributionsCalculator />
    </div>
  )
}
