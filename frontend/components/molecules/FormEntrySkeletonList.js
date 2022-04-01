import { Fragment } from 'react'
import FormEntrySkeleton from '../atoms/FormEntrySkeleton'

export default function FormEntrySkeletonList({ length = 10 }) {
  return (
    <Fragment>
      {Array.from({ length }).map(() => (
        <FormEntrySkeleton />
      ))}
    </Fragment>
  )
}