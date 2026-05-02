import { notFound } from 'next/navigation'
import { getServiceWithSteps } from '../actions'
import ServiceEditor from './ServiceEditor'

export default async function ServiceEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const service = await getServiceWithSteps(id)
  if (!service) notFound()
  return <ServiceEditor service={service} />
}