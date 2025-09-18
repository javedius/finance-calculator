import PageHeader from '@/components/PageHeader'
import FinesPenaltiesCalculator from '@/components/FinesPenaltiesCalculator'

export default function FinesPenaltiesPage() {
  return (
    <div>
      <PageHeader
        title="Штрафы и пени"
        description="Расчет штрафов за просрочки налогов, ГИБДД, коммунальных платежей"
        icon="⚠️"
      />
      <FinesPenaltiesCalculator />
    </div>
  )
}
